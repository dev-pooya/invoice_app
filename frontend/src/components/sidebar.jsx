import React from "react";
import { NavLink } from "react-router";
import { ClipboardList, ClipboardPen, DatabaseBackup, UserRoundPlus, Users } from "lucide-react";
import Logo from "./Logo";

function Sidebar() {
  return (
    <aside className=" bg-slate-900 text-white  min-h-[100vh] no-print">
      <Logo />
      <ul className="flex flex-col gap-3 ">
        <li className="flex items-center">
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              isActive ? "bg-slate-600 p-3 w-full flex items-center gap-3" : "p-3 w-full flex items-center gap-3"
            }
            end
          >
            <Users />
            <span>لیست مشتریان</span>
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink
            to="/customers/create"
            className={({ isActive }) =>
              isActive ? "bg-slate-600 p-3 w-full flex items-center gap-3" : "p-3 w-full flex items-center gap-3"
            }
            end
          >
            <UserRoundPlus />
            <span> افزودن مشتری جدید</span>
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink
            to="/invoices"
            className={({ isActive }) =>
              isActive ? "bg-slate-600 p-3 w-full flex items-center gap-3" : "p-3 w-full flex items-center gap-3"
            }
            end
          >
            {" "}
            <ClipboardList />
            <span> فاکتور ها</span>
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink
            to="/invoices/create"
            className={({ isActive }) =>
              isActive ? "bg-slate-600 p-3 w-full flex items-center gap-3" : "p-3 w-full flex items-center gap-3"
            }
            end
          >
            <ClipboardPen />
            <span>فاکتور جدید</span>
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink
            to="/backup"
            className={({ isActive }) =>
              isActive ? "bg-slate-600 p-3 w-full flex items-center gap-3" : "p-3 w-full flex items-center gap-3"
            }
            end
          >
            {" "}
            <DatabaseBackup />
            <span>پشتیبان گیری</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
