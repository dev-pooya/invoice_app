import React, { createContext, useContext, useState } from "react";
import { generateId, getToday } from "../lib/utils";

// 1️ Create the context
const GlobalContext = createContext();

// 2️ Create the provider component
export const GlobalProvider = ({ children }) => {
  const [invoiceFormCustomer, setInvoiceFormCustomer] = useState(null);
  const [invoiceFormNationalId, setInvoiceFormNationalId] = useState();
  const [invoiceFormBankNumber, setInvoiceFormBankNumber] = useState();
  const [invoiceFormItems, setInvoiceFormItems] = useState([]);
  const [invoiceFormDate, setInvoiceFormDate] = useState(getToday());
  const [invoiceFormType, setInvoiceFormType] = useState("sell");
  const [isManualDatePicking, setIsManualDatePicking] = useState(false);

  // adding item to the items list
  function addItem(item) {
    const id = generateId();
    setInvoiceFormItems([...invoiceFormItems, { id, ...item }]);
  }

  // remove the item
  function removeItem(id) {
    setInvoiceFormItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }

  // search for the customer in the form and set it

  async function findCustomer() {
    const result = await window.electronAPI.getCustomerByNationalId(invoiceFormNationalId);
    setInvoiceFormCustomer(result);
    console.log(result);
    return Boolean(result);
  }

  // get full invoice formData
  function getInvoiceFormData() {
    return {
      customer_id: invoiceFormCustomer.id,
      date: invoiceFormDate,
      bank_number: invoiceFormBankNumber,
      type: invoiceFormType,
      items: invoiceFormItems,
    };
  }

  function resetInvoiceForm() {
    // TODO reset the form
  }

  return (
    <GlobalContext.Provider
      value={{
        invoiceFormCustomer,
        invoiceFormNationalId,
        invoiceFormDate,
        isManualDatePicking,
        invoiceFormItems,
        invoiceFormType,
        invoiceFormBankNumber,

        addItem,
        removeItem,
        findCustomer,
        setInvoiceFormNationalId,
        setInvoiceFormDate,
        setIsManualDatePicking,
        setInvoiceFormType,
        setInvoiceFormBankNumber,
        setInvoiceFormCustomer,
        getInvoiceFormData,
        resetInvoiceForm,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// 4️ Custom hook for consuming the context
export const useGlobalContext = () => useContext(GlobalContext);
