import {
  CurrencyListHandlerRequest,
  CurrencyListHandlerResponse,
  GetCurrencyListReturnType,
} from "./types";

export async function getCurrencyList(): Promise<GetCurrencyListReturnType> {
  const result = await fetch("https://api.coinone.co.kr/public/v2/currencies", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await result.json();
  return data;
}

async function handler(
  req: CurrencyListHandlerRequest,
  res: CurrencyListHandlerResponse
) {
  if (req.method !== "GET") {
    return res.status(400).json({ error_message: "400 Error" });
  }

  const result = await getCurrencyList();

  res.status(200).json(result);
}

export { handler as currencyListHandler };
