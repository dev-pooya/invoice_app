import React, { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronsUpDownIcon, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { commaSeprate } from "../lib/utils";
import { useGlobalContext } from "../context/GlobalContext";

function InvoiceItemForm({ category }) {
  // product list
  const [productsList, setProductsList] = useState([]);
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [fee, setFee] = React.useState("");

  // refs
  const titleRef = useRef(null);
  const kartageRef = useRef(null);
  const qtyRef = useRef(null);

  const { addItem } = useGlobalContext();

  useEffect(() => {
    async function fetchProducts() {
      const result = await window.electronAPI.getAllProducts();
      setProductsList(result);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    setErrors({});
  }, [category]);

  async function handleSubmitItem(e) {
    e.preventDefault();
    const formData = validate();
    if (!formData) return;
    // there is safe data
    addItem(formData);
    // reset the form
    resetForm();
    setErrors(null);
  }
  function validate() {
    // validate the form
    const errors = {};
    let formData = {};

    if (category === "coin") {
      formData.title = title;
      formData.product_id = productsList.find((product) => product.name === formData.title).id;
      formData.qty = parseInt(qtyRef?.current.value.trim());
      // validation
      if (!formData.title) {
        errors.title = "  شرح کالا را انتخاب کنید    ";
      }
      //  qty: required and digits
      if (!formData.qty) {
        errors.qty = "تعداد را به عدد وارد کنید";
      }
    } else {
      // its melton
      formData.title = titleRef?.current.value.trim();
      formData.kartage = parseFloat(kartageRef?.current.value.trim());
      formData.qty = parseFloat(qtyRef?.current.value.trim());
      // validation
      if (!formData.title) {
        errors.title = "  شرح کالا را وارد کنید   ";
      }
      //  qty: required and digits
      if (!formData.qty) {
        errors.qty = "وزن را به عدد وارد کنید";
      }
      //  kartage: required and digits
      if (!formData.kartage) {
        errors.kartage = "عیار را به عدد وارد کنید";
      }
    }
    formData.fee = parseInt(fee);

    // calculate the price
    formData.price = parseInt(
      category === "melton" ? (formData.kartage / 750) * formData.qty * formData.fee : formData.qty * formData.fee
    );

    console.log(formData);
    // fee: required
    if (!formData.fee) {
      errors.fee = "مقدار فی را به عدد وارد کنید";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return false;
    }

    // its valid

    console.log(formData);
    return formData;
  }
  function resetForm() {
    if (category === "coin") {
      setTitle("");
    } else {
      titleRef.current.value = "";
      kartageRef.current.value = "";
    }
    qtyRef.current.value = "";
    setFee("");
  }

  function handleKeyDownFee(e) {
    if (e.key === "+") {
      e.preventDefault(); // prevent '+' from being typed
      const value = parseInt(fee || "0", 10);
      setFee((value * 1000).toString());
    }
  }

  return (
    <form className="flex gap-3 mb-5 w-full" onSubmit={handleSubmitItem}>
      {category === "melton" ? (
        <div className="min-w-[350px]">
          <Input name="title" type="text" placeholder="شرح کالا" ref={titleRef} />
          {errors?.title && <p className="text-red-500 text-sm mt-1 ">{errors.title}</p>}
        </div>
      ) : (
        <div className="w-[350px]">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                <span className="whitespace-nowrap overflow-ellipsis overflow-hidden block">
                  {title ? productsList.find((product) => product.name === title)?.name : "انتخاب محصول"}
                </span>

                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0 font-display">
              <Command>
                <CommandInput placeholder="جستجو" />
                <CommandList>
                  <CommandEmpty>محصولی پیدا نشد !!!</CommandEmpty>
                  <CommandGroup>
                    {productsList.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.name}
                        onSelect={(currentValue) => {
                          setTitle(currentValue === title ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <CheckIcon
                          className={cn("mr-2 h-4 w-4", title === product.name ? "opacity-100" : "opacity-0")}
                        />
                        {product.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors?.title && <p className="text-red-500 text-sm mt-1 ">{errors.title}</p>}
        </div>
      )}
      {category === "melton" && (
        <div className="max-w-[100px]">
          <Input name="kartage" type="text" dir="ltr" placeholder="عیار" ref={kartageRef} />
          {errors?.kartage && <p className="text-red-500 text-sm mt-1 ">{errors?.kartage}</p>}
        </div>
      )}

      <div className="max-w-[100px]">
        <Input
          name="qty"
          type="text"
          dir="ltr"
          placeholder={category === "melton" ? "وزن (گرم)" : "تعداد"}
          ref={qtyRef}
        />
        {errors?.qty && <p className="text-red-500 text-sm mt-1 ">{errors?.qty}</p>}
      </div>
      <div>
        <Input
          name="fee"
          type="text"
          dir="ltr"
          placeholder={category === "melton" ? "فی (۷۵۰)" : "فی"}
          value={fee}
          onChange={(e) => setFee(parseInt(e.target.value) || "")}
          onKeyDown={handleKeyDownFee}
        />
        <p dir="ltr" className="text-primary text-sm mt-2 pl-2">
          {commaSeprate(fee)}
        </p>
        {errors?.fee && <p className="text-red-500 text-sm mt-1 ">{errors.fee}</p>}
      </div>
      <Button type="submit">
        <PlusCircle />
        <span>افزودن</span>
      </Button>
    </form>
  );
}

export default InvoiceItemForm;
