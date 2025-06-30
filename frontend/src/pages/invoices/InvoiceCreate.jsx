import React, { useEffect, useRef } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useState } from "react";
import { getToday } from "../../lib/utils";
import { ClipboardList, Database, PlusCircle, Trash2 } from "lucide-react";
import { commaSeprate } from "../../lib/utils";
import { generateId } from "../../lib/utils";
import { useGlobalContext } from "../../context/GlobalContext";
import EmptyData from "../../components/EmptyData";

const initialItemForm = {
  title: "",
  qty: "",
  fee: "",
};

function InvoiceCreate() {
  // states for item form
  const [itemForm, setItemForm] = useState(initialItemForm);
  const [errors, setErrors] = useState(null);
  // refs
  const firstInputRef = useRef(null);

  // global states
  const {
    invoiceFormCustomer,
    invoiceFormNationalId,
    invoiceFormDate,
    isManualDatePicking,
    invoiceFormItems,
    invoiceFormType,
    invoiceFormBankNumber,
    addItem,
    removeItem,
    findCustomer,
    setInvoiceFormNationalId,
    setInvoiceFormDate,
    setIsManualDatePicking,
    setInvoiceFormType,
    setInvoiceFormBankNumber,
    getInvoiceFormData,
  } = useGlobalContext();

  // handle the submition of second form for adding the items to the invoice
  function handleSubmitItem(e) {
    e.preventDefault();

    // validate the form
    const errors = {};

    // title: required
    if (!itemForm.title.trim()) {
      errors.title = " شرح کالا الزامی است";
    }

    //  qty: required and digits
    if (!/^\d+(\.\d+)?$/.test(itemForm.qty.trim())) {
      errors.qty = "تعداد را به عدد وارد کنید";
    }
    // fee: required
    if (!/^\d+$/.test(itemForm.fee.trim())) {
      errors.fee = "مقدار فی را به عدد وارد کنید";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // there is safe data
    addItem(itemForm);
    // reset the form
    setItemForm(initialItemForm);
    setErrors(null);

    // Focus on the first input
    firstInputRef.current?.focus();
  }

  // Search the customer form event
  async function handleSearchCustomer(e) {
    e.preventDefault();

    if (!(await findCustomer())) {
      setErrors((prevs) => ({ ...prevs, national_id_number: "مشتری با کد ملی وارد شده یافت نشد" }));
    }
  }

  // handle invoice submition
  async function handleInvoiceSubmition(e) {
    const formData = getInvoiceFormData();

    const result = await window.electronAPI.addInvoice(formData);
    console.log("result = ", result);
  }
  function handleInvoicePreview(e) {
    // TODO
  }

  return (
    <div className="p-5 ">
      <header>
        <h1 className="text-2xl font-semibold mb-5">فرم صدور فاکتور جدید</h1>
      </header>
      <Card>
        <CardContent>
          <form className="flex justify-between gap-6" onSubmit={handleSearchCustomer}>
            <header className="flex flex-col gap-6 ">
              <div className="flex gap-3 items-center">
                <Label>کد ملی مشتری :</Label>

                <div dir="ltr" className="relative">
                  {" "}
                  <InputOTP
                    maxLength={10}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={invoiceFormNationalId}
                    onChange={(value) => setInvoiceFormNationalId(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                      <InputOTPSlot index={8} />
                      <InputOTPSlot index={9} />
                    </InputOTPGroup>
                  </InputOTP>
                  {errors?.national_id_number && (
                    <p className="text-red-500 text-sm mt-1 text-right absolute right-0 -top-6">
                      {errors.national_id_number}
                    </p>
                  )}
                </div>
                <Button type="submit"> جستجو</Button>
              </div>

              <div className="flex gap-3 items-center">
                <Label>تاریخ فاکتور :</Label>

                <div dir="ltr">
                  <InputOTP
                    maxLength={8}
                    pattern={REGEXP_ONLY_DIGITS}
                    disabled={!isManualDatePicking}
                    value={invoiceFormDate}
                    onChange={(value) => setInvoiceFormDate(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="flex items-center gap-2 mr-3" dir="ltr">
                  <Switch
                    checked={!isManualDatePicking}
                    onCheckedChange={(value) => {
                      setInvoiceFormDate(getToday());
                      setIsManualDatePicking(!value);
                    }}
                  />
                  <Label>تاریخ امروز </Label>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Label className="whitespace-nowrap">شماره کارت | حساب :</Label>
                <Input
                  type="text"
                  dir="ltr"
                  name="bank_number"
                  value={invoiceFormBankNumber}
                  onChange={(e) => setInvoiceFormBankNumber(e.target.value)}
                />
              </div>
              <RadioGroup
                value={invoiceFormType}
                onValueChange={(value) => setInvoiceFormType(value)}
                dir="rtl"
                className="flex gap-3"
              >
                <Label className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/20  rounded-md border p-3">
                  <RadioGroupItem value="buy" id="buy" />
                  <span>فاکتور خرید</span>
                </Label>
                <Label className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/20  rounded-md border p-3">
                  <RadioGroupItem value="sell" id="sell" />
                  <span>فاکتور فروش</span>
                </Label>
              </RadioGroup>
            </header>
            <section className="grid grid-cols-2  gap-y-2 ">
              <h2 className="border border-primary/40 rounded-r-lg p-3">نام و نام خانوادگی :</h2>
              <p className="border border-r-0 border-primary/40 rounded-l-lg p-3">
                {invoiceFormCustomer ? invoiceFormCustomer.full_name : ""}
              </p>

              <h2 className="border border-primary/40 rounded-r-lg p-3"> کد ملی :</h2>
              <p className="border border-r-0 border-primary/40 rounded-l-lg p-3 tracking-wide ">
                {invoiceFormCustomer ? invoiceFormCustomer.national_id_number : ""}
              </p>

              <h2 className="border border-primary/40 rounded-r-lg p-3"> آدرس :</h2>
              <p className="border border-r-0 border-primary/40 rounded-l-lg p-3">
                {invoiceFormCustomer ? invoiceFormCustomer.address : ""}
              </p>

              <h2 className="border border-primary/40 rounded-r-lg p-3"> شماره تماس :</h2>
              <p
                className="border border-r-0 border-primary/40 rounded-l-lg p-3 tracking-wide
"
              >
                {invoiceFormCustomer ? invoiceFormCustomer.phone_number : ""}
              </p>
            </section>
          </form>

          <Separator className="my-10" />
          <form className="flex gap-3 mb-5 w-full" onSubmit={handleSubmitItem}>
            <div className="min-w-[350px]">
              <Input
                name="title"
                type="text"
                placeholder="شرح کالا"
                ref={firstInputRef}
                value={itemForm.title}
                onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
              />
              {errors?.title && <p className="text-red-500 text-sm mt-1 ">{errors.title}</p>}
            </div>
            <div className="max-w-[100px]">
              <Input
                name="qty"
                type="text"
                dir="ltr"
                placeholder="تعداد"
                value={itemForm.qty}
                onChange={(e) => setItemForm({ ...itemForm, qty: e.target.value })}
              />
              {errors?.qty && <p className="text-red-500 text-sm mt-1 ">{errors.qty}</p>}
            </div>
            <div>
              <Input
                name="fee"
                type="text"
                dir="ltr"
                placeholder="فی"
                value={itemForm.fee}
                onChange={(e) => setItemForm({ ...itemForm, fee: e.target.value })}
              />
              <p className="text-primary text-sm mt-2">{commaSeprate(itemForm.fee)}</p>
              {errors?.fee && <p className="text-red-500 text-sm mt-1 ">{errors.fee}</p>}
            </div>
            <Button type="submit">
              <PlusCircle />
              <span>افزودن</span>
            </Button>
          </form>
          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right ">شرح کالا</TableHead>
                <TableHead className="text-right  w-[100px]">تعداد</TableHead>
                <TableHead className="text-right ">فی</TableHead>
                <TableHead className="text-right ">جمع</TableHead>
                <TableHead className="text-right  w-[80px]">حذف</TableHead>
              </TableRow>
            </TableHeader>
            {invoiceFormItems.length ? (
              <TableBody>
                {invoiceFormItems.map((item) => (
                  <TableRow className="" key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="font-medium">{item.qty}</TableCell>
                    <TableCell className="font-medium">{commaSeprate(item.fee)}</TableCell>
                    <TableCell className="font-medium">
                      {commaSeprate(Math.floor(parseFloat(item.qty) * parseInt(item.fee)))}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="size-8 text-secondary"
                        type="button"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex justify-center">
                      <EmptyData message="هیج کالایی افزوده نشده" />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </CardContent>
        <CardFooter className="gap-3">
          <Button className="grow" type="button" onClick={handleInvoiceSubmition}>
            صدور فاکتور
          </Button>
          <Button className="grow" variant="outline" type="button" onClick={handleInvoicePreview}>
            پیش نمایش فاکتور
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default InvoiceCreate;
