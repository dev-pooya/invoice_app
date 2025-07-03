import React, { useEffect, useRef, useState } from "react";
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

import { ChevronLeft, ChevronRight, Eye, Scroll, Trash2, UserPen } from "lucide-react";
import { commaSeprate } from "../../lib/utils";
import { seprateDateParts } from "../../lib/utils";
import EmptyData from "../../components/EmptyData";
import { formatInvoiceNumberInput } from "../../lib/utils";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import TableSkeleton from "../../components/TableSkeleton";

function Invoices() {
  // const [invoices, setInvoices] = useState([]);
  const [pageData, setPageData] = useState({});
  const [pendding, setPendding] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { totalPages } = pageData;

  // input refs
  const numberRef = useRef(null);
  const nationalIdNumberRef = useRef(null);

  useEffect(() => {
    window.electronAPI.paginateInvoices(currentPage).then((res) => {
      setPendding(false);
      return setPageData(res);
    });
  }, [currentPage]);

  async function handleSearchInvoice() {
    const searchQuery = {};
    let result = {
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
    };
    // get the values and validate them
    const national_id_number = nationalIdNumberRef.current.value.trim();
    const number = numberRef.current.value.trim();

    // set the pendding state
    setPendding(true);

    if (national_id_number.length) {
      searchQuery.name = "national_id_number";
      searchQuery.value = national_id_number;
    }
    if (number.length) {
      searchQuery.name = "number";
      searchQuery.value = number;
    }

    if (searchQuery.name === "number") {
      result.invoices = await window.electronAPI.getInvoiceByNumber(formatInvoiceNumberInput(number));
      setPendding(false);
    } else if (searchQuery.name === "national_id_number") {
      result.invoices = await window.electronAPI.getInvoiceByNationalId(national_id_number);
      setPendding(false);
    } else {
      result = await window.electronAPI.getTodayInvoices();
      setPendding(false);
    }

    setPageData(result);
  }

  async function deleteInvoice(id) {
    const result = await window.electronAPI.deleteInvoice(id);
    if (result) {
      setPageData((prevs) => ({ ...prevs, invoices: prevs.invoices.filter((invoice) => invoice.id !== result) }));
    }
  }

  function changeCurrentPage(target) {
    let page = target;
    if (target <= 0) page = 1;
    if (target > totalPages) page = totalPages;
    if (page !== currentPage) {
      setPendding(true);
      setCurrentPage(page);
    }
  }

  return (
    <div className="p-5">
      <header className="flex items-center gap-1">
        <h1 className="text-xl font-semibold ml-auto">لیست فاکتورها</h1>
        <Button variant="outline" disabled>
          <Link to={"/"}>برون بری | export</Link>
        </Button>
      </header>
      <div className="flex gap-3 mt-5">
        <Input dir="ltr" placeholder="جستجو شماره فاکتور " name="number" ref={numberRef} />
        <Input dir="ltr" placeholder="جستجو کد ملی مشتری" name="national_id_number" ref={nationalIdNumberRef} />
        <Button type="button" onClick={handleSearchInvoice}>
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
            {!pendding && pageData?.invoices?.length ? (
              pageData.invoices.map((invoice) => (
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
                    <Tooltip delayDuration={700}>
                      <TooltipTrigger>
                        <Button asChild variant="secondary" size="icon" className="size-8 text-violet-500">
                          <Link to={`/invoices/${invoice.id}`}>
                            <Eye />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-iransans font-light">مشاهده فاکتور</p>
                      </TooltipContent>
                    </Tooltip>

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
                {pendding ? (
                  <TableCell colSpan="7">
                    <TableSkeleton n={20} />
                  </TableCell>
                ) : (
                  <TableCell colSpan={7}>
                    <div className="flex justify-center">
                      <EmptyData message="فاکتوری برای نمایش وجود ندارد." />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <footer className="my-5 flex justify-center gap-3 flex-wrap" dir="ltr">
          <Button size="sm" variant="outline" onClick={() => changeCurrentPage(currentPage - 1)}>
            <ChevronLeft />
            <span> قبلی</span>
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button size="sm" variant="outline" key={i} onClick={() => changeCurrentPage(i + 1)}>
              {i + 1}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={() => changeCurrentPage(currentPage + 1)}>
            <span> بعدی</span>
            <ChevronRight />
          </Button>
        </footer>
      </div>
    </div>
  );
}

export default Invoices;
