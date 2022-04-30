import React from 'react'
import { format, parseISO } from 'date-fns';
import { NumberFormat } from "./NumberFormat";
import * as d3 from 'd3';
import { useD3 } from './hooks/useD3';


function ExpenseMonthBarChart({ data }) {

  // format the data
  var sum = 0;
  data.forEach(function(d) {
      d.date = format(parseISO(d.date), "yyyy-MM-dd");
      sum += d.amount;
      d.close = +d.close;
  });

 const ref = useD3(
   (svg) => {
      const height = 220;
      const width = 320;
      const margin = { top: 0, right: 10, bottom: 80, left: 25 };

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.date))
        .rangeRound([width - margin.right, margin.left])
        .padding(0.1);

      const y1 = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.amount)])
        .rangeRound([height - margin.bottom, margin.top]);

      const xAxis = (g) =>
        g.attr("transform", `translate(0, ${height - margin.bottom})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
              .style("text-anchor", "end")
              .style("color", "teal")
              .style('font-size', '9px')
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", "rotate(-65)");

      const y1Axis = (g) =>
        g.attr("transform", `translate(${margin.left},0)`)
          .style("color", "teal")
          .call(d3.axisLeft(y1).ticks(null, "s"))
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g.append("text")
              .attr("x", 0 - margin.left)
              .attr("y", 10)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text(data.y1)
          );

      svg.select(".x-axis").call(xAxis);
      svg.select(".y-axis").call(y1Axis);


      svg
        .select(".plot-area")
        .attr("fill", "teal")
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.date))
        .attr("width", x.bandwidth())
        .attr("y", (d) => y1(d.amount))
        .attr("height", (d) => y1(0) - y1(d.amount));

        svg.append("text")
           .attr("x", width - 100)
           .attr("y", 12)
           .attr("text-anchor", "start")
           .style("font-size", "12px")
           .text("Total: " + sum);
    },
    [data.length]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: 200,
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    >
      <g className="plot-area" />
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
}

export default ExpenseMonthBarChart;