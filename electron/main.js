// electron/main.js
const { app, BrowserWindow, ipcMain, Menu, dialog, protocol } = require("electron");
const path = require("path");
const fs = require("fs");

const {
  createCustomer,
  editCustomer,
  isNationalIdDuplicate,
  getLatestCustomers,
  searchCustomers,
  getCustomerById,
  getCustomerByNationalId,
} = require("./db/customers");

const {
  createInvoice,
  getTodayInvoices,
  getInvoiceByNumber,
  getInvoiceByNationalId,
  getInvoiceById,
} = require("./db/invoices");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    // titleBarStyle: "hidden", // Optional, good for macOS
    minWidth: 1200,
    minHeight: 600,
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

// solve the file view problem
const protocolName = "secure-image";
protocol.registerSchemesAsPrivileged([{ scheme: protocolName, privileges: { bypassCSP: true } }]);

app.whenReady().then(() => {
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, "");
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      // Handle the error as needed
      console.error(error);
    }
  });

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

// edit customer
ipcMain.handle("customers:edit", (event, data) => {
  // get the customer from db
  const oldCustomer = getCustomerById(data.id);

  if (oldCustomer.national_id_number !== data.national_id_number && isNationalIdDuplicate(data.national_id_number)) {
    return { success: false, error: "کد ملی تکراری است" };
  }

  // Upload the file if provided
  let storedFilePath = oldCustomer.national_card_path || "";
  if (data.filePath) {
    // delete the prev image
    if (oldCustomer.national_card_path && fs.existsSync(oldCustomer.national_card_path)) {
      fs.unlinkSync(oldCustomer.national_card_path);
    }
    // upload the file
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

  const changes = editCustomer({ ...data, national_card_path: storedFilePath });
  return { success: true, changes };
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
// get by national ID
ipcMain.handle("customers:getByNationalId", (event, nationalId) => {
  return getCustomerByNationalId(nationalId);
});
// search for customers
ipcMain.handle("customers:search", (event, criteria) => {
  return searchCustomers(criteria);
});

// create invoice
ipcMain.handle("invoice:add", (event, data) => {
  return createInvoice(data);
});

// get today invoices
ipcMain.handle("invoice:getToday", () => {
  return getTodayInvoices();
});

// get invoice by number
ipcMain.handle("invoice:getByNumber", (event, number) => getInvoiceByNumber(number));
// get invoice by national id
ipcMain.handle("invoice:getByNationalId", (event, nationalId) => getInvoiceByNationalId(nationalId));

ipcMain.handle("invoice:getById", (event, id) => getInvoiceById(id));

// handle the print
