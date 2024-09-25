import {
  ChartHandlerRequest,
  ChartHandlerResponse,
  GetCandleChartParams,
  GetCandleChartReturnType,
} from "./types";

export async function getCandleChart(
  params: GetCandleChartParams
): Promise<GetCandleChartReturnType> {
  const { currency, ticker, interval, size = 200 } = params;

  const url = new URL(
    `https://api.coinone.co.kr/public/v2/chart/${currency}/${ticker}`
  );
  url.searchParams.set("interval", interval.toString());
  url.searchParams.set("size", size.toString());

  const result = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await result.json();
  return data;
}

async function handler(req: ChartHandlerRequest, res: ChartHandlerResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({ error_message: "400 Error" });
  }

  const { ticker } = req.query;
  const { interval } = req.body;

  if (!interval) {
    return res.status(500).json({ error_message: "Bad Request" });
  }

  if (!ticker || typeof ticker !== "string") {
    return res.status(500).json({ error_message: "bad request" });
  }

  const result = await getCandleChart({
    currency: "KRW",
    ticker: ticker.toUpperCase(),
    interval: interval,
  });

  res.status(200).json(result);
}

export { handler as chartHandler };
