import React, {useEffect} from 'react'
import { parseISO } from 'date-fns';
import * as d3 from 'd3';

function DrawLineChart({ data, divContainer, domain }) {

    var yearsBackFromNow = new Date();
    var today = new Date();
    var numberOfYears = 5;
    yearsBackFromNow.setFullYear(yearsBackFromNow.getFullYear() - numberOfYears);


    var filteredData = data.filter(function(record) {
       var date = parseISO(record.yearMonth);

       if (date <= yearsBackFromNow) {
           return false;
       } else {
           return true;
       }
    });

    filteredData.sort((a,b) => {
        if ( a.yearMonth < b.yearMonth ){
            return -1;
          }
          if ( a.yearMonth > b.yearMonth ){
            return 1;
          }
          return 0;
    });

    var maxAsOnValue = 0;
    var maxInvestmentAmount = 0;
    const contributionArray = [];
    const investmentValueArray = [];
    filteredData.forEach(function(record) {

          if (maxAsOnValue < record.asOnValue) {
              maxAsOnValue = record.asOnValue;
          }
          if (maxInvestmentAmount < record.asOnInvestment) {
              maxInvestmentAmount = record.asOnInvestment;
          }

          contributionArray.push({
            'yearMonth': parseISO(record.yearMonth),
            'amount': record.asOnInvestment
          });

          investmentValueArray.push({
            'yearMonth': parseISO(record.yearMonth),
            'amount': record.asOnValue
          });
    });

    useEffect(() => {
         drawChart();
    }, [filteredData]);

    function drawChart() {
       const height = 580;
       const width = 1200;
       const margin = { top: 0, right: 10, bottom: 80, left: 30 };
       const numberOfYaxisTicks = 30;

       var allGroup = ["invested: " + parseFloat(maxInvestmentAmount/100000).toFixed(2) + "L", "value: " + parseFloat(maxAsOnValue/100000).toFixed(2) + "L"]
       // A color scale: one color for each group
       var myColor = d3.scaleOrdinal()
         .domain(allGroup)
         .range(d3.schemeSet2);


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
       const xScale = d3.scaleTime()
            .domain([yearsBackFromNow, today])
            .range([0, width]);


       const yScale = d3.scaleLinear()
          .domain(domain)
          .range([height, 0]);

      // Setting up the axis
      const xAxis = d3
            .axisBottom(xScale)
           .ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%b %y'));

      const yAxis = d3
          .axisLeft(yScale)
          .tickFormat(function(d){ return d/100000 + 'L'; })
          .ticks(numberOfYaxisTicks);

       svg.append('g')
          .call(xAxis)
          .attr('transform', `translate(0, ${height})`)
          .selectAll("text")
                   .style("text-anchor", "end")
                   .style('font-size', '12')
                   .attr("dx", "-.8em")
                   .attr("dy", ".15em")
                   .attr("transform", "rotate(-65)")

       svg.append('g')
           .call(yAxis);

       //append legends
       var legend = svg.append('g')
           .selectAll('g.legend')
           .data(allGroup)
           .enter()
           .append("g")
           .attr("class", "legend");

       legend.append("circle")
           .attr("cx", width - 800)
           .attr('cy', (d, i) => i * 18 + 10)
           .attr("r", 4)
           .style("fill", d => myColor(d));

       legend.append("text")
           .attr("x", width - 780)
           .attr("y", (d, i) => i * 18 + 12)
           .attr("dx", "-.8em")
           .attr("dy", ".15em")
           .attr("text-anchor", "left")
           .style('font-family', 'Patrick Hand SC')
           .style('font-size', '.9em')
           .text(d => d)

       drawLineAndDots("invested: " + parseFloat(maxInvestmentAmount/100000).toFixed(2) + "L", contributionArray);
       drawLineAndDots("value: " + parseFloat(maxAsOnValue/100000).toFixed(2) + "L", investmentValueArray);

       // Draw grid lines
       drawHorizontalLines();
       drawVerticalLines();

       function drawLineAndDots(type, data) {
            // Draw the dots for income
            svg.append('g')
              .selectAll('dot')
              .data(data)
              .enter()
              .append('circle')
              .attr('cx', function(d, i) {
                 return xScale(d.yearMonth);
               })
              .attr('cy', function(d) { return yScale(d.amount); })
              .attr('r', 2)
              .attr('transform', `translate(0, 0)`)  // translate has x axis and y axis
              .style('fill', function(d){ return myColor(type) });

          // Draw the line - for income
          svg
            .append('g')
            .append("path")
              .datum(data)
              .attr("d", d3.line()
                .x(function(d) { return xScale(d.yearMonth) })
                .y(function(d) { return yScale(d.amount) })
              )
              .attr("stroke", function(d){ return myColor(type) })
              .style("stroke-width", 2)
              .style("fill", "none");
       }

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

       function drawVerticalLines() {
         // preparing data for vertical lines
         const verticalDataGridPoints = [];

         const xIncrBy = width / 5;
         for (var x = 0; x < width ; x = x + xIncrBy) {
              verticalDataGridPoints.push(
                  [{
                       'x': x, 'y': height
                   },{
                       'x': x, 'y': 0
                   }]
              );
         }
         verticalDataGridPoints.forEach(grid => drawGridLines(grid));
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

export default DrawLineChart;

