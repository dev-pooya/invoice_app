const { db } = require("../db");

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
  const row = db
    .prepare("SELECT 1 FROM customers WHERE national_id_number = ?")
    .get(nationalId);
  return !!row;
}

function getAllCustomers() {
  return db.prepare("SELECT * FROM customers ORDER BY created_at DESC").all();
}
function getCustomerById(id) {
  return db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
}
function getLatestCustomers(limit = 50) {
  return db
    .prepare("SELECT * FROM customers ORDER BY created_at DESC LIMIT ?")
    .all(limit);
}

// search customers
function searchCustomers(criteria) {
  if (criteria.name === "national_id_number") {
    return db
      .prepare("SELECT * FROM customers WHERE national_id_number = ?")
      .all(criteria.value);
  }

  if (criteria.name === "full_name") {
    return db
      .prepare(
        "SELECT * FROM customers WHERE full_name LIKE ? ORDER BY created_at DESC"
      )
      .all(`${criteria.value}%`);
  }

  return []; // no filter provided
}

function getCustomerByNationalId(nationalId) {
  return db
    .prepare("SELECT * FROM customers WHERE national_id_number = ?")
    .get(nationalId);
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
};
