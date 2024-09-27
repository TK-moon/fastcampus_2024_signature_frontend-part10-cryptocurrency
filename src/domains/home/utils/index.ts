import { TickerListResponse } from "..";

export function formatNumber(_value: number | string, fraction_digits = 3) {
  const value = typeof _value === "string" ? parseFloat(_value) : _value;
  return value.toLocaleString("ko-KR", {
    maximumFractionDigits: fraction_digits,
  });
}

export function sortByVolume(tickers: TickerListResponse["tickers"]) {
  return tickers.toSorted((a, b) => b.quote_volume - a.quote_volume);
}

export function sortByName(tickers: TickerListResponse["tickers"]) {
  return tickers.toSorted((a, b) =>
    a.target_currency.localeCompare(b.target_currency)
  );
}
