import { ErrorResult } from "@/api/types";
import { NextApiRequest, NextApiResponse } from "next";

export interface Currency {
  /** 종목의 영문명 */
  name: string;
  /** 종목의 심볼 */
  symbol: string;
  /**
   * 입금 가능 여부 상태(enum)
   * -normal : 입금 가능
   * -suspended : 입금 정지
   */
  deposit_status: "normal" | "suspended";
  /**
   * 출금 가능 여부 상태(enum)
   * -normal: 출금 가능
   * -suspended : 출금 정지
   */
  withdraw_status: "normal" | "suspended";
  /** 입금 컨펌 수 */
  deposit_confirm_count: number;
  /**
   * 출금 가능한 소숫점 아래 자릿수
   * 예) 0.12345678 까지가능하면 max_precision = 8
   */
  max_precision: number;
  /** 입금 수수료 */
  deposit_fee: number;
  /** 최소 출금 가능 수량 */
  withdrawal_min_amount: number;
  /** 출금 수수료 */
  withdrawal_fee: number;
}

interface GetCurrencyListParams {}

interface GetCurrencyListReturnType {
  result: "success" | "error";
  error_code: string;
  server_time: number;
  currencies: Currency[];
}

export type { GetCurrencyListReturnType };

/** --- handler --- */

interface CurrencyListHandlerParams extends GetCurrencyListParams {}

interface CurrencyListHandlerRequest extends NextApiRequest {
  body: Partial<CurrencyListHandlerParams>;
}

type CurrencyListHandlerResult = GetCurrencyListReturnType | ErrorResult;

type CurrencyListHandlerResponse = NextApiResponse<CurrencyListHandlerResult>;

export type { CurrencyListHandlerResult };
export type { CurrencyListHandlerRequest, CurrencyListHandlerResponse };
