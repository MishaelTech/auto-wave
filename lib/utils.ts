import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatTime(time24: string) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

export function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export const statusColorClasses = (status: string) => {
  switch (status) {
      case "pending":
          return "bg-yellow-100 text-yellow-800";
      case "accepted":
          return "bg-blue-100 text-blue-700";
      case "completed":
          return "bg-green-100 text-green-700";
      default:
          return "bg-gray-100 text-gray-700";
  }
};