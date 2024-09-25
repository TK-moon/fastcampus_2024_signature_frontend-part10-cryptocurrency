/** --- TICKER LIST --- */

import { ErrorResult } from "@/api/types";
import { NextApiRequest, NextApiResponse } from "next";

interface BestAsks {
  /** 매도 가격 */
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

interface Ticker {
  /** 티커 별 ID 값으로 클수록 최신 티커 정보 */
  id: string;
  /** 마켓 기준 통화 */
  quote_currency: string;
  /** 티커 종목 명 */
  target_currency: string;
  /** 티커 생성 시점 (Unix time) (ms) */
  timestamp: number;
  /** 고가 (24시간 기준) */
  high: number;
  /** 저가 (24시간 기준) */
  low: number;
  /** 시가 (24시간 기준) */
  first: number;
  /** 종가 (24시간 기준) */
  last: number;
  /** 24시간 기준 종목 체결 금액 (원화) */
  quote_volume: number;
  /** 24시간 기준 종목 체결량 (종목) */
  target_volume: number;
  /** 매도 최저가의 오더북 정보 */
  best_asks: BestAsks[];
  /** 매수 최고가의 오더북 정보 */
  best_bids: BestBids[];
}

interface GetTickerListParams {}

interface GetTickerListReturnType {
  result: "success" | "error";
  error_code: string;
  tickers: Ticker[];
  server_time: number;
}

export type { GetTickerListReturnType };

/** --- handler --- */

interface TickerListHandlerParams extends GetTickerListParams {}

interface TickerListHandlerRequest extends NextApiRequest {
  body: Partial<TickerListHandlerParams>;
}

type TickerListHandlerResult = GetTickerListReturnType | ErrorResult;

type TickerListHandlerResponse = NextApiResponse<TickerListHandlerResult>;

export type { TickerListHandlerResult };
export type { TickerListHandlerRequest, TickerListHandlerResponse };
