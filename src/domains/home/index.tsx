import {
  CurrencyListHandlerResult,
  GetCurrencyListReturnType,
} from "@/api/cryptocurrency/currency/types";
import {
  GetTickerListReturnType,
  TickerListHandlerResult,
} from "@/api/cryptocurrency/ticker/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FC } from "react";
import { formatNumber } from "./utils";

interface Props {}

const HomeMain: FC<Props> = () => {
  const { data: list } = useQuery(getTickerListQueryOptions());
  const { data: map } = useQuery(getCurrencyListQueryOptions());

  console.log(list, map);

  return (
    <main>
      <section>
        <ol>
          {list?.map((item) => {
            const ticker = item.target_currency.toUpperCase();

            const diff = item.last - item.first;
            const rate = ((item.last - item.first) / item.first) * 100;

            return (
              <li key={`${item.target_currency}-${item.id}`}>
                <span>{ticker}</span>
                <span>{map?.get(ticker)?.name}</span>
                <br />
                <span>{formatNumber(item.last)}</span>
                <br />
                <span>{rate.toFixed(2)}%</span>
                <br />
                <span>{diff.toFixed(2)}</span>
                <br />
                <span>{formatNumber(item.quote_volume, 0)}</span>
                <br />
                <span>{formatNumber(item.target_volume, 0)}</span>
                <br />
                <br />
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
};

export { HomeMain };

type TickerListResponse = Extract<
  TickerListHandlerResult,
  GetTickerListReturnType
>;

export function getTickerListQueryOptions(): UseQueryOptions<
  TickerListResponse,
  Error,
  TickerListResponse["tickers"]
> {
  return {
    queryKey: ["ticker-list"],
    queryFn: async () => {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tickers`
      );
      const data = await result.json();
      return data;
    },
    select: (data) => {
      return data.tickers;
    },
  };
}

type CurrencyListResponse = Extract<
  CurrencyListHandlerResult,
  GetCurrencyListReturnType
>;

export function getCurrencyListQueryOptions(): UseQueryOptions<
  CurrencyListResponse,
  Error,
  Map<string, CurrencyListResponse["currencies"][number]>
> {
  return {
    queryKey: ["currency-list"],
    queryFn: async () => {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/currencies`
      );
      const data = await result.json();
      return data;
    },
    select: (data) => {
      return new Map<string, CurrencyListResponse["currencies"][number]>(
        data.currencies.map((currency) => {
          return [currency.symbol, currency];
        })
      );
    },
  };
}
