import React, {useEffect} from 'react'
import * as d3 from 'd3';

function DrawBarChart({ dataMap, divContainer, domain,  numberOfYaxisTicks, colorDomain}) {

  const dataMapMapSorted = new Map([...dataMap].sort())
  var dataArr = [];
  dataMapMapSorted.forEach(function(value, key) {
    if (key !== undefined) {
      dataArr.push({
       'head': key,
       'amount': value
      });
    }
  });

  useEffect(() => {
      drawChart();
  });

 function drawChart() {
      const height = 250;
      const width = 350;
      const margin = { top: 0, right: 10, bottom: 80, left: 0 };

      const colorScale = d3.scaleLinear()
        .domain(colorDomain)
        .range(['orange', 'green'])
        .clamp(true)

     // Remove the old svg
     d3.select('#' + divContainer)
        .select('svg')
        .remove();

     // Create new svg
     const svg = d3
        .select('#' + divContainer)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'white')
        .style('overflow', 'visible');

     // Setting the scale
    const xScale = d3.scaleBand()
         .domain(dataArr.map((record) => record.head))
         //.domain(getDaysOfMonthDomain())
         .range([0, width])
         .padding(0.1);

    const yScale = d3.scaleLinear()
       .domain(domain)
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

      svg
        .append('g')
        .selectAll(".bar")
        .data(dataArr)
        .enter()
        .append("rect")
            .attr("class", "bar")
            .attr("fill", function(d) { return colorScale(d.amount); })
            .attr("x", function(d) { return xScale(d.head); })
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
            .attr("x", function(d) { return xScale(d.head) + xScale.bandwidth() / 2; })
            .attr("y", function(d) { return yScale(d.amount) + 6; })
            .style("font-size", 6.5)
            .style("text-anchor", "middle")
            .style('fill', 'white')

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

   return <div id={divContainer} />;
}

export default DrawBarChart;