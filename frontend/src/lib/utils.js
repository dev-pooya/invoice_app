import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// get today
export function getToday() {
  const today = new Date();

  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(today);

  const year = parts.find((p) => p.type === "year").value;
  const month = parts.find((p) => p.type === "month").value.padStart(2, "0");
  const day = parts.find((p) => p.type === "day").value.padStart(2, "0");

  return `${year}${month}${day}`;
}

export function commaSeprate(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "٫");
}
