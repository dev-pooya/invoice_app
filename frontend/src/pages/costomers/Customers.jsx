import React, { useEffect, useState } from "react";
import { Link } from "react-router";
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
import { Eye, Scroll, Trash2, UserPen } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyData from "@/components/EmptyData";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filterInput, setFilterInput] = useState(null);

  useEffect(() => {
    window.electronAPI.getLatestCustomers().then(setCustomers);
  }, []);

  // handle filter input change
  function handleFilterInputChange(e) {
    if (!e.target.value.length) {
      setFilterInput(null);
    } else {
      setFilterInput({ name: e.target.name, value: e.target.value.trim() });
    }
  }

  async function handleSeachCustomers() {
    // TODO validate here
    if (!filterInput) {
      return;
    }
    if (filterInput.name === "national_id_number" && !/^\d{10}$/.test(filterInput.value)) {
      return;
    }

    const result = await window.electronAPI.searchCustomers(filterInput);
    if (result?.length) {
      console.log(result);
      setCustomers(result);
    }
  }

  // delete customer
  async function deleteCustomer(id) {
    const result = await window.electronAPI.deleteCustomer(id);

    if (result.changes > 0) {
      setCustomers((prevs) => prevs.filter((customer) => customer.id !== id));
    }
  }

  return (
    <div className="p-5">
      <header className="flex items-center gap-1">
        <h1 className="text-xl font-semibold ml-auto">لیست مشتریان</h1>

        <Link to={"/"}>
          <Button variant="outline"> درون ریزی | import</Button>{" "}
        </Link>
        <Link to={"/"}>
          <Button variant="outline"> برون بری | export</Button>{" "}
        </Link>
      </header>
      <div className="flex gap-3 mt-5">
        <Input
          placeholder="جستجو کد ملی"
          name="national_id_number"
          onChange={handleFilterInputChange}
          disabled={filterInput?.name === "full_name"}
        />
        <Input
          placeholder="جستجو نام و نام خانوادگی"
          name="full_name"
          onChange={handleFilterInputChange}
          disabled={filterInput?.name === "national_id_number"}
        />
        <Button type="button" onClick={handleSeachCustomers}>
          جستجو
        </Button>
      </div>
      <div className="rounded-md border mt-3 ">
        <Table dir="rtl">
          <TableCaption> مشاهده جدیدترین مشتریان (۵۰)</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد ملی</TableHead>
              <TableHead className="text-right">نام و نام خانوادگی</TableHead>
              <TableHead className="text-right">شماره تماس</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length ? (
              customers.map((customer) => (
                <TableRow className="" key={customer.id}>
                  <TableCell className="font-medium">{customer.national_id_number}</TableCell>
                  <TableCell>{customer.full_name}</TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell className="text-right flex justify-center gap-2">
                    <Button asChild variant="secondary" size="icon" className="size-8 text-blue-600">
                      <Link to={`/customers/edit/${customer.id}`}>
                        <UserPen />
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" size="icon" className="size-8 text-yellow-600">
                      <Link to={`/customers/${customer.id}`}>
                        <Eye />
                      </Link>
                    </Button>
                    <Button variant="secondary" size="icon" className="size-8 text-teal-500">
                      <Scroll />
                    </Button>
                    <ConfirmDialog
                      title="آیا از حذف مشتری و فاکتور ها مطمئن هستید ؟"
                      message="با حذف مشتری تمام اطلاعات و فاکتور های مشتری حذف خواهد شد."
                      action={() => deleteCustomer(customer.id)}
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
                <TableCell colSpan={7}>
                  <div className="flex justify-center">
                    <EmptyData message="مشتری برای نمایش وجود ندارد." />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Customers;
