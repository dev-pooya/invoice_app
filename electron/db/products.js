const { getDbInstance } = require("../db");

const db = getDbInstance();

function createProduct(name) {
  const stmt = db.prepare("INSERT INTO products (name) VALUES (?)");
  // error handle for dublicate product name, (not greate but do the job)
  try {
    const result = stmt.run(name);
    return result;
  } catch (error) {
    return { changes: 0, message: "نام محصول نباید تکراری باشد " };
  }
}

function getAllProducts() {
  const stmt = db.prepare("SELECT * FROM products");
  return stmt.all();
}
function deleteProduct(id) {
  const stmt = db.prepare("DELETE FROM products WHERE id = ?");
  return stmt.run(id);
}
function editProduct(id, name) {
  const stmt = db.prepare("UPDATE products SET name = ? WHERE id = ?");
  // true if a row was updated
  return stmt.run(name, id);
}
module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
  editProduct,
};
