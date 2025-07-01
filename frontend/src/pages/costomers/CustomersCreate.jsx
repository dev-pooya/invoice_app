import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialForm = {
  full_name: "",
  national_id_number: "",
  address: "",
  phone_number: "",
  post_code: "",
};
function CustomersCreate() {
  //states
  const [submitionResult, setSubmitionResult] = useState(null);

  const [errors, setErrors] = useState({});
  const [filePath, setFilePath] = useState("");
  const [form, setForm] = useState(initialForm);
  useEffect(() => {
    if (submitionResult && submitionResult.success) {
      setTimeout(() => setSubmitionResult(null), 2000);
      setForm(initialForm);
    }
  }, [submitionResult]);
  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  // handle pick file
  const pickFile = async () => {
    const resultPath = await window.electronAPI.pickFile();
    if (resultPath) {
      setFilePath(resultPath);
    }
  };
  // handle the form submit
  async function handleSubmit(e) {
    e.preventDefault();
    // validate form
    const errors = validateCustomer(form);

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // Clear errors
    setErrors({});

    const formData = {
      ...form,
      filePath: filePath || "",
    };

    const result = await window.electronAPI.addCustomer(formData);
    setSubmitionResult(result);
  }

  // form validator
  function validateCustomer(form) {
    const errors = {};

    // full_name: required
    if (!form.full_name.trim()) {
      errors.full_name = "نام الزامی است";
    }

    // national_id_number: 10 digits
    if (!/^\d{10}$/.test(form.national_id_number)) {
      errors.national_id_number = "کد ملی باید ۱۰ رقم باشد";
    }

    // postal_code: if filled, must be 10 digits
    if (form.post_code && !/^\d{10}$/.test(form.post_code)) {
      errors.post_code = "کد پستی باید ۱۰ رقم باشد";
    }

    // phone_number: if filled, must be digits
    if (form.phone_number && !/^\d+$/.test(form.phone_number)) {
      errors.phone_number = "شماره تماس فقط ارقام باید باشد";
    }

    return errors;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-7">فرم ایجاد مشتری جدید</h1>
      <form onSubmit={handleSubmit} className="grid gap-3 w-[600px]">
        <div className="flex justify-between items-center ">
          <Label className="w-[250px]">نام و نام خانوادگی</Label>
          <div className="w-full">
            <Input type="text" name="full_name" onChange={handleChange} value={form.full_name} />
            {errors.full_name && <p className="text-red-500 text-sm mt-1 ">{errors.full_name}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center ">
          <Label className="w-[250px]"> کد ملی </Label>
          <div className="w-full">
            {" "}
            <Input type="text" name="national_id_number" onChange={handleChange} value={form.national_id_number} />
            {errors.national_id_number && <p className="text-red-500 text-sm mt-1 ">{errors.national_id_number}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center ">
          <Label className="w-[250px]">شماره تماس </Label>
          <div className="w-full">
            <Input type="text" name="phone_number" onChange={handleChange} value={form.phone_number} />
            {errors.phone_number && <p className="text-red-500 text-sm mt-1 ">{errors.phone_number}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center ">
          <Label className="w-[250px]">آدرس </Label>
          <div className="w-full">
            {" "}
            <Textarea row="3" name="address" className="resize-none" onChange={handleChange} value={form.address} />
            {errors.address && <p className="text-red-500 text-sm mt-1 ">{errors.address}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center ">
          <Label className="w-[250px]">کد پستی </Label>
          <div className="w-full">
            <Input type="text" name="post_code" onChange={handleChange} value={form.post_code} />
            {errors.post_code && <p className="text-red-500 text-sm mt-1 ">{errors.post_code}</p>}
          </div>
        </div>
        <div className="flex justify-between items-center ">
          <Label className="w-[250px]">تصویر کارت ملی</Label>
          <div className="w-full">
            <Button type="button" onClick={pickFile} variant="outline" className="w-full">
              انتخاب تصویر کارت ملی
            </Button>
          </div>
        </div>
        <Button type="submit" size="lg" className="mt-5 cursor-pointer">
          ذخیره مشتری جدید
        </Button>
        {submitionResult &&
          (submitionResult.success ? (
            <Alert className="text-green-600">
              <CheckCircle2Icon />
              <AlertTitle>ذخیره شد.</AlertTitle>
              <AlertDescription>مشتری جدید در برنامه ذخیره شد.</AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>عملیات با خطا مواجه شد! </AlertTitle>
              <AlertDescription>
                <p>{submitionResult.error}</p>
              </AlertDescription>
            </Alert>
          ))}
        {filePath && <img src={`secure-image://${filePath}`} alt="کارت ملی" className="max-h-[300px] mt-3" />}
      </form>
    </div>
  );
}

export default CustomersCreate;
