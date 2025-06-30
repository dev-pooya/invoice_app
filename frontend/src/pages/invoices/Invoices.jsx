import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Eye, Scroll, Trash2, UserPen } from "lucide-react";
import { commaSeprate } from "../../lib/utils";
import { seprateDateParts } from "../../lib/utils";
import EmptyData from "../../components/EmptyData";
import { formatInvoiceNumberInput } from "../../lib/utils";
import ConfirmDialog from "../../components/ConfirmDialog";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [filterInput, setFilterInput] = useState(null);

  useEffect(() => {
    window.electronAPI.getTodayInvoices().then(setInvoices);
  }, []);

  // handle filter input change
  function handleFilterInputChange(e) {
    if (!e.target.value.length) {
      setFilterInput(null);
    } else {
      setFilterInput({ name: e.target.name, value: e.target.value.trim() });
    }
  }

  async function handleSeachCustomers() {
    // TODO validate here
    if (!filterInput) {
      return;
    }
    if (filterInput.name === "national_id_number" && !/^\d{10}$/.test(filterInput.value)) {
      return;
    }
    if (filterInput.name === "number" && !/^\d{11}$/.test(filterInput.value)) {
      return;
    }

    let result = [];

    if (filterInput.name === "number") {
      result = await window.electronAPI.getInvoiceByNumber(formatInvoiceNumberInput(filterInput.value));
    } else {
      result = await window.electronAPI.getInvoiceByNationalId(filterInput.value);
    }

    setInvoices(result);
  }

  async function deleteInvoice(id) {
    const result = await window.electronAPI.deleteInvoice(id);
    if (result) {
      setInvoices((prevs) => prevs.filter((invoice) => invoice.id !== result));
    }
  }

  return (
    <div className="p-5">
      <header className="flex items-center gap-1">
        <h1 className="text-xl font-semibold ml-auto">لیست فاکتورها</h1>

        <Link to={"/"}>
          <Button variant="outline"> درون ریزی | import</Button>{" "}
        </Link>
        <Link to={"/"}>
          <Button variant="outline"> برون بری | export</Button>{" "}
        </Link>
      </header>
      <div className="flex gap-3 mt-5">
        <Input
          dir="ltr"
          placeholder="جستجو شماره فاکتور "
          name="number"
          onChange={handleFilterInputChange}
          disabled={filterInput?.name === "national_id_number"}
        />

        <Input
          dir="ltr"
          placeholder="جستجو کد ملی مشتری"
          name="national_id_number"
          onChange={handleFilterInputChange}
          disabled={filterInput?.name === "number"}
        />
        <Button type="button" onClick={handleSeachCustomers}>
          جستجو
        </Button>
      </div>
      <div className="rounded-md border mt-3 ">
        <Table dir="rtl">
          <TableCaption> مشاهده فاکتور های امروز </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">شماره فاکتور </TableHead>
              <TableHead className="text-right">نام و نام خانوادگی</TableHead>
              <TableHead className="text-right">کدملی مشتری</TableHead>
              <TableHead className="text-right">تاریخ</TableHead>
              <TableHead className="text-right">جمع مبلغ</TableHead>
              <TableHead className="text-right">نوع فاکتور </TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length ? (
              invoices.map((invoice) => (
                <TableRow className="" key={invoice.id}>
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{invoice.full_name}</TableCell>
                  <TableCell>{invoice.national_id_number}</TableCell>
                  <TableCell>{seprateDateParts(invoice.date)}</TableCell>
                  <TableCell>{commaSeprate(invoice.total)}</TableCell>
                  <TableCell>
                    {invoice.type === "sell" ? (
                      <span className="text-red-600"> فروش</span>
                    ) : (
                      <span className="text-green-600"> خرید</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right flex justify-center gap-2">
                    <Button asChild variant="secondary" size="icon" className="size-8 text-yellow-600">
                      <Link to={`/invoices/${invoice.id}`}>
                        <Eye />
                      </Link>
                    </Button>

                    <ConfirmDialog
                      title="آیا از حذف فاکتور مطمئن هستید ؟"
                      message="در صورت حذف فاکتور امکان بازیابی وجود ندارد!"
                      action={() => deleteInvoice(invoice.id)}
                      opener={
                        <Button variant="secondary" size="icon" className="size-8 text-destructive">
                          <Trash2 />
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex justify-center">
                    <EmptyData message="فاکتوری برای امروز وجود ندارد" />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Invoices;
