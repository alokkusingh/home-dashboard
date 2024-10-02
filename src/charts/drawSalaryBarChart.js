import React, {useEffect} from 'react'
import * as d3 from 'd3';

function DrawSalaryBarChart({ inHandMap, ctcMap, invMap, taxMap, divContainer, domain,  numberOfYaxisTicks, colorDomain}) {

  const inHandMapSorted = new Map([...inHandMap].sort());
  const ctcMapSorted = new Map([...ctcMap].sort());
  const invMapSorted = new Map([...invMap].sort());
  const taxMapSorted = new Map([...taxMap].sort());
  var dataArr = [];
  inHandMapSorted.forEach(function(value, key) {
    if (key !== undefined) {
      var ctc = 0;
      if (ctcMapSorted.get(key) !== undefined) {
          ctc = ctcMapSorted.get(key);
      }
      var inv = 0;
      if (invMapSorted.get(key) !== undefined) {
          inv = invMapSorted.get(key);
      }
      var tax = 0;
      if (taxMapSorted.get(key) !== undefined) {
          tax = taxMapSorted.get(key);
      }
      dataArr.push({
       'head': key,
       'ctc': ctc,
       'inHandPlusInvPlusTax': value + inv + tax,
       'inHandPlusInv': value + inv,
       'inHand': value
      });
    }
  });

  //var colors = ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]
  var colors = ["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]

  //var colors = ["steelblue", "gold", "#69b3a2", "#F9CAC8"];

  useEffect(() => {
      drawChart();
  });

 function drawChart() {
      const height = 220;
      const width = 300;
      const margin = { top: 0, right: 10, bottom: 80, left: 30 };

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
          .attr("fill", function(d) { return colors[0]; })
          .attr("x", function(d) { return xScale(d.head); })
          .attr("y", function(d) { return yScale(d.inHandPlusInvPlusTax); })
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => yScale(0) - yScale(d.inHandPlusInv))
          .on('mouseenter', function (actual, i) {
              d3.select(this).attr('opacity', 0.5)
          })
          .on('mouseleave', function (actual, i) {
              d3.select(this).attr('opacity', 1)
          })
    svg
          .append('g')
          .selectAll("text")
          .data(dataArr)
          .enter()
          .append("text")
              .text(function(d) { return (d.inHandPlusInvPlusTax / 1_00_000).toFixed(1); })
              .attr("x", function(d) { return xScale(d.head) + xScale.bandwidth() / 2; })
              .attr("y", function(d) { return yScale(d.inHandPlusInvPlusTax) + 6; })
              .style("font-size", 6.5)
              .style("text-anchor", "middle")
              .style('fill', 'white')

    svg
      .append('g')
      .selectAll(".bar")
      .data(dataArr)
      .enter()
      .append("rect")
          .attr("class", "bar")
          .attr("fill", function(d) { return colors[1]; })
          .attr("x", function(d) { return xScale(d.head); })
          .attr("y", function(d) { return yScale(d.inHandPlusInv); })
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => yScale(0) - yScale(d.inHandPlusInv))
          .on('mouseenter', function (actual, i) {
              d3.select(this).attr('opacity', 0.5)
          })
          .on('mouseleave', function (actual, i) {
              d3.select(this).attr('opacity', 1)
          })
    svg
      .append('g')
      .selectAll("text")
      .data(dataArr)
      .enter()
      .append("text")
          .text(function(d) { return (d.inHandPlusInv / 1_00_000).toFixed(1); })
          .attr("x", function(d) { return xScale(d.head) + xScale.bandwidth() / 2; })
          .attr("y", function(d) { return yScale(d.inHandPlusInv) + 6; })
          .style("font-size", 6.5)
          .style("text-anchor", "middle")

    svg
      .append('g')
      .selectAll(".bar")
      .data(dataArr)
      .enter()
      .append("rect")
          .attr("class", "bar")
          .attr("fill", function(d) { return colors[2]; })
          .attr("x", function(d) { return xScale(d.head); })
          .attr("y", function(d) { return yScale(d.inHand); })
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => yScale(0) - yScale(d.inHand))
          .on('mouseenter', function (actual, i) {
              d3.select(this).attr('opacity', 0.5)
          })
          .on('mouseleave', function (actual, i) {
              d3.select(this).attr('opacity', 1)
          })
    svg
      .append('g')
      .selectAll("text")
      .data(dataArr)
      .enter()
      .append("text")
          .text(function(d) { return (d.inHand / 1_00_000).toFixed(1); })
          .attr("x", function(d) { return xScale(d.head) + xScale.bandwidth() / 2; })
          .attr("y", function(d) { return yScale(d.inHand) + 6; })
          .style("font-size", 6.5)
          .style("text-anchor", "middle")
          .style('fill', 'white')

    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (20) + ',0)');

    legend.selectAll('rect')
        .data(['Tax', 'Investment', 'In Hand'])
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', function(d,i){
            return (i * 18) + 10;
        })
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', function(d,i){
            return colors[i];
        });

    legend.selectAll('text')
        .data(['Tax', 'Investment', 'In Hand'])
        .enter()
        .append('text')
        .text(function(d){
            return d;
        })
        .attr('x', 20)
        .attr('y', function(d, i){
            return (i * 18) + 10;
        })
        .style('font-family', 'Patrick Hand SC')
        .style('font-size', '.85em')
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging');

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

export default DrawSalaryBarChart;