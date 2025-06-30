import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ConfirmDialog({ title, message, action, opener }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{opener}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right font-display">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-right font-display">{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-display">انصراف</AlertDialogCancel>
          <AlertDialogAction className="font-display" onClick={action}>
            مطمئنم حذف کن
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDialog;
