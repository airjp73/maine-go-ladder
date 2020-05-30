import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { AppState } from "../core/store";
import { getLadderHistoryForUser } from "../resources/ladder-history/ladderSlice";
import { css } from "@emotion/core";
import { useRect } from "@reach/rect";
import { rungToRating } from "./ratings";
import { useTheme } from "emotion-theming";
import { Theme } from "../common/styles/theme";

const RatingHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const theme = useTheme<Theme>();
  const history = useSelector((state: AppState) =>
    getLadderHistoryForUser(state, userId)
  );
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRect(ref);

  useEffect(() => {
    if (!rect) return;

    const backgroundColor = theme.colors.blue[10].hex;
    const lineColor = theme.colors.blue[70].hex;
    const dotColor = theme.colors.blue[70].hex;

    const container = ref.current!;
    const margin = { top: 10, right: 20, bottom: 30, left: 30 };
    const height = rect.height - margin.top - margin.bottom;
    const width = rect.width - margin.left - margin.right;

    const points = history.map((item) => item.ladder_rung).map(rungToRating);
    const svg = d3
      .select(container)
      .append("svg")
      .attr("height", rect.height)
      .attr("width", rect.width)
      .style("background-color", backgroundColor)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, points.length - 1])
      .range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([d3.min(points)! - 0.5, d3.max(points)! + 0.5])
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

    svg
      .append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 1.5)
      .attr("d", line);

    svg
      .selectAll("dots")
      .data(points)
      .enter()
      .append("circle")
      .attr("fill", dotColor)
      .attr("r", 3)
      .attr("cx", (d, index) => x(index))
      .attr("cy", (d) => y(d));

    return () => {
      // TODO make this cleaner when the effect is nailed down
      let child = container?.lastChild;
      while (child) {
        container?.removeChild(child);
        child = container?.lastChild;
      }
    };
  }, [history, rect]);

  return (
    <div
      ref={ref}
      css={css`
        position: relative;
        height: 300px;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        ${theme.styles.raisedBox}

        svg {
          position: absolute;
          top: 0;
          left: 0;
        }
      `}
    />
  );
};

export default RatingHistory;
