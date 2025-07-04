import { createBrowserRouter, createMemoryRouter, Navigate } from "react-router";

import Test from "./pages/Test";
import Layout from "./Layout";
import Customers from "./pages/costomers/Customers";
import CustomersCreate from "./pages/costomers/CustomersCreate";
import CustomerEdit from "./pages/costomers/CustomerEdit";
import CustomerShow from "./pages/costomers/CustomerShow";
import Invoices from "./pages/invoices/Invoices";
import InvoiceCreate from "./pages/invoices/InvoiceCreate";
import InvoiceShow from "./pages/invoices/InvoiceShow";
import Backups from "./pages/backups/Backups";
import Dashboard from "./pages/dashboard/Dashboard";

async function getCustomer(id) {
  const result = await window.electronAPI.getCustomerById(id);
  return result;
}
async function getInvoice(id) {
  const result = await window.electronAPI.getInvoiceById(id);
  return result;
}

const router = createMemoryRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      {
        path: "customers",
        children: [
          { index: true, Component: Customers },
          { path: "create", Component: CustomersCreate },
          {
            path: "edit/:id",
            Component: CustomerEdit,
            loader: async ({ params }) => await getCustomer(parseInt(params.id)),
          },
          {
            path: ":id",
            Component: CustomerShow,
            loader: async ({ params }) => await getCustomer(parseInt(params.id)),
          },
        ],
      },
      {
        path: "invoices",
        children: [
          { index: true, Component: Invoices },
          { path: "create", Component: InvoiceCreate },
          { path: ":id", Component: InvoiceShow, loader: async ({ params }) => await getInvoice(parseInt(params.id)) },
        ],
      },
      {
        path: "backups",
        children: [{ index: true, Component: Backups }],
      },
    ],
  },
]);

export default router;
