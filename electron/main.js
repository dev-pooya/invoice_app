// electron/main.js
const { app, BrowserWindow, ipcMain, Menu, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

const {
  createCustomer,
  isNationalIdDuplicate,
  getLatestCustomers,
  searchCustomers,
  getCustomerById,
} = require("./db/customers");

function createWindow() {
  const win = new BrowserWindow({
    width: 1800,
    height: 600,
    // titleBarStyle: "hidden", // Optional, good for macOS
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load dev server in dev mode
  win.loadURL("http://localhost:5173");
  win.webContents.openDevTools(); // ← This opens DevTools automatically
}

app.whenReady().then(() => {
  // Load DB module AFTER app is ready
  // console.log("ready 1");
  // const { db, initSchema } = require("./db");
  // console.log("ready 4");

  // // Setup schema
  // initSchema();

  // // Insert a test customer
  // try {
  //   const insert = db.prepare(
  //     "INSERT INTO customers (full_name, national_id_number, address, phone_number) VALUES (?, ?, ?, ?)"
  //   );
  //   insert.run("کاربر تست", "1234567890", "تهران", "09121234567");
  //   console.log("✅ Test customer inserted.");
  // } catch (err) {
  //   console.log(
  //     "⚠️ Error inserting (maybe duplicate national ID):",
  //     err.message
  //   );
  // }

  // // Fetch all customers and print them
  // const rows = db.prepare("SELECT * FROM customers").all();
  // console.log("🧾 All customers:", rows);

  createWindow();

  // Remove the default menu
  Menu.setApplicationMenu(null);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// add customer
ipcMain.handle("customers:add", (event, data) => {
  if (isNationalIdDuplicate(data.national_id_number)) {
    return { success: false, error: "کد ملی تکراری است" };
  }

  // Upload the file if provided
  let storedFilePath = "";
  if (data.filePath) {
    const uploadsDir = path.join(app.getPath("userData"), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(data.filePath);
    const random = Math.floor(1000 + Math.random() * 9000);
    const filename = `${data.national_id_number}-${random}${ext}`;
    const destination = path.join(uploadsDir, filename);

    fs.copyFileSync(data.filePath, destination);
    storedFilePath = destination;
  }

  const id = createCustomer({ ...data, national_card_path: storedFilePath });
  return { success: true, id };
});

// ipc for pick file
ipcMain.handle("customers:pickFile", async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Image", extensions: ["jpg", "jpeg", "png"] }],
    properties: ["openFile"],
  });

  if (canceled || filePaths.length === 0) {
    return null;
  }
  return filePaths[0];
});

// get customers
ipcMain.handle("customers:getLatest", () => {
  return getLatestCustomers();
});

// get by ID
ipcMain.handle("customers:getById", (event, id) => {
  return getCustomerById(id);
});

// search for customers
ipcMain.handle("customers:search", (event, criteria) => {
  return searchCustomers(criteria);
});
