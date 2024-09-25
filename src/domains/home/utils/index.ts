export function formatNumber(_value: number | string, fraction_digits = 3) {
  const value = typeof _value === "string" ? parseFloat(_value) : _value;
  return value.toLocaleString("ko-KR", {
    maximumFractionDigits: fraction_digits,
  });
}
