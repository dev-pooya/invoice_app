// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getLatestCustomers: () => ipcRenderer.invoke("customers:getLatest"),
  getCustomerById: (id) => ipcRenderer.invoke("customers:getById", id),
  getCustomerByNationalId: (nationalId) => ipcRenderer.invoke("customers:getByNationalId", nationalId),
  searchCustomers: (criteria) => ipcRenderer.invoke("customers:search", criteria),
  addCustomer: (data) => ipcRenderer.invoke("customers:add", data),
  deleteCustomer: (id) => ipcRenderer.invoke("customers:delete", id),
  editCustomer: (data) => ipcRenderer.invoke("customers:edit", data),
  pickFile: () => ipcRenderer.invoke("customers:pickFile"),
  addInvoice: (data) => ipcRenderer.invoke("invoice:add", data),
  getTodayInvoices: () => ipcRenderer.invoke("invoice:getToday"),
  getInvoiceByNumber: (number) => ipcRenderer.invoke("invoice:getByNumber", number),
  getInvoiceByNationalId: (nationalId) => ipcRenderer.invoke("invoice:getByNationalId", nationalId),
  getInvoiceById: (id) => ipcRenderer.invoke("invoice:getById", id),
  paginateInvoiceByCustomerId: (id, currentPage) => ipcRenderer.invoke("invoice:paginateByCustomerId", id, currentPage),
  deleteInvoice: (id) => ipcRenderer.invoke("invoice:delete", id),
  printInvoice: (options) => ipcRenderer.invoke("invoice:print", options),
  saveInvoiceAsPdf: (options) => ipcRenderer.invoke("invoice:savePdf", options),
  closeAppWindow: () => ipcRenderer.invoke("window:close"),
  minimizeAppWindow: () => ipcRenderer.invoke("window:minimize"),
  maximizeAppWindow: () => ipcRenderer.invoke("window:maximize"),
  createFullBackup: () => ipcRenderer.invoke("backup:createFull"),
  restoreFullBackup: () => ipcRenderer.invoke("backup:restoreFull"),
});
