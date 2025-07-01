// electron/main.js
const { app, BrowserWindow, ipcMain, Menu, dialog, protocol, shell } = require("electron");
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
  deleteCustomer,
} = require("./db/customers");

const {
  createInvoice,
  getTodayInvoices,
  getInvoiceByNumber,
  getInvoiceByNationalId,
  getInvoiceById,
  deleteInvoice,
  paginateInvoiceByCustomerId,
} = require("./db/invoices");

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 700,
    titleBarStyle: "hidden", // Optional, good for macOS
    minWidth: 1200,
    minHeight: 600,
    icon: path.join(__dirname, "assets", "icon.ico"), // Make sure the path is correct
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load dev server in dev mode
  // win.loadURL("http://localhost:5173");

  //for production mode
  win.loadFile(path.join(__dirname, "../frontend/dist/index.html"));

  // win.webContents.openDevTools(); // ← This opens DevTools automatically
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

// delete customer
ipcMain.handle("customers:delete", (event, id) => {
  // get image path if exist
  const customer = getCustomerById(id, "national_card_path");

  const imagePath = customer.national_card_path;
  try {
    const result = deleteCustomer(id);
    console.log(`Customer ${id} deleted from database.`);

    // 3. Delete file from disk
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);

      return result;
    } else {
      console.log("Image file does not exist or no image path was set.");
    }
  } catch (err) {
    console.error("Error deleting customer or image:", err);
  }
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

// paginate invoice by customer id
ipcMain.handle("invoice:paginateByCustomerId", (event, id, currentPage) =>
  paginateInvoiceByCustomerId(id, currentPage)
);

// get invoice by number
ipcMain.handle("invoice:getByNumber", (event, number) => getInvoiceByNumber(number));
// get invoice by national id
ipcMain.handle("invoice:getByNationalId", (event, nationalId) => getInvoiceByNationalId(nationalId));

ipcMain.handle("invoice:getById", (event, id) => getInvoiceById(id));
// handle delete
ipcMain.handle("invoice:delete", (event, id) => (deleteInvoice(id)?.changes > 0 ? id : null));

// handle the print
ipcMain.handle("invoice:print", async (event, options = {}) => {
  win.webContents.print(options, (success, errorType) => {
    if (!success) console.log(errorType);
    if (success) console.log("printing...");
  });
});

// handle save as pdf
ipcMain.handle("invoice:savePdf", async (event, options = {}) => {
  const window = BrowserWindow.getFocusedWindow();
  if (!window) return { success: false, error: "No active window" };

  // a) Get Documents/Invoices path
  const documentsPath = app.getPath("documents");
  const invoicesDir = path.join(documentsPath, "Invoices");

  // b) Create the folder if it doesn't exist
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  // c) Set default file path
  const defaultFilePath = path.join(invoicesDir, `invoice${options.id}.pdf`);

  // 1 Show save dialog
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Save Invoice as PDF",
    defaultPath: defaultFilePath,
    filters: [{ name: "PDF Files", extensions: ["pdf"] }],
  });

  if (canceled || !filePath) return { success: false, canceled: true };

  try {
    // 2. Generate PDF with printing styles
    const pdfBuffer = await window.webContents.printToPDF({
      printBackground: true,
      landscape: options.landscape || false, // optional
      pageSize: options.pageSize || "A5", // optional
    });

    // 3. Save to user-selected path
    fs.writeFileSync(filePath, pdfBuffer);
    // 7. Open folder in OS file manager
    setTimeout(() => {
      shell.openPath(path.dirname(filePath));
    }, 2000);

    return { success: true, path: filePath };
  } catch (error) {
    console.error("PDF generation failed:", error);
    return { success: false, error: error.message };
  }
});

// handle window close
ipcMain.handle("window:close", async (event) => {
  // TODO add app.quit()
  win.close();
});
// handle window minimize
ipcMain.handle("window:minimize", async (event) => {
  win.minimize();
});
// handle window maximize
ipcMain.handle("window:maximize", async (event) => {
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});
