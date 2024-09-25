import { ErrorResult } from "@/api/types";
import { NextApiRequest, NextApiResponse } from "next";

interface BestAsks {
  /** 매도 가격북 */
  price: number;
  /** 매도 수량 */
  qty: number;
}

interface BestBids {
  /** 매수 가격 */
  price: number;
  /** 매수 수량 */
  qty: number;
}

interface Tickers {
  /** 마켓 기준 통화 */
  quote_currency: string;
  /** 티커 종목 명 */
  target_currency: string;
  /** 티커 생성 시점 (Unix time) (ms) */
  timestamp: number;
  /** 고가 (UTC 24시간 기준) */
  high: number;
  /** 저가 (UTC 24시간 기준) */
  low: number;
  /** 시가 (UTC 24시간 기준) */
  first: number;
  /** 종가 (UTC 24시간 기준) */
  last: number;
  /** 최근 24시간 기준 종목 체결 금액 (원화) */
  quote_volume: number;
  /** 최근 24시간 기준 종목 체결량 (종목) */
  target_volume: number;
  /** 매도 최저가 오더 정보 */
  best_asks: BestAsks[];
  /** 매수 최고가 오더북 정보 */
  best_bids: BestBids[];
  /** 티커 별 ID 값으로 클수록 최신 티커 정보 */
  id: string;
}

interface GetTickerInfoParams {
  currency: "KRW";
  ticker: string;
}

interface GetTickerInfoReturnType {
  result: "success" | "error";
  error_code: string;
  server_time: number;
  tickers: Tickers[];
}

export type { GetTickerInfoParams, GetTickerInfoReturnType };

/** --- handler --- */

interface TickerInfoHandlerParams extends GetTickerInfoParams {}

interface TickerInfoHandlerRequest extends NextApiRequest {
  body: Partial<TickerInfoHandlerParams>;
}

type TickerInfoHandlerResult = GetTickerInfoReturnType | ErrorResult;

type TickerInfoHandlerResponse = NextApiResponse<TickerInfoHandlerResult>;

export type { TickerInfoHandlerResult };
export type { TickerInfoHandlerRequest, TickerInfoHandlerResponse };
