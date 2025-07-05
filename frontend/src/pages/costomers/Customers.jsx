import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, FilePlus, Scroll, Trash2, UserPen } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyData from "@/components/EmptyData";
import { useGlobalContext } from "../../context/GlobalContext";
import TableSkeleton from "../../components/TableSkeleton";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [pendding, setPendding] = useState(true);

  // search input refs
  const fullNameRef = useRef(null);
  const nationalIdNumberRef = useRef(null);

  useEffect(() => {
    window.electronAPI.getLatestCustomers().then((res) => {
      setPendding(false);
      return setCustomers(res);
    });
  }, []);

  async function handleSeachCustomers() {
    const searchQuery = {};
    // get the values and validate them
    const national_id_number = nationalIdNumberRef.current.value.trim();
    const full_name = fullNameRef.current.value.trim();

    if (full_name.length) {
      searchQuery.name = "full_name";
      searchQuery.value = full_name;
    }
    if (national_id_number.length) {
      searchQuery.name = "national_id_number";
      searchQuery.value = national_id_number;
    }
    // set pendding
    setPendding(true);
    if (searchQuery.name) {
      const result = await window.electronAPI.searchCustomers(searchQuery);
      setCustomers(result);
      setPendding(false);
    } else {
      window.electronAPI.getLatestCustomers().then((res) => {
        setPendding(false);
        return setCustomers(res);
      });
    }
  }

  // global context
  const { setInvoiceFormCustomer, setInvoiceFormNationalId } = useGlobalContext();
  const navigate = useNavigate();

  // create invoice for the selected customer
  async function createInvoiceForCustomer(id) {
    // find the customer
    const customer = customers.find((c) => c.id === id);
    // set the create form fields
    setInvoiceFormCustomer(customer);
    setInvoiceFormNationalId(customer.national_id_number);
    // navigate to the create invoice route
    navigate("/invoices/create");
  }

  // delete customer
  async function deleteCustomer(id) {
    const result = await window.electronAPI.deleteCustomer(id);

    if (result?.changes > 0) {
      setCustomers((prevs) => prevs.filter((customer) => customer.id !== id));
    }
  }

  // import custoemr
  async function handleImportCustomer() {
    const result = await window.electronAPI.importCustomers();
    console.log(result);
  }

  return (
    <div className="p-5">
      <header className="flex items-center gap-1">
        <h1 className="text-xl font-semibold ml-auto">لیست مشتریان</h1>
        <Button variant="outline" onClick={handleImportCustomer}>
          درون ریزی | import
        </Button>{" "}
        <Button variant="outline" disabled>
          برون بری | export
        </Button>{" "}
      </header>
      <div className="flex gap-3 mt-5">
        <Input placeholder="جستجو کد ملی" name="national_id_number" ref={nationalIdNumberRef} />
        <Input placeholder="جستجو نام و نام خانوادگی" name="full_name" ref={fullNameRef} />
        <Button type="button" onClick={handleSeachCustomers}>
          جستجو
        </Button>
      </div>
      <div className="rounded-md border mt-3 ">
        <Table dir="rtl">
          <TableCaption className="my-2"> مشاهده جدیدترین مشتریان (۲۰)</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد ملی</TableHead>
              <TableHead className="text-right">نام و نام خانوادگی</TableHead>
              <TableHead className="text-right">شماره تماس</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!pendding && customers.length ? (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.national_id_number}</TableCell>
                  <TableCell>{customer.full_name}</TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell className="text-right flex justify-center gap-2">
                    <Tooltip delayDuration={700}>
                      <TooltipTrigger asChild>
                        <Button asChild variant="secondary" size="icon" className="size-8 text-blue-600">
                          <Link to={`/customers/edit/${customer.id}`}>
                            <UserPen />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-iransans">ویرایش مشتری</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={700}>
                      <TooltipTrigger asChild>
                        <Button asChild variant="secondary" size="icon" className="size-8 text-violet-500">
                          <Link to={`/customers/${customer.id}`}>
                            <Eye />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-iransans">مشاهده اطلاعات </p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip delayDuration={700}>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="size-8 text-teal-500 cursor-pointer"
                          onClick={() => createInvoiceForCustomer(customer.id)}
                        >
                          <FilePlus />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-iransans">صدور فاکتور </p>
                      </TooltipContent>
                    </Tooltip>

                    <ConfirmDialog
                      title="آیا از حذف مشتری و فاکتور ها مطمئن هستید ؟"
                      message="با حذف مشتری تمام اطلاعات و فاکتور های مشتری حذف خواهد شد."
                      action={() => deleteCustomer(customer.id)}
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
                {pendding ? (
                  <TableCell colSpan={4}>
                    <TableSkeleton n={20} />
                  </TableCell>
                ) : (
                  <TableCell colSpan={4}>
                    <div className="flex justify-center">
                      <EmptyData message="مشتری برای نمایش وجود ندارد." />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Customers;
