import { ErrorResult } from "@/api/types";
import { NextApiRequest, NextApiResponse } from "next";

interface Chart {
  /** 캔들스틱의 타임스탬프 (unix time, ms) */
  timestamp: number;
  /** 시가 */
  open: string;
  /** 고가 */
  high: string;
  /** 저가 */
  low: string;
  /** 종가 */
  close: string;
  /** 거래량 */
  target_volume: string;
  /** 거래 금액 (원화) */
  quote_volume: string;
}

export const INTERVAL_LIST = [
  "1m",
  "3m",
  "5m",
  // "10m", // 동작 X
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "1d",
  "1w",
  "1mon",
] as const;

type ChartInterval = (typeof INTERVAL_LIST)[number];

export interface GetCandleChartParams {
  currency: "KRW";
  ticker: string;
  interval: ChartInterval;
  size?: number;
}

interface GetCandleChartReturnType {
  result: "success" | "error";
  error_code: string;
  server_time: number;
  chart: Chart[];
}

export type { GetCandleChartReturnType };

/** --- handler --- */

interface ChartHandlerParams extends GetCandleChartParams {}

interface ChartHandlerRequest extends NextApiRequest {
  body: Partial<ChartHandlerParams>;
}

type ChartHandlerResult = GetCandleChartReturnType | ErrorResult;

type ChartHandlerResponse = NextApiResponse<ChartHandlerResult>;

export type { ChartHandlerParams, ChartHandlerResult };
export type { ChartHandlerRequest, ChartHandlerResponse };
