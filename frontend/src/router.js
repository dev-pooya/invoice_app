import { createBrowserRouter } from "react-router";

import Test from "./pages/Test";
import Layout from "./Layout";
import Customers from "./pages/costomers/Customers";
import CustomersCreate from "./pages/costomers/CustomersCreate";
import CustomerEdit from "./pages/costomers/CustomerEdit";
import CustomerShow from "./pages/costomers/CustomerShow";

async function getCustomer(id) {
  const result = await window.electronAPI.getCustomerById(id);
  return result;
}

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: Test },
      {
        path: "/customers",
        children: [
          { index: true, Component: Customers },
          { path: "create", Component: CustomersCreate },
          {
            path: "edit/:id",
            Component: CustomerEdit,
            loader: async ({ params }) =>
              await getCustomer(parseInt(params.id)),
          },
          {
            path: ":id",
            Component: CustomerShow,
            loader: async ({ params }) =>
              await getCustomer(parseInt(params.id)),
          },
        ],
      },
    ],
  },
]);

export default router;
