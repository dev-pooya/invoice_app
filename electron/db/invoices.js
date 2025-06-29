const { db } = require("../db");

function generateInvoiceNumber(date) {
  const prefix = `${date}-`;
  const row = db
    .prepare(`SELECT number FROM invoices WHERE number LIKE ? ORDER BY number DESC LIMIT 1`)
    .get(`${prefix}%`);

  let next = 1;

  if (row) {
    const lastDigits = parseInt(row.number.split("-")[1], 10);
    next = lastDigits + 1;
  }

  return `${prefix}${String(next).padStart(3, "0")}`;
}

const createInvoice = db.transaction((invoiceData) => {
  const { customer_id, bank_number, date, type, category, items } = invoiceData;

  const total = items.reduce((sum, item) => {
    return sum + parseFloat(item.qty) * parseInt(item.fee);
  }, 0);

  const number = generateInvoiceNumber(date);

  // Insert into invoices
  const invoiceStmt = db.prepare(`
    INSERT INTO invoices (customer_id, number, date, total, bank_number, type, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = invoiceStmt.run(customer_id, number, date, total, bank_number, type, category || null);

  const invoice_id = result.lastInsertRowid;

  // Bulk insert items
  if (items.length > 0) {
    const placeholders = items.map(() => `(?, ?, ?, ?)`).join(", ");
    const values = [];

    for (const item of items) {
      values.push(invoice_id, item.title, parseInt(item.fee), parseFloat(item.qty));
    }

    const itemInsertQuery = `
      INSERT INTO invoice_items (invoice_id, title, fee, qty)
      VALUES ${placeholders}
    `;

    db.prepare(itemInsertQuery).run(...values);
  }

  return { success: true, invoice_id, number };
});

// get today invoices
function getTodayInvoices() {
  const stmt = db.prepare(`
    SELECT 
      invoices.*,
      customers.full_name,
      customers.national_id_number
    FROM invoices
    JOIN customers ON customers.id = invoices.customer_id
    WHERE DATE(invoices.created_at) = DATE('now', 'localtime')
    ORDER BY invoices.created_at DESC
  `);

  return stmt.all(); // returns an array of invoice rows
}

// find invoice by number
function getInvoiceByNumber(number) {
  const stmt = db.prepare(`
    SELECT 
      invoices.*, 
      customers.full_name, 
      customers.national_id_number
    FROM invoices
    JOIN customers ON customers.id = invoices.customer_id
    WHERE invoices.number = ?
    LIMIT 1
  `);

  return stmt.all(number); // returns single invoice
}

// find invoice by national id number
function getInvoiceByNationalId(nationalId) {
  const stmt = db.prepare(`
  SELECT 
      invoices.*, 
      customers.full_name, 
      customers.national_id_number
    FROM invoices
    JOIN customers ON customers.id = invoices.customer_id
    WHERE customers.national_id_number = ?
    ORDER BY invoices.created_at DESC
  `);

  return stmt.all(nationalId); // returns single invoice
}

function getInvoiceById(id) {
  const stmt1 = db.prepare(`
    SELECT 
      invoices.*, 
      customers.full_name, 
      customers.national_id_number,
      customers.phone_number,
      customers.address
    FROM invoices
    JOIN customers ON customers.id = invoices.customer_id
    WHERE invoices.id = ?
  `);
  const invoice = stmt1.get(id); // returns single invoice

  const stmt2 = db.prepare(`
    SELECT * FROM invoice_items
    WHERE invoice_id = ?
  `);
  const items = stmt2.all(id); // array of items

  return { ...invoice, items };
}

module.exports = {
  createInvoice,
  getTodayInvoices,
  getInvoiceByNumber,
  getInvoiceByNationalId,
  getInvoiceById,
};
