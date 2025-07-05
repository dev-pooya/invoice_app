 CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      national_id_number TEXT UNIQUE NOT NULL,
      address TEXT,
      phone_number TEXT,
      national_card_path TEXT,
      post_code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      number TEXT NOT NULL UNIQUE,
      date TEXT NOT NULL,
      total REAL NOT NULL,
      bank_number TEXT,
      type TEXT CHECK(type IN ('sell', 'buy')) NOT NULL,
      category TEXT CHECK(category IN ('coin', 'melton')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      product_id INTEGER ,
      title TEXT NOT NULL,
      fee INTEGER NOT NULL,
      qty REAL NOT NULL,
      kartage REAL, 
      price INTEGER NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
    );
    CREATE INDEX IF NOT EXISTS idx_customers_nid ON customers(national_id_number);
    CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
    CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);