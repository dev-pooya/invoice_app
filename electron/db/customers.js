const { getDbInstance } = require("../db");
const { logInfo, logError } = require("../helpers/logger");

const db = getDbInstance();
function createCustomer(data) {
  const stmt = db.prepare(`
    INSERT INTO customers (full_name, national_id_number, address, phone_number, national_card_path, post_code)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.full_name,
    data.national_id_number,
    data.address || "",
    data.phone_number || "",
    data.national_card_path || "",
    data.post_code || ""
  );

  return result.lastInsertRowid;
}

function editCustomer(data) {
  const stmt = db.prepare(`
    UPDATE customers SET full_name = ?, national_id_number = ?, address = ?, phone_number = ?, national_card_path = ?, post_code = ?  WHERE id = ?`);

  const result = stmt.run(
    data.full_name,
    data.national_id_number,
    data.address || "",
    data.phone_number || "",
    data.national_card_path || "",
    data.post_code || "",
    data.id
  );

  return result.changes;
}

function isNationalIdDuplicate(nationalId) {
  const row = db.prepare("SELECT 1 FROM customers WHERE national_id_number = ?").get(nationalId);
  return !!row;
}

function getAllCustomers() {
  return db.prepare("SELECT * FROM customers ORDER BY created_at DESC").all();
}
function getCustomerById(id, columns = "*") {
  return db.prepare(`SELECT ${columns} FROM customers WHERE id = ?`).get(id);
}
function getLatestCustomers(limit = 20) {
  return db
    .prepare("SELECT id, full_name, national_id_number, phone_number FROM customers ORDER BY id DESC LIMIT ?")
    .all(limit);
}

// search customers
function searchCustomers(criteria) {
  if (criteria.name === "national_id_number") {
    return db.prepare("SELECT * FROM customers WHERE national_id_number = ? LIMIT 1").all(criteria.value);
  }

  if (criteria.name === "full_name") {
    return db
      .prepare("SELECT * FROM customers WHERE full_name LIKE ? ORDER BY created_at DESC LIMIT 30")
      .all(`%${criteria.value}%`);
  }

  return []; // no filter provided
}

function getCustomerByNationalId(nationalId) {
  return db.prepare("SELECT * FROM customers WHERE national_id_number = ?").get(nationalId);
}

// delete customer by id
const deleteCustomer = db.transaction((id) => {
  const deleteStmt = db.prepare("DELETE FROM customers WHERE id = ?");
  return deleteStmt.run(id);
});

function insertManyCustomers(newCustomers, maxRows = 5000) {
  if (!Array.isArray(newCustomers) || newCustomers.length === 0) {
    logInfo("📥 No customer data provided for import.");
    return [];
  }

  const limitedCustomers = newCustomers.slice(0, maxRows);
  const added = [];

  const insert = db.prepare(`
    INSERT OR IGNORE INTO customers 
    (full_name, national_id_number, phone_number, address, post_code) 
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertTransaction = db.transaction((customers) => {
    for (const c of customers) {
      try {
        insert.run(
          c.full_name?.trim() || "",
          c.national_id_number?.trim() || "",
          c.phone_number?.trim() || "",
          c.address?.trim() || "",
          c.post_code?.trim() || ""
        );
        added.push(c);
        // logInfo(`✅ Imported customer: ${c.full_name} (${c.national_id_number})`);
      } catch (err) {
        logError(`❌ Failed to insert customer ${c.full_name} (${c.national_id_number}): ${err.message}`);
      }
    }
  });

  try {
    insertTransaction(limitedCustomers);
    logInfo(`📦 Customer import complete: ${added.length} added out of ${limitedCustomers.length}`);
  } catch (err) {
    logError("❌ Customer import transaction failed: " + err.message);
  }

  return added;
}

module.exports = {
  createCustomer,
  editCustomer,
  isNationalIdDuplicate,
  getAllCustomers,
  getLatestCustomers,
  getCustomerById,
  searchCustomers,
  getCustomerByNationalId,
  deleteCustomer,
  insertManyCustomers,
};
