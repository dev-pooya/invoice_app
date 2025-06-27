// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getLatestCustomers: () => ipcRenderer.invoke("customers:getLatest"),
  getCustomerById: (id) => ipcRenderer.invoke("customers:getById", id),
  searchCustomers: (criteria) =>
    ipcRenderer.invoke("customers:search", criteria),
  addCustomer: (data) => ipcRenderer.invoke("customers:add", data),
  pickFile: () => ipcRenderer.invoke("customers:pickFile"),
});
