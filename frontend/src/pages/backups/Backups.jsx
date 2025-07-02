import React, { useEffect, useRef, useState } from "react";
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
import WaitingModal from "../../components/WaitingModal";

function Backups() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // full backup
  async function handleFullBackup(e) {
    setIsBackingUp(true);
    const result = await window.electronAPI.createFullBackup();
    setIsBackingUp(false);
    // result is boolean
    if (result) {
      confirm.log(result);
    }
  }
  // full restore
  async function handleFullRestore(e) {
    setIsRestoring(true);
    const result = await window.electronAPI.restoreFullBackup();
    console.log(result);
    setIsRestoring(false);
  }

  return (
    <div className="p-5 grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>پشتیبان گیری کامل </CardTitle>
        </CardHeader>
        <CardContent>
          <p>در این حالت تمام فایل های آپلود شده و دیتابیس ، بک آپ گرفته میشود .</p>
          <ul>
            <li className="text-primary dark:text-yellow-400 py-1"> مدت زمان بیشتر </li>
            <li className="text-primary dark:text-yellow-400 py1">در هنگام ریستور کردن برنامه را نبندید</li>
          </ul>
        </CardContent>
        <CardFooter>
          <CardAction>
            <Button
              className="cursor-pointer"
              type="button"
              disabled={isBackingUp || isRestoring}
              onClick={handleFullBackup}
            >
              بک آپ
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>ریستور کامل </CardTitle>
        </CardHeader>
        <CardContent>
          <p>در این حالت تمام فایل های آپلود شده و دیتابیس ، از فایل بک آپ بازگردانده میشود .</p>
          <ul>
            <li className="text-primary dark:text-yellow-400 py-1">
              {" "}
              بعد از بازیافت اطلاعات برنامه را ببندید و دوباره باز کنید{" "}
            </li>
            <li className="text-primary dark:text-yellow-400 py1">در هنگام پشتیبان گیری برنامه را نبندید</li>
          </ul>
        </CardContent>
        <CardFooter>
          <CardAction>
            <Button
              className="cursor-pointer"
              type="button"
              disabled={isBackingUp || isRestoring}
              onClick={handleFullRestore}
            >
              ریستور
            </Button>
          </CardAction>
        </CardFooter>
      </Card>

      {(isBackingUp || isRestoring) && (
        <WaitingModal
          message={
            isBackingUp ? "در حال پشتیبان گیری ، لطفا منتظر بمانید" : "در حال بازیابی اطلاعات ، لطفا منتظر بمانید"
          }
        />
      )}
    </div>
  );
}

export default Backups;
