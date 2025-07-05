// const path = require("path");
// const fs = require("fs");
// const Database = require("better-sqlite3");
// const { app } = require("electron");

// // get userData directory
// const dbFolder = app.getPath("userData");
// const dbPath = path.join(dbFolder, "database.sqlite");

// // create folder if not exists
// if (!fs.existsSync(dbFolder)) {
//   fs.mkdirSync(dbFolder, { recursive: true });
// }

// // connect to db
// const db = new Database(dbPath);

// // enable foreign keys
// db.pragma("foreign_keys = ON");

// // run schema migration
// const initSchema = () => {
//   db.exec(`
//     CREATE TABLE IF NOT EXISTS customers (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       full_name TEXT NOT NULL,
//       national_id_number TEXT UNIQUE NOT NULL,
//       address TEXT,
//       phone_number TEXT,
//       national_card_path TEXT,
//       post_code TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS invoices (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       customer_id INTEGER NOT NULL,
//       number TEXT NOT NULL UNIQUE,
//       date TEXT NOT NULL,
//       total REAL NOT NULL,
//       bank_number TEXT,
//       type TEXT CHECK(type IN ('sell', 'buy')) NOT NULL,
//       category TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
//     );

//     CREATE TABLE IF NOT EXISTS invoice_items (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       invoice_id INTEGER NOT NULL,
//       title TEXT NOT NULL,
//       fee INTEGER NOT NULL,
//       qty REAL NOT NULL,
//       FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
//     );

//     CREATE INDEX IF NOT EXISTS idx_customers_nid ON customers(national_id_number);
//     CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
//     CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
//   `);
// };

// // call schema initializer
// initSchema();

// // export db
// module.exports = { db, initSchema };

const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const { app } = require("electron");

let db = null;

const dbFolder = app.getPath("userData");
const dbPath = path.join(dbFolder, "database.sqlite");
const migrationsFolder = path.join(__dirname, "migrations");

function ensureDbFolderExists() {
  if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
  }
}

function getDbInstance() {
  if (db) return db;

  ensureDbFolderExists();

  db = new Database(dbPath);
  db.pragma("foreign_keys = ON");

  return db;
}

function closeDb() {
  if (db) {
    db.close();
    db = null;
    console.log("✅ DB connection closed");
  }
}

function runMigrations() {
  const db = getDbInstance();

  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version TEXT UNIQUE NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const applied = new Set(
    db
      .prepare("SELECT version FROM migrations")
      .all()
      .map((row) => row.version)
  );

  const files = fs
    .readdirSync(migrationsFolder)
    .filter((f) => f.endsWith(".sql"))
    .sort(); // 001..., 002..., etc.

  for (const file of files) {
    const version = file.split(".")[0]; // e.g., 001_initial_schema
    if (applied.has(version)) {
      continue; // already applied
    }

    const fullPath = path.join(migrationsFolder, file);
    const sql = fs.readFileSync(fullPath, "utf-8");

    console.log(`🚀 Applying migration ${version}`);
    db.exec(sql);

    db.prepare("INSERT INTO migrations (version) VALUES (?)").run(version);
  }

  console.log("✅ Migrations complete.");
}

module.exports = {
  getDbInstance,
  closeDb,
  runMigrations,
  dbPath,
};
