import React, { useRef } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { PlusCircle, Trash2 } from "lucide-react";
import { commaSeprate } from "../../lib/utils";

const initialItemForm = {
  title: "",
  qty: "",
  fee: "",
};

function InvoiceCreate() {
  // states for form
  const [national_id_number, setNational_id_number] = useState();
  const [itemForm, setItemForm] = useState(initialItemForm);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [date, setDate] = useState(getToday());
  const [isManualDatePicking, setIsManualDatePicking] = useState(false);
  const [customer, setCustomer] = useState(null);

  // refs
  const firstInputRef = useRef(null);

  // handle the submition of second form for adding the items to the invoice
  function handleSubmitItem(e) {
    e.preventDefault();
    setInvoiceItems([...invoiceItems, itemForm]);
    // reset the form
    setItemForm(initialItemForm);

    // Focus on the first input
    firstInputRef.current?.focus();
  }

  return (
    <div className="p-5 bg-amber-50">
      <header>
        <h1 className="text-2xl font-semibold mb-5">فرم صدور فاکتور جدید</h1>
      </header>
      <Card>
        <CardContent>
          <form className="flex justify-between">
            <header className="flex flex-col gap-6 ">
              <div className="flex gap-3 items-center">
                <Label>کد ملی مشتری :</Label>

                <div dir="ltr">
                  {" "}
                  <InputOTP
                    maxLength={10}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={national_id_number}
                    onChange={(value) => setNational_id_number(value)}
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
                </div>
                <Button> جستجو</Button>
              </div>

              <div className="flex gap-3 items-center">
                <Label>تاریخ فاکتور :</Label>

                <div dir="ltr">
                  <InputOTP
                    maxLength={8}
                    pattern={REGEXP_ONLY_DIGITS}
                    disabled={!isManualDatePicking}
                    value={date}
                    onChange={(value) => setDate(value)}
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
                      setDate(getToday());
                      setIsManualDatePicking(!value);
                    }}
                  />
                  <Label>تاریخ امروز </Label>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Label className="whitespace-nowrap">شماره کارت | حساب :</Label>
                <Input type="text" name="bank_number" />
              </div>
              <RadioGroup defaultValue="sell" dir="rtl" className="flex gap-3">
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
              <h2 className="border border-primary/40 rounded-r-lg p-3">
                نام و نام خانوادگی :
              </h2>
              <p className="border border-r-0 border-primary/40 rounded-l-lg p-3">
                amin
              </p>

              <h2 className="border border-primary/40 rounded-r-lg p-3">
                {" "}
                کد ملی :
              </h2>
              <p className="border border-r-0 border-primary/40 rounded-l-lg p-3 tracking-wide ">
                2020404070
              </p>

              <h2 className="border border-primary/40 rounded-r-lg p-3">
                {" "}
                آدرس :
              </h2>
              <p className="border border-r-0 border-primary/40 rounded-l-lg p-3">
                maku iran
              </p>

              <h2 className="border border-primary/40 rounded-r-lg p-3">
                {" "}
                شماره تماس :
              </h2>
              <p
                className="border border-r-0 border-primary/40 rounded-l-lg p-3 tracking-wide
"
              >
                09124343500
              </p>
            </section>
          </form>

          <Separator className="my-10" />
          <form className="flex gap-3 mb-5 w-full" onSubmit={handleSubmitItem}>
            <div className="grow">
              <Input
                name="title"
                type="text"
                placeholder="شرح کالا"
                ref={firstInputRef}
                value={itemForm.title}
                onChange={(e) =>
                  setItemForm({ ...itemForm, title: e.target.value })
                }
              />
            </div>
            <div className="max-w-[100px]">
              <Input
                name="qty"
                type="text"
                placeholder="تعداد"
                value={itemForm.qty}
                onChange={(e) =>
                  setItemForm({ ...itemForm, qty: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                name="fee"
                type="text"
                placeholder="فی"
                value={itemForm.fee}
                onChange={(e) =>
                  setItemForm({ ...itemForm, fee: e.target.value })
                }
              />
              <p className="text-primary text-sm mt-2">
                {commaSeprate(itemForm.fee)}
              </p>
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
            <TableBody>
              {invoiceItems
                ? invoiceItems.map((item) => (
                    <TableRow className="" key={item.title + item.qty}>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell className="font-medium">{item.qty}</TableCell>
                      <TableCell className="font-medium">
                        {commaSeprate(item.fee)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {commaSeprate(
                          Math.floor(parseFloat(item.qty) * parseInt(item.fee))
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="size-8 text-secondary"
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : ""}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default InvoiceCreate;
