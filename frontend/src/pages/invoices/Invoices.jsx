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
import { Eye, Scroll, Trash2, UserPen } from "lucide-react";
import { commaSeprate } from "../../lib/utils";
import { seprateDateParts } from "../../lib/utils";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [filterInput, setFilterInput] = useState(null);

  console.log(invoices);
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
    if (
      filterInput.name === "national_id_number" &&
      !/^\d{10}$/.test(filterInput.value)
    ) {
      return;
    }

    const result = await window.electronAPI.searchCustomers(filterInput);
    if (result?.length) {
      console.log(result);
      setCustomers(result);
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
          placeholder="جستجو کد ملی"
          name="national_id_number"
          onChange={handleFilterInputChange}
          disabled={filterInput?.name === "full_name"}
        />
        <Input
          placeholder="جستجو نام و نام خانوادگی"
          name="full_name"
          onChange={handleFilterInputChange}
          disabled={filterInput?.name === "national_id_number"}
        />
        <Button type="button" onClick={handleSeachCustomers}>
          جستجو
        </Button>
      </div>
      <div className="rounded-md border mt-3 ">
        <Table dir="rtl">
          <TableCaption> مشاهده فاکتور های امروز (۵۰)</TableCaption>
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
            {invoices.length
              ? invoices.map((invoice) => (
                  <TableRow className="" key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.number}
                    </TableCell>
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
                      <Button
                        asChild
                        variant="secondary"
                        size="icon"
                        className="size-8 text-yellow-600"
                      >
                        <Link to={`/customers/${invoice.id}`}>
                          <Eye />
                        </Link>
                      </Button>

                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-8 text-destructive"
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : ""}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Invoices;
