import { GetCandleChartResponse } from "..";

export interface DataItemInterface {
  timestamp: Date;
  close_value: number;
}

export function formatChartData(
  chart_data: GetCandleChartResponse["chart"] | undefined
) {
  const data_list: DataItemInterface[] =
    chart_data?.map((item) => {
      return {
        timestamp: new Date(item.timestamp),
        close_value: parseFloat(item.close),
      };
    }) ?? [];

  return data_list;
}
