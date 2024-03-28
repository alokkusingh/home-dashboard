import React, {useEffect} from 'react'
import * as d3 from 'd3';
import { formatYearMonth } from "../utils/FormatYearMonth";

function ExpenseForYearCategoryBarChart({ data }) {

  var dataArr = [];
  var maxAmount = 1000;
  var minAmount = 500;
  var total = 0;
  var count = 0;
  Object.keys(data).forEach(
    key => {
      if (data[key] != 0) {
        dataArr.push({
         'month': key,
         'amount': data[key]
        });

        maxAmount = maxAmount < data[key] ? data[key] : maxAmount;
        minAmount = minAmount > data[key] ? data[key] : minAmount;
        count = count + 1;
        total = total + data[key];
      }
    }
  )

  useEffect(() => {
      drawChart();
  });

 function drawChart() {
      const numberOfYaxisTicks = 10;
      var margin = {top: 0, right: 0, bottom: 0, left: 0},
                outerWidth = 320,
                outerHeight = 220,
                width = outerWidth - margin.left - margin.right,
                height = outerHeight - margin.top - margin.bottom;

      var domainAvg = total/count;
      const colorScale = d3.scaleLinear()
        .domain([minAmount, domainAvg, maxAmount])
        .range(['green', 'orange', 'red'])
        .clamp(true)

     // Remove the old svg
     d3.select('#exp-for-year-category-bar-container')
        .select('svg')
        .remove();

     // Create new svg
     const svg = d3
        .select('#exp-for-year-category-bar-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'white')
        .style('overflow', 'visible');

     // Setting the scale
    const xScale = d3.scaleBand()
         .domain(dataArr.map((record) => record.month))
         //.domain(getDaysOfMonthDomain())
         .range([width, 0])
         .padding(0.1);

    const yScale = d3.scaleLinear()
       .domain([0, maxAmount])
       .range([height, 0]);

    // Setting up the axis
     const xAxis = (g) =>
          g.attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

    const yAxis = d3
       .axisLeft(yScale)
       .tickFormat(function(d){ return d/100000 + 'L'; })
       .ticks(numberOfYaxisTicks);

    svg.append('g')
       .call(xAxis)
       .attr('transform', `translate(0, ${height})`)
       .selectAll("text")
         .style("text-anchor", "end")
         .style('font-size', '10')
         .attr("dx", "-.8em")
         .attr("dy", ".15em")
         .attr("transform", "rotate(-65)")

    svg.append('g')
        .call(yAxis);

    // Setting Text
              // Title
   svg.append('text')
      .attr('x', width/2 + 10)
      .attr('y', -20)
      .style('text-anchor', 'middle')
      .style('color', 'teal')
      .style('font-family', 'Helvetica')
      .style('font-size', 18)
      .text('Expense by year')

      svg
        .append('g')
        .selectAll(".bar")
        .data(dataArr)
        .enter()
        .append("rect")
            .attr("class", "bar")
            .attr("fill", function(d) { return colorScale(d.amount); })
            .attr("x", function(d) { return xScale(d.month); })
            .attr("y", function(d) { return yScale(d.amount); })
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => yScale(0) - yScale(d.amount))

      drawHorizontalLines(numberOfYaxisTicks, .1);

      function drawHorizontalLines(numberOfTicks, strokeWidth) {
        svg.append("g")
                 .attr("class", "grid")
                 //.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
                 .attr("stroke-width", strokeWidth)
                 .attr("fill", "none")
                 .call(d3.axisLeft(yScale)
                         .tickSize(-width)
                         .tickFormat("")
                         .ticks(numberOfTicks)

                 );
     }

      function drawGridLines(dataGrid) {
          svg
             .append('g')
             .append("path")
               .datum(dataGrid)
               .attr("d", d3.line()
                 .x(function(d) { return d.x })
                 .y(function(d) { return d.y })
               )
               .attr("stroke", 'grey')
               .style("stroke-width", .2)
               .style("fill", "none");

     }
   }

   return <div id="exp-for-year-category-bar-container" />;
}

export default ExpenseForYearCategoryBarChart;