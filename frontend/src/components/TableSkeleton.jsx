import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function TableSkeleton({ n }) {
  const items = new Array(n).fill(null);
  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map((_, i) => (
        <Skeleton key={i} className="h-[25px]" />
      ))}
    </div>
  );
}

export default TableSkeleton;
