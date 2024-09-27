import {
  CurrencyListHandlerResult,
  GetCurrencyListReturnType,
} from "@/api/cryptocurrency/currency/types";
import {
  GetTickerListReturnType,
  TickerListHandlerResult,
} from "@/api/cryptocurrency/ticker/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FC, useState } from "react";
import { formatNumber, sortByName, sortByVolume } from "./utils";
import { api_getSavedTickerList } from "./api";
import { SaveButton } from "./SaveButton";

type SortType = "volume" | "name";
export const DEFAULT_SORT = "volume";

interface Props {}

const HomeMain: FC<Props> = () => {
  /**
   * 정렬기준
   * 1. 거래 금액순
   * 2. 이름순
   */
  const [sort_by, setSortBy] = useState<SortType>(DEFAULT_SORT);
  const { data: list } = useQuery(getTickerListQueryOptions({ sort_by }));
  const { data: map } = useQuery(getCurrencyListQueryOptions());
  const { data: saved_set, refetch } = useQuery(
    getSavedTickerSetQueryOptions()
  );

  console.log(saved_set);

  return (
    <main>
      <header>
        <h1>암호화폐 목록</h1>
        <div>
          <button onClick={() => setSortBy("volume")}>거래금액순</button>
          <button onClick={() => setSortBy("name")}>이름순</button>
        </div>
      </header>
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
                <SaveButton
                  ticker={ticker}
                  is_saved={!!saved_set?.has(ticker)}
                />
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

export type TickerListResponse = Extract<
  TickerListHandlerResult,
  GetTickerListReturnType
>;

export function getTickerListQueryOptions(params: {
  sort_by: SortType;
}): UseQueryOptions<TickerListResponse, Error, TickerListResponse["tickers"]> {
  const { sort_by } = params;

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
      const sorted_list =
        sort_by === "volume"
          ? sortByVolume(data.tickers)
          : sortByName(data.tickers);
      return sorted_list;
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

export const SAVED_TICKER_LIST_KEY = ["saved-ticker-list"];

function getSavedTickerSetQueryOptions(): UseQueryOptions<
  string[],
  Error,
  Set<string>
> {
  return {
    queryKey: SAVED_TICKER_LIST_KEY,
    queryFn: async () => {
      const result = await api_getSavedTickerList();
      return result;
    },
    select: (data) => {
      return new Set(data);
    },
  };
}
