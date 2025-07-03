import React, { useEffect, useState } from "react";
import noAvatar from "../../assets/no-image.png";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";

import { ChevronLeft, ChevronRight, Eye, Scroll, Trash2, UserPen } from "lucide-react";
import { commaSeprate } from "../../lib/utils";
import { seprateDateParts } from "../../lib/utils";
import EmptyData from "../../components/EmptyData";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Link, useLoaderData } from "react-router";
import { formatRegisterDate } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

function CustomerShow() {
  const customer = useLoaderData();
  const [pendding, setPendding] = useState(true);
  const [pageData, setPageData] = useState({});
  const { totalPages, totalRecords } = pageData;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.electronAPI.paginateInvoiceByCustomerId(customer.id, currentPage).then((res) => {
      setPendding(false);
      return setPageData(res);
    });
  }, [currentPage]);

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
    <div className="p-5  grid grid-cols-[40%] gap-3">
      <Card>
        <CardContent className="text-sm">
          <div className="grid grid-cols-2 gap-4 ">
            <h2 className="font-medium">نام و نام خانوادگی</h2>
            <p>{customer.full_name}</p>
            <h2 className="font-medium">کد ملی</h2>
            <p>{customer.national_id_number}</p>
            <h2 className="font-medium">کد پستی</h2>
            <p>{customer.post_code}</p>
            <h2 className="font-medium">شماره تماس</h2>
            <p>{customer.phone_number}</p>
            <h2 className="font-medium">تاریخ عضویت </h2>
            <p>{formatRegisterDate(customer.created_at)}</p>
            <h2 className="font-medium">آدرس</h2>
            <p>{customer.address}</p>
            <h2 className="font-medium">تعداد فاکتور ها</h2>
            <p>{totalRecords}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex justify-center">
          {customer.national_card_path ? (
            <img src={`file://${customer.national_card_path}`} className=" max-h-64" />
          ) : (
            <img src={noAvatar} className="invert dark:invert-0 rounded-xl" />
          )}
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardContent>
          <div className="rounded-md border mt-3 ">
            <Table dir="rtl">
              <TableCaption> مشاهده ۲۰ فاکتور آخر مشتری </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">شماره فاکتور </TableHead>
                  <TableHead className="text-right">نام و نام خانوادگی</TableHead>

                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-right">جمع مبلغ</TableHead>
                  <TableHead className="text-right">نوع فاکتور </TableHead>
                  <TableHead className="text-center">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!pendding && pageData?.invoices?.length ? (
                  pageData.invoices?.map((invoice) => (
                    <TableRow className="" key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{customer.full_name}</TableCell>

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
                      <TableCell colSpan={7}>
                        <div className="flex justify-center">
                          <EmptyData message="فاکتوری برای این مشتری  وجود ندارد." />
                        </div>
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
          </div>
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
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomerShow;
