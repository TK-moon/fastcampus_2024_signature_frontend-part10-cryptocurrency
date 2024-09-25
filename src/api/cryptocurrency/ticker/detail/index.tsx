import {
  TickerInfoHandlerRequest,
  TickerInfoHandlerResponse,
  GetTickerInfoParams,
  GetTickerInfoReturnType,
} from "./types";

export async function getTickerInfo(
  params: GetTickerInfoParams
): Promise<GetTickerInfoReturnType> {
  const { currency, ticker } = params;
  const url = new URL(
    `https://api.coinone.co.kr/public/v2/ticker_utc_new/${currency}/${ticker}`
  );

  const result = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await result.json();
  return data;
}

async function handler(
  req: TickerInfoHandlerRequest,
  res: TickerInfoHandlerResponse
) {
  if (req.method !== "GET") {
    return res.status(400).json({ error_message: "400 Error" });
  }

  const { ticker } = req.query;

  if (!ticker || typeof ticker !== "string") {
    return res.status(500).json({ error_message: "bad request" });
  }

  const result = await getTickerInfo({
    currency: "KRW",
    ticker: ticker.toUpperCase(),
  });

  res.status(200).json(result);
}

export { handler as tickerDetailHandler };
