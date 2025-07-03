import React from "react";
import logoImage from "../../assets/logo.png";
import { useLoaderData } from "react-router";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import num2persian from "num2persian";
import { seprateDateParts } from "../../lib/utils";
import { commaSeprate } from "../../lib/utils";
import { roundLastThreeToZero } from "../../lib/utils";

function InvoiceShow() {
  const invoice = useLoaderData();

  // handle invoice print
  function handlePrintInvoice(e) {
    if (window.electronAPI?.printInvoice) {
      window.electronAPI.printInvoice({ silent: false, landscape: true, pagesPerSheet: 1, pageSize: "A5" }); // you can pass more options later
    } else {
      alert("Printing not available in this environment.");
    }
  }
  // handle invoice save as PDF
  function handleSaveInvoiceAsPdf(e) {
    if (window.electronAPI?.printInvoice) {
      window.electronAPI.saveInvoiceAsPdf({
        silent: true,
        landscape: true,
        pagesPerSheet: 1,
        pageSize: "A5",
        id: invoice.id,
      }); // you can pass more options later
    } else {
      alert("saving not available in this environment.");
    }
  }

  return (
    <div className="p-5 bg-white text-black dark:bg-white dark:text-black">
      <aside className="no-print flex items-center gap-3">
        <h1 className="text-2xl font-semibold ml-auto">اطلاعات فاکتور </h1>
        <Button type="button" onClick={handleSaveInvoiceAsPdf} variant="outline" className="w-xs cursor-pointer">
          ذحیره به صورت PDF
        </Button>
        <Button type="button" onClick={handlePrintInvoice} className="w-xs cursor-pointer">
          پرینت فاکتور{" "}
        </Button>
      </aside>

      <Separator className="my-5" />
      <div id="invoice" className="font-nastalig ">
        <header className="grid grid-cols-6 items-center mb-2 px-6 pt-2">
          <div className="logo ">
            <img src={logoImage} alt="logo" className="invert w-3/5" />
          </div>
          <div className="col-span-4">
            <h2 className="text-center font-semibold text-3xl">سکه نامدار</h2>
            <p className="text-center text-xs pt-2">فاکتور {invoice?.type === "sell" ? "فروش" : "خرید"}</p>
          </div>
          <div>
            <p className="flex justify-between">
              <span> تاریخ : </span>{" "}
              <span dir="ltr" className="tracking-wide font-iransans text-sm">
                {seprateDateParts(invoice?.date)}
              </span>
            </p>
            <p className="flex justify-between mt-2 ">
              <span>شماره : </span>{" "}
              <span dir="ltr" className="tracking-wide font-iransans text-sm">
                {invoice.number.replace("-", "‌/‌")}
              </span>
            </p>
          </div>
        </header>
        <section className="grid grid-cols-2 items-center gap-2 py-4 px-6  rounded-full border-2 border-black">
          <p className="flex gap-1">
            <span> آقای / خانم : </span>
            <span className="text-center tracking-wider font-iransans text-sm grow">{invoice?.full_name}</span>
          </p>
          <p className="flex gap-1">
            <span> شماره ملی : </span>
            <span className="text-center tracking-wider font-iransans text-sm grow">{invoice.national_id_number}</span>
          </p>
          <p className="flex gap-1">
            <span> شماره همراه : </span>
            <span className="text-center tracking-wider font-iransans text-sm grow">{invoice?.phone_number}</span>
          </p>
          <p className="flex gap-1">
            <span className="whitespace-nowrap">آدرس :</span>
            <span className="text-center grow font-iransans text-xs">{invoice?.address}</span>
          </p>
        </section>
        <section className="mt-3">
          <table className="w-full border-2 border-black border-collapse">
            <thead>
              <tr>
                <th className="w-[40px] text-sm pt-3">ردیف</th>
                <th className="pt-2 align-middle">شرح</th>
                <th className="min-w-[80px]">تعداد</th>
                <th className="pt-3">فی </th>
                <th className="pt-3">قیمت (ریال)</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.items.length &&
                invoice.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="font-iransans text-center border-2 border-black py-1 text-sm">{index + 1}</td>
                    <td className="font-iransans border-2 border-black px-2 text-sm">{item.title}</td>
                    <td className="font-iransans text-center border-2 border-black ">{item.qty}</td>
                    <td className="font-iransans text-left border-2 border-black px-2 ">{commaSeprate(item.fee)}</td>
                    <td className="font-iransans text-left border-2 border-black px-2">
                      {commaSeprate(Math.floor(parseInt(item.fee) * parseFloat(item.qty)))}
                    </td>
                  </tr>
                ))}

              <tr key={"00"}>
                <td className="font-nastalig border-2 border-black px-1 py-2" colSpan={4}>
                  <div className="flex justify-between items-center">
                    <span className="shrink-0 relative top-1">جمع کل به حروف : </span>
                    <span className="font-iransans text-sm tracking-tight ">
                      {num2persian(roundLastThreeToZero(invoice.total))} ریال
                    </span>
                    <span className="shrink-0">به عدد : </span>
                  </div>
                </td>

                <td className="font-iransans font-medium text-left border-2 border-black px-2">
                  {commaSeprate(roundLastThreeToZero(invoice.total))}
                </td>
              </tr>
              <tr key={"01"}>
                <td className="font-nastalig border-2 border-black px-1 py-2" colSpan={4}>
                  <div className="flex justify-between items-center">
                    <span className="shrink-0 relative top-1">شماره کارت بانکی : </span>
                    <span className="font-iransans text-sm tracking-tight ">{invoice.bank_number}</span>
                    <span className="shrink-0">پرداخت : </span>
                  </div>
                </td>

                <td className="font-iransans font-medium text-left border-2 border-black px-2"></td>
              </tr>
            </tbody>
          </table>
        </section>
        <footer className="grid grid-cols-4 mt-3 items-center">
          <div className="col-span-2 font-iransans text-xs">
            <p>
              <span className="font-medium">آدرس :‌ </span> نیاوران ، مجتمع تجاری اداری اطلس مال ، طبقه اول تجاری G4 ،
              پلاک 4056
            </p>
            <div className="tracking-wide flex pt-2">
              <span className="font-medium pl-2">تلفن : </span> <span> 26370017 - 021 </span>
              <p className="pr-5 ">09128912903</p>
            </div>
          </div>
          <p className="justify-self-center">امضاء مشتری :</p>
          <p className="justify-self-center"> مهر و امضاء فروشگاه :</p>
        </footer>
      </div>
    </div>
  );
}

export default InvoiceShow;
