export function formatThaiDate(date: string, long = false) {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: long ? "long" : "short",
    year: "numeric",
  }).format(new Date(date));
}
