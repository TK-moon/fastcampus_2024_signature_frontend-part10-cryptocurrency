import {
  TickerListHandlerRequest,
  TickerListHandlerResponse,
  GetTickerListReturnType,
} from "./types";

export async function getTickerList(
  currency: "KRW"
): Promise<GetTickerListReturnType> {
  const result = await fetch(
    `https://api.coinone.co.kr/public/v2/ticker_new/${currency}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await result.json();
  return data;
}

async function handler(
  req: TickerListHandlerRequest,
  res: TickerListHandlerResponse
) {
  if (req.method !== "GET") {
    return res.status(400).json({ error_message: "400 Error" });
  }

  const result = await getTickerList("KRW");

  res.status(200).json(result);
}

export { handler as tickerListHandler };
