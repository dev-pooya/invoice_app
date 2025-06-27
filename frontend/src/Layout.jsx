import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Outlet } from "react-router";
import Sidebar from "./components/sidebar";

function Layout() {
  const [count, setCount] = useState(0);

  return (
    <main className=" grid grid-cols-[220px_1fr] w-full font-display">
      <Sidebar />
      <Outlet />
    </main>
  );
}

export default Layout;
