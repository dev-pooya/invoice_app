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
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

export function seprateDateParts(dateStr) {
  if (!/^\d{8}$/.test(dateStr)) return dateStr; // validate

  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);

  return `${year}/${month}/${day}`;
}
