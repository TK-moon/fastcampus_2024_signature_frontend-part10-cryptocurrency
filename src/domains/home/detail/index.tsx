import {
  GetTickerInfoReturnType,
  TickerInfoHandlerResult,
} from "@/api/cryptocurrency/ticker/detail/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ChangeEventHandler, FC, useMemo, useRef, useState } from "react";
import { formatNumber } from "../utils";
import {
  ChartHandlerResult,
  GetCandleChartReturnType,
  INTERVAL_LIST,
} from "@/api/cryptocurrency/chart/types";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { formatChartData } from "./utils";
import { useChart } from "./useChart";
import { useResizeObserver } from "./useResizeObserver";
import styles from "./index.module.css";

export type Interval = (typeof INTERVAL_LIST)[number];

interface Props {
  ticker: string;
  interval_for_initialize?: Interval;
}

const CryptoCurrencyDetailMain: FC<Props> = (props) => {
  const { ticker, interval_for_initialize } = props;

  const router = useRouter();

  const chart_ref = useRef<HTMLDivElement>(null);

  const [interval, setInterval] = useState<Interval>(
    interval_for_initialize ?? INTERVAL_LIST[0]
  );

  const { data: ticker_info } = useQuery(getTickerInfoQueryOptions({ ticker }));
  const { data: chart } = useQuery(
    getCandleChartQueryOptions({ ticker, interval })
  );

  const chart_data = useMemo(() => formatChartData(chart), [chart]);

  const { draw } = useChart({ chart_data });

  useResizeObserver({
    ref: chart_ref,
    callback: (entry) => {
      draw(entry.target);
    },
  });

  const handleChangeInterval: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.currentTarget.value as Interval;
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, interval: value },
    });
    setInterval(value);
  };

  return (
    <main>
      <header className={styles.header}>
        <h1 className={styles.title}>{ticker}</h1>
      </header>
      <div ref={chart_ref} style={{ height: 500 }} />
      <ol className={styles.interval_group}>
        {INTERVAL_LIST.map((item) => {
          return (
            <li key={`interval-item-${item}`} className={styles.interval_item}>
              <label>
                <input
                  type="radio"
                  value={item}
                  name="interval"
                  checked={interval === item}
                  onChange={handleChangeInterval}
                />
                {item}
              </label>
            </li>
          );
        })}
      </ol>
      <section className={styles.info_section}>
        <dl>
          <dt>티커</dt>
          <dd>{ticker_info?.target_currency.toUpperCase()}</dd>
        </dl>
        <dl>
          <dt>시가</dt>
          <dd>{formatNumber(ticker_info?.first ?? 0)}</dd>
        </dl>
        <dl>
          <dt>종가</dt>
          <dd>{formatNumber(ticker_info?.last ?? 0)}</dd>
        </dl>
        <dl>
          <dt>고가</dt>
          <dd>{formatNumber(ticker_info?.high ?? 0)}</dd>
        </dl>
        <dl>
          <dt>저가</dt>
          <dd>{formatNumber(ticker_info?.low ?? 0)}</dd>
        </dl>
        <dl>
          <dt>체결금액</dt>
          <dd>{formatNumber(ticker_info?.quote_volume ?? 0)}</dd>
        </dl>
        <dl>
          <dt>체결량</dt>
          <dd>{formatNumber(ticker_info?.target_volume ?? 0)}</dd>
        </dl>
      </section>
    </main>
  );
};

export { CryptoCurrencyDetailMain };

interface GetCandleChartQueryOptionParams {
  ticker: string;
  interval: Interval;
}

export type GetCandleChartResponse = Extract<
  ChartHandlerResult,
  GetCandleChartReturnType
>;

function getCandleChartQueryOptions(
  params: GetCandleChartQueryOptionParams
): UseQueryOptions<
  GetCandleChartResponse,
  Error,
  GetCandleChartResponse["chart"]
> {
  const { ticker, interval } = params;

  return {
    queryKey: ["candle-chart", ticker, interval],
    queryFn: async () => {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/chart/${ticker}`,
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ interval }),
        }
      );
      const data = await result.json();
      return data;
    },
    select: (data) => {
      return data.chart;
    },
  };
}

type GetTickerInfoResponse = Extract<
  TickerInfoHandlerResult,
  GetTickerInfoReturnType
>;

function getTickerInfoQueryOptions(params: {
  ticker: string;
}): UseQueryOptions<
  GetTickerInfoResponse,
  Error,
  GetTickerInfoResponse["tickers"][number] | undefined
> {
  const { ticker } = params;

  return {
    queryKey: ["ticker-info", ticker],
    queryFn: async () => {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/tickers/${ticker}`
      );
      const data = await result.json();
      return data;
    },
    select: (data) => {
      return data.tickers.at(0);
    },
  };
}
