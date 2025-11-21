export const formatReadableDate = (dateInput: string | Date): string => {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatAmount = (amount: number | string): string => {
  const num = Number(amount);
  if (isNaN(num)) return "0";
  return '$'+num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getFileSizeInMB = (bytes: number, decimals: number = 2): string => {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(decimals)} MB`;
};

export const getDocumentTypeFromUrl = (url: string): "pdf" | "image" | "word" | "excel" | "other" => {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.endsWith(".pdf")) return "pdf";
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/.test(lowerUrl)) return "image";
  if (/\.(doc|docx)$/.test(lowerUrl)) return "word";
  if (/\.(xls|xlsx)$/.test(lowerUrl)) return "excel";

  return "other";
};
