import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { ClipboardList, ClipboardPen, DatabaseBackup, ListTodo, Moon, Sun, UserRoundPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

function Sidebar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved || "light";
    setTheme(initial);
    document.body.classList.toggle("dark", initial === "dark");
  }, []);

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark", newTheme === "dark");
  }

  return (
    <aside className=" bg-sidebar text-sidebar-foreground border-l-2 border-sidebar-accent  min-h-[100vh] no-print">
      <Logo />
      <ul className="flex flex-col gap-3 ">
        <li className="flex items-center">
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              isActive
                ? "bg-accent p-3 w-full flex items-center gap-3 border-l-4 border-primary"
                : "p-3 w-full flex items-center gap-3"
            }
            end
          >
            <Users className="text-foreground/85" size={22} />
            <span>لیست مشتریان</span>
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink
            to="/customers/create"
            className={({ isActive }) =>
              isActive
                ? "bg-accent p-3 w-full flex items-center gap-3 border-l-4 border-primary"
                : "p-3 w-full flex items-center gap-3"
            }
            end
          >
            <UserRoundPlus className="text-foreground/85" size={22} />
            <span> افزودن مشتری جدید</span>
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              isActive
                ? "bg-accent p-3 w-full flex items-center gap-3 border-l-4 border-primary"
                : "p-3 w-full flex items-center gap-3"
            }
            end
          >
            {" "}
            <ClipboardList className="text-foreground/85" size={22} />
            <span> فاکتور ها</span>
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink
            to="/invoices/create"
            className={({ isActive }) =>
              isActive
                ? "bg-accent p-3 w-full flex items-center gap-3 border-l-4 border-primary"
                : "p-3 w-full flex items-center gap-3"
            }
            end
          >
            <ClipboardPen className="text-foreground/85" size={22} />
            <span>فاکتور جدید</span>
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "bg-accent p-3 w-full flex items-center gap-3 border-l-4 border-primary"
                : "p-3 w-full flex items-center gap-3"
            }
            end
          >
            <ListTodo className="text-foreground/85" size={22} />
            <span> محصولات</span>
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink
            to="/backups"
            className={({ isActive }) =>
              isActive
                ? "bg-accent p-3 w-full flex items-center gap-3 border-l-4 border-primary"
                : "p-3 w-full flex items-center gap-3"
            }
            end
          >
            <DatabaseBackup className="text-foreground/85" size={22} />
            <span>پشتیبان گیری</span>
          </NavLink>
        </li>
      </ul>

      <Button
        onClick={toggleTheme}
        variant="ghost"
        size="lg"
        className="fixed bottom-0 right-0  w-[220px] justify-start gap-2 rounded-b-none cursor-ponter"
      >
        {theme === "light" ? <Sun size={16} /> : <Moon size={18} />}
        {theme === "light" ? "حالت روز" : "حالت شب"}
      </Button>
    </aside>
  );
}

export default Sidebar;
