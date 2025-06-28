// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getLatestCustomers: () => ipcRenderer.invoke("customers:getLatest"),
  getCustomerById: (id) => ipcRenderer.invoke("customers:getById", id),
  getCustomerByNationalId: (nationalId) =>
    ipcRenderer.invoke("customers:getByNationalId", nationalId),
  searchCustomers: (criteria) =>
    ipcRenderer.invoke("customers:search", criteria),
  addCustomer: (data) => ipcRenderer.invoke("customers:add", data),
  editCustomer: (data) => ipcRenderer.invoke("customers:edit", data),
  pickFile: () => ipcRenderer.invoke("customers:pickFile"),
  addInvoice: (data) => ipcRenderer.invoke("invoice:add", data),
  getTodayInvoices: () => ipcRenderer.invoke("invoice:getToday"),
});
