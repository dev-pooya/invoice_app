import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { generateId, getToday } from "../lib/utils";

// 1️ Create the context
const GlobalContext = createContext();

// 2️ Create the provider component
export const GlobalProvider = ({ children }) => {
  const [invoiceFormCustomer, setInvoiceFormCustomer] = useState(null);
  const [invoiceFormNationalId, setInvoiceFormNationalId] = useState();

  const [invoiceFormItems, setInvoiceFormItems] = useState([]);
  const [invoiceFormDate, setInvoiceFormDate] = useState(getToday());
  const [invoiceFormType, setInvoiceFormType] = useState("sell");
  const [invoiceFormCategory, setInvoiceFormCategory] = useState("melton");
  const [isManualDatePicking, setIsManualDatePicking] = useState(false);

  // input refs
  const invoiceFormBankNumberRef = useRef(null);

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
    return Boolean(result);
  }

  // get full invoice formData
  function getInvoiceFormData() {
    // validate
    if (!invoiceFormCustomer || !invoiceFormItems.length) return null;

    return {
      customer_id: invoiceFormCustomer.id,
      date: invoiceFormDate,
      bank_number: invoiceFormBankNumberRef.current.value.trim(),
      type: invoiceFormType,
      category: invoiceFormCategory,
      items: invoiceFormItems,
    };
  }

  // reset the form
  function resetInvoiceForm() {
    setInvoiceFormCustomer(null);
    invoiceFormBankNumberRef.current.value = "";
    setInvoiceFormItems([]);
    setInvoiceFormDate(getToday());
    setIsManualDatePicking(false);
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
        invoiceFormCategory,
        addItem,
        removeItem,
        findCustomer,
        setInvoiceFormNationalId,
        setInvoiceFormDate,
        setIsManualDatePicking,
        setInvoiceFormType,
        setInvoiceFormCustomer,
        getInvoiceFormData,
        resetInvoiceForm,
        setInvoiceFormCategory,
        invoiceFormBankNumberRef,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// 4️ Custom hook for consuming the context
export const useGlobalContext = () => useContext(GlobalContext);
