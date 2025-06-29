import React from "react";
import { useLoaderData } from "react-router";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import num2persian from "num2persian";
import { seprateDateParts } from "../../lib/utils";
import { commaSeprate } from "../../lib/utils";
import { roundLastThreeToZero } from "../../lib/utils";

function InvoiceShow() {
  const invoice = useLoaderData();
  console.log(invoice);

  // handle invoice print
  function handlePrintInvoice(e) {
    window.print();
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold">اطلاعات فاکتور </h1>
      <Separator className="my-5" />
      <div id="invoice" className="font-nastalig">
        <header className="grid grid-cols-6 items-center mb-5 px-6">
          <div className="logo ">
            <img src="/logo.png" alt="logo" className="invert w-3/5" />
          </div>
          <div className="col-span-4">
            <h2 className="text-center font-semibold text-3xl">سکه نامدار</h2>
            <p className="text-center text-sm pt-2">فاکتور {invoice?.type === "sell" ? "فروش" : "خرید"}</p>
          </div>
          <div>
            <p className="flex justify-between">
              <span> تاریخ : </span>{" "}
              <span dir="ltr" className="tracking-wide font-iransans ">
                {seprateDateParts(invoice?.date)}
              </span>
            </p>
            <p className="flex justify-between mt-2">
              <span>شماره : </span>{" "}
              <span dir="ltr" className="tracking-wide font-iransans">
                {invoice.number.replace("-", " / ")}
              </span>
            </p>
          </div>
        </header>
        <section className="grid grid-cols-2 gap-2 py-3 px-6 rounded-full border-2 border-black">
          <p className="">
            <span> آقای / خانم : </span>
            <span className="text-center tracking-wider font-iransans">{invoice?.full_name}</span>
          </p>
          <p className="">
            <span> شماره ملی : </span>
            <span className="tracking-wider font-iransans">{invoice.national_id_number}</span>
          </p>
          <p className="">
            <span> شماره همراه : </span>
            <span className="tracking-wider font-iransans">{invoice?.phone_number}</span>
          </p>
          <p className="">
            <span> آدرس : </span>
            <span className=" font-iransans text-sm">{invoice?.address}</span>
          </p>
        </section>
        <section className="mt-5">
          <table className="w-full border-2 border-black border-collapse">
            <thead>
              <tr>
                <th className="w-[50px] text-sm pt-3">ردیف</th>
                <th className="pt-2 align-middle">شرح</th>
                <th className="min-w-[80px]">تعداد</th>
                <th className="pt-3">فی </th>
                <th className="pt-3">قیمت</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.items.length &&
                invoice.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="font-iransans text-center border-2 border-black py-1">{index + 1}</td>
                    <td className="font-iransans border-2 border-black px-2">{item.title}</td>
                    <td className="font-iransans text-center border-2 border-black">{item.qty}</td>
                    <td className="font-iransans text-left border-2 border-black px-2">{commaSeprate(item.fee)}</td>
                    <td className="font-iransans text-left border-2 border-black px-2">
                      {commaSeprate(Math.floor(parseInt(item.fee) * parseFloat(item.qty)))}
                    </td>
                  </tr>
                ))}

              <tr key={"00"}>
                <td className="font-nastalig border-2 border-black px-1 py-2" colSpan={4}>
                  <div className="flex justify-between items-center">
                    <span className="shrink-0">جمع کل به حروف : </span>
                    <span className="font-iransans text-sm tracking-tight ">
                      {num2persian(roundLastThreeToZero(invoice.total))}
                    </span>
                    <span className="shrink-0">به عدد : </span>
                  </div>
                </td>

                <td className="font-iransans font-medium text-left border-2 border-black px-2">
                  {commaSeprate(roundLastThreeToZero(invoice.total))}
                </td>
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
              <span className="font-medium">تلفن</span> <span> 26370017 - 021 </span>
              <p className="pr-5 ">09128912903</p>
            </div>
          </div>
          <p className="justify-self-center">امضاء مشتری :</p>
          <p className="justify-self-center"> مهر و امضاء فروشگاه :</p>
        </footer>
      </div>
      <div>
        <Button type="button" onClick={handlePrintInvoice}>
          پرینت فاکتور{" "}
        </Button>
      </div>
    </div>
  );
}

export default InvoiceShow;
