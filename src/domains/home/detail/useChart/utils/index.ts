import { DataItemInterface } from "../../utils";
import * as d3 from "d3";

export function getRects(element: Element) {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}

const CHART_MARGIN = {
  top: 20,
  bottom: 20,
  left: 0,
  right: 0,
};

export function getScales(
  data: DataItemInterface[],
  width: number,
  height: number
) {
  const x_domain = d3.extent(data, (d) => d.timestamp) as [Date, Date];
  const y_domain = d3.extent(data, (d) => d.close_value) as [number, number];

  const xScale = d3
    .scaleTime()
    .domain(x_domain)
    .range([CHART_MARGIN.left, width - CHART_MARGIN.right]);
  const yScale = d3
    .scaleLinear()
    .domain(y_domain)
    .range([height - CHART_MARGIN.bottom, CHART_MARGIN.top]);

  return { xScale, yScale };
}
