import React from "react";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { getToday } from "../../lib/utils";

function InvoiceCreate() {
  // states for form

  const [national_id_number, setNational_id_number] = useState();
  const [date, setDate] = useState(getToday());
  const [isManualDatePicking, setIsManualDatePicking] = useState(false);

  return (
    <div className="p-5">
      <header>
        <h1 className="text-2xl font-semibold mb-5">فرم صدور فاکتور جدید</h1>
      </header>
      <Card>
        <CardContent>
          <form className="">
            <header className="flex gap-8 items-center">
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
            </header>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default InvoiceCreate;
