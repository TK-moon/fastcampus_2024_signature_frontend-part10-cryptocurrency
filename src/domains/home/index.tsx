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
import Link from "next/link";
import styles from "./index.module.css";
import increase from "./increase.svg";
import decrease from "./decrease.svg";
import same from "./same.svg";
import Image from "next/image";

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
  const { data: saved_set } = useQuery(getSavedTickerSetQueryOptions());

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>암호화폐 목록</h1>
        <div className={styles.sort_button_group}>
          <button
            className={sort_by === "volume" ? "font-extrabold" : ""}
            onClick={() => setSortBy("volume")}
          >
            거래금액순
          </button>
          <button
            className={sort_by === "name" ? "font-extrabold" : ""}
            onClick={() => setSortBy("name")}
          >
            이름순
          </button>
        </div>
      </header>
      <section>
        <ol className={styles.item_list}>
          {list?.map((item) => {
            const ticker = item.target_currency.toUpperCase();

            const diff = item.last - item.first;
            const rate = ((item.last - item.first) / item.first) * 100;

            const status = getIncreaseStatus(diff);
            const color_classname = getPriceColorByStatus(status);

            return (
              <li key={`${item.target_currency}-${item.id}`}>
                <Link href={`/${ticker}`} className={styles.item}>
                  <span className="row-start-1 row-end-3 self-center">
                    {status === "increase" && (
                      <Image src={increase} alt="상승 아이콘" />
                    )}
                    {status === "decrease" && (
                      <Image src={decrease} alt="하락 아이콘" />
                    )}
                    {status === "same" && (
                      <Image src={same} alt="변동 없음 아이콘" />
                    )}
                  </span>
                  <span className="col-start-2 col-end-3 text-[14px]">
                    {ticker}
                  </span>
                  <span className="col-start-2 col-end-3 text-[14px]">
                    {map?.get(ticker)?.name}
                  </span>
                  <span
                    className={`col-start-3 col-end-4 row-start-1 row-end-3  text-[16px] font-bold ${color_classname}`}
                  >
                    {formatNumber(item.last)}
                  </span>
                  <span
                    className={`col-start-4 col-end-5 row-start-1 row-end-2 text-[14px] ${color_classname}`}
                  >
                    {rate.toFixed(2)}%
                  </span>
                  <span
                    className={`col-start-4 col-end-5 row-start-2 row-end-3 text-[12px] ${color_classname}`}
                  >
                    {diff.toFixed(2)}
                  </span>
                  <span className="col-start-5 col-end-6 row-start-1 row-end-2 text-[14px] text-right">
                    {formatNumber(item.quote_volume, 0)}
                  </span>
                  <span className="col-start-5 col-end-6 row-start-2 row-end-3 text-[12px] text-right">
                    {formatNumber(item.target_volume, 0)}
                  </span>
                  <SaveButton
                    ticker={ticker}
                    is_saved={!!saved_set?.has(ticker)}
                    className="col-start-6 col-end-7 row-start-1 row-end-3"
                  />
                </Link>
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

function getIncreaseStatus(diff: number) {
  if (diff > 0) {
    return "increase";
  }

  if (diff < 0) {
    return "decrease";
  }

  return "same";
}

function getPriceColorByStatus(status: ReturnType<typeof getIncreaseStatus>) {
  if (status === "increase") {
    return "text-red-500";
  }
  if (status === "decrease") {
    return "text-blue-500";
  }

  return "text-gray-500";
}
