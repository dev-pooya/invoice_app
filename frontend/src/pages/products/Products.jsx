import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Link } from "react-router";
import { CheckCircle2Icon, Eye, FilePlus, Pen, SquarePen, Trash2, UserPen } from "lucide-react";
import ConfirmDialog from "../../components/ConfirmDialog";
import EmptyData from "../../components/EmptyData";

function Products() {
  const [products, setProducts] = useState([]);
  const formTitleRef = useRef(null);

  useEffect(() => {
    window.electronAPI.getAllProducts().then(setProducts);
  }, []);
  // handlers
  async function handleCreateProduct(e) {
    e.preventDefault();
    // validate the title
    const value = formTitleRef?.current.value.trim();

    if (!value) {
      formTitleRef.current.classList.add("border-red-500");
      return;
    }
    formTitleRef.current.classList.remove("border-red-500");
    // send data to ipc for create the product
    const result = await window.electronAPI.addProduct(value);
    console.log(result);
    if (result.changes > 0) {
      setProducts((prev) => [...prev, { id: result.lastInsertRowid, name: value }]);
    }
  }
  // delete product
  async function deleteProduct(id) {
    const result = await window.electronAPI.deleteProduct(id);
    console.log(result);
    if (result.changes > 0) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    }
  }
  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold my-3">لیست محصولات </h1>
      <Card>
        <CardContent>
          <form onSubmit={handleCreateProduct} className="flex gap-2 items-center mb-5">
            <Label className="whitespace-nowrap">نام محصول | شرح کالا : </Label>
            <Input type="text" placeholder="شرح " ref={formTitleRef} />
            <Button type="submit">افزودن کالا</Button>
          </form>
          <Table>
            <TableCaption> مشاهده جدیدترین مشتریان (۲۰)</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">شماره محصول </TableHead>
                <TableHead className="text-right">نام محصول </TableHead>
                <TableHead className="text-center">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>

                    <TableCell className="text-right flex justify-center gap-2">
                      <ProductEditingDialog product={product} />
                      <ConfirmDialog
                        title="آیا از حذف  محصول  مطمئن هستید ؟"
                        message=""
                        action={() => deleteProduct(product.id)}
                        opener={
                          <Button variant="secondary" size="icon" className="size-8 text-destructive cursor-pointer">
                            <Trash2 />
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex justify-center">
                      <EmptyData message="محصولی برای نمایش وجود ندارد." />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Products;

function ProductEditingDialog({ product }) {
  const formTitleRef = useRef(null);
  const [status, setStatus] = useState(false);

  async function handleEditProduct(e) {
    e.preventDefault();
    setStatus(false);
    const value = formTitleRef?.current.value.trim();
    if (!value) {
      formTitleRef.current.classList.add("border-red-500");
      return;
    }
    formTitleRef.current.classList.remove("border-red-500");
    // send data to ipc for create the product
    const result = await window.electronAPI.editProduct(product.id, value);

    if (result.changes > 0) setStatus(true);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary" size="icon" className="size-8 text-blue-600 cursor-pointer">
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-display" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-right">ویرایش محصول </DialogTitle>
          <DialogDescription className="text-right">محصول شماره {product.id} را تغییر دهید.</DialogDescription>
        </DialogHeader>
        {status && (
          <Alert className="text-green-600 my-3">
            <CheckCircle2Icon />
            <AlertTitle>ذخیره شد.</AlertTitle>
            <AlertDescription>محصول مورد نظر تغییر یافت</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3">
          <Label>نام محصول </Label>
          <Input name="name" ref={formTitleRef} defaultValue={product.name} />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">بستن</Button>
          </DialogClose>
          <Button onClick={handleEditProduct}>ذخیره تغییرات</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
