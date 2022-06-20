import React, {useEffect} from 'react'
import * as d3 from 'd3';

function TaxByYearBarChart({ dataArr }) {

  console.log(dataArr)
  useEffect(() => {
      drawChart();
  });

 function drawChart() {
      const height = 220;
      const width = 300;
      const margin = { top: 0, right: 10, bottom: 80, left: 30 };
      const numberOfYaxisTicks = 10;

      const colorScale = d3.scaleLinear()
        .domain([500000,2500000])
        .range(['orange', 'green'])
        .clamp(true)

     // Remove the old svg
     d3.select('#tax-by-year-bar-container')
        .select('svg')
        .remove();

     // Create new svg
     const svg = d3
        .select('#tax-by-year-bar-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'white')
        .style('overflow', 'visible');

     // Setting the scale
    const xScale = d3.scaleBand()
         .domain(dataArr.map((record) => record.financialYear))
         .range([0, width])
         .padding(0.1);

    const yScale = d3.scaleLinear()
       .domain([0, 1000000])
       .range([height, 0]);

    // Setting up the axis
    const xAxis = (g) =>
      g.attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickValues(
              d3
                .ticks(...d3.extent(xScale.domain()), width / 20)
                .filter((v) => xScale(v) !== undefined )
            )
          .tickSizeOuter(0)
        );

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
      .text('Tax paid by year')

      svg
        .append('g')
        .selectAll(".bar")
        .data(dataArr)
        .enter()
        .append("rect")
            .attr("class", "bar")
            .attr("fill", function(d) { return colorScale(d.paidAmount); })
            .attr("x", function(d) { return xScale(d.financialYear); })
            .attr("y", function(d) { return yScale(d.paidAmount); })
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => yScale(0) - yScale(d.paidAmount))

      drawHorizontalLines();

      function drawHorizontalLines() {
        // preparing data for horizontal lines
        const horizontalDataGridPoints = [];

        const yIncrBy = height  / (numberOfYaxisTicks * 2) ;

        for (var y = 0; y < height ; y = y + yIncrBy) {
             horizontalDataGridPoints.push(
                 [{
                      'x': 0, 'y': y
                  },{
                      'x': width, 'y': y
                  }]
             );
        }

        horizontalDataGridPoints.forEach(grid => drawGridLines(grid));
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

   return <div id="tax-by-year-bar-container" />;
}

export default TaxByYearBarChart;