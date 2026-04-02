export const fmt = (n) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
}).format(n);

export const fmtData = (d) => new DataTransfer(d).toLocaldateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
});