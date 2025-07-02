import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Outlet } from "react-router";
import Sidebar from "./components/sidebar";
import { DoorClosed, Expand, Minimize, SquareMinus, X } from "lucide-react";

function Layout() {
  function handleClose() {
    window.electronAPI.closeAppWindow();
  }
  function handleMinimize() {
    window.electronAPI.minimizeAppWindow();
  }
  function handleMaximize() {
    window.electronAPI.maximizeAppWindow();
  }

  return (
    <main className="mcc_main grid grid-cols-[220px_1fr] w-full font-display ">
      <header className="col-span-2 flex items-center bg-slate-900 py-1" style={{ WebkitAppRegion: "drag" }}>
        <div className="flex gap-1 items-center  pr-2" style={{ WebkitAppRegion: "no-drag" }}>
          <Button variant="ghost" className="text-primary" onClick={handleClose}>
            <X />
          </Button>
          <Button variant="ghost" className="text-primary" onClick={handleMaximize}>
            <Expand />
          </Button>
          <Button variant="ghost" className="text-primary" onClick={handleMinimize}>
            <SquareMinus />
          </Button>
        </div>
        <h2 className="text-white text-sm font-medium text-center grow tracking-wider">سکه نامدار - فاکتورساز</h2>
      </header>
      <Sidebar />
      <div className="mcc_content bg-background ">
        <Outlet />
        <div className="w-full h-10"></div>
      </div>
    </main>
  );
}

export default Layout;
