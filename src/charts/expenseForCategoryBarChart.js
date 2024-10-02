import React, {useEffect} from 'react'
import * as d3 from 'd3';
import { format, parseISO } from 'date-fns';

function ExpenseForCategoryBarChart({ data }) {

  var dataArr = [];
  var maxAmount = 1000;
  var minAmount = 500;
  var total = 0;
  var count = 0;
  var numberOfMonthsToDisplay = 24;
  Object.keys(data).forEach(
    key => {
      if (count > numberOfMonthsToDisplay) {
        return;
      }
      if (data[key] !== 0) {
        var ym = key.split("-");
        var date = null;
         if(ym[1] < 10) {
           date = parseISO(ym[0] + "0" + ym[1]);
         } else {
           date = parseISO(ym[0] + "" + ym[1]);
         }
        dataArr.push({
         'month': date,
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


      var domainMax = maxAmount > 100000 ? 100000 : maxAmount;
      const colorScale = d3.scaleLinear()
        .domain([50000, domainAvg, domainMax])
        .range(['green', 'orange', 'red'])
        .clamp(true)

     // Remove the old svg
     d3.select('#exp-for-category-bar-container')
        .select('svg')
        .remove();

     // Create new svg
     const svg = d3
        .select('#exp-for-category-bar-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'white')
        .style('overflow', 'visible');

     // Setting the scale
    const xScale = d3.scaleBand()
         .domain(dataArr.map((record) => format(record.month, "MMM yy")))
         //.domain(getDaysOfMonthDomain())
         .range([0, width])
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
       .tickFormat(function(d){ return d/1000 + 'K'; })
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
      .text('Expense by month')

      svg
        .append('g')
        .selectAll(".bar")
        .data(dataArr)
        .enter()
        .append("rect")
            .attr("class", "bar")
            .attr("fill", function(d) { return colorScale(d.amount); })
            .attr("x", function(d) { return xScale(format(d.month, "MMM yy")); })
            .attr("y", function(d) { return yScale(d.amount); })
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => yScale(0) - yScale(d.amount))
      svg
        .append('g')
        .selectAll("text")
        .data(dataArr)
        .enter()
        .append("text")
            .text(function(d) { return (d.amount / 1_00_000).toFixed(1); })
            .attr("x", function(d) { return xScale(format(d.month, "MMM yy")) + xScale.bandwidth() / 2; })
            .attr("y", function(d) { return yScale(d.amount) + 10; })
            .style("font-size", 6)
            .style("text-anchor", "middle")
            .style('fill', 'white')

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

   return <div id="exp-for-category-bar-container" />;
}

export default ExpenseForCategoryBarChart;