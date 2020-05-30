import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { AppState } from "../core/store";
import {
  ladderSelectors,
  getLadderHistoryForUser,
} from "../resources/ladder-history/ladderSlice";
import { appendFile } from "fs";

const RatingHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const history = useSelector((state: AppState) =>
    getLadderHistoryForUser(state, userId)
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current!;
    const rect = container.getBoundingClientRect();
    const margin = { top: 10, right: 20, bottom: 30, left: 30 };
    const height = rect.height - margin.top - margin.bottom;
    const width = rect.width - margin.left - margin.right;

    const points = history.map((item) => item.ladder_rung);
    const svg = d3
      .select(container)
      .append("svg")
      .attr("height", rect.height)
      .attr("width", rect.width)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${rect.width} ${rect.height}`)
      .style("background-color", "white")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, points.length - 1])
      .range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([d3.min(points)! - 5, d3.max(points)! + 5])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    const line = d3
      .line<number>()
      .x((rung, index) => x(index))
      .y((rung) => y(rung));

    const el = svg
      .append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    return () => {
      // TODO make this cleaner when the effect is nailed down
      let child = container?.lastChild;
      while (child) {
        container?.removeChild(child);
        child = container?.lastChild;
      }
    };
  }, [history]);

  return (
    <div ref={ref} style={{ height: 300 }}>
      {/* {history.map((item) => (
        <p>{item.ladder_rung}</p>
      ))} */}
    </div>
  );
};

export default RatingHistory;
