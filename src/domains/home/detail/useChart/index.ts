import { DataItemInterface } from "../utils";
import { getRects, getScales } from "./utils";
import * as d3 from "d3";

const AREA_CHART_GRADIENT_ID = "area-gradient";

const MAIN_COLOR = "rgba(255, 8, 8 , 0.5)";
const GRADIENT_COLOR = {
  start: MAIN_COLOR,
  end: "rgba(255, 8, 8 , 0)",
};

const useChart = (params: { chart_data: DataItemInterface[] }) => {
  const { chart_data } = params;

  const clearChart = (element: Element) => {
    d3.select(element).select("svg").remove();
  };

  const draw = (element: Element) => {
    const { width, height } = getRects(element);
    const { xScale, yScale } = getScales(chart_data, width, height);

    clearChart(element);

    const drawLine = d3
      .line<DataItemInterface>()
      .x((datum) => xScale(datum.timestamp))
      .y((datum) => yScale(datum.close_value));

    const drawArea = d3
      .area<DataItemInterface>()
      .x((datum) => xScale(datum.timestamp))
      .y0(height)
      .y1((datum) => yScale(datum.close_value));

    const svg = d3
      .select(element)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("path")
      .attr("id", "line")
      .attr("fill", "none")
      .attr("stroke", MAIN_COLOR)
      .attr("stroke-width", 1)
      .attr("d", drawLine(chart_data));

    svg
      .append("path")
      .attr("id", "area")
      .style("fill", `url(#${AREA_CHART_GRADIENT_ID})`)
      .attr("d", drawArea(chart_data));

    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", AREA_CHART_GRADIENT_ID)
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");
    gradient
      .append("stop")
      .attr("offset", "0%")
      .style("stop-color", GRADIENT_COLOR.start);
    gradient
      .append("stop")
      .attr("offset", "100%")
      .style("stop-color", GRADIENT_COLOR.end);
  };

  return { draw };
};

export { useChart };
