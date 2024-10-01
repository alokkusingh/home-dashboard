import React, {useEffect} from 'react'
import { parseISO } from 'date-fns';
import * as d3 from 'd3';

function ExpenseVsIncomeLineChart({ data }) {

    var oneYearBackFromNow = new Date();
    oneYearBackFromNow.setFullYear(oneYearBackFromNow.getFullYear() - 1.5);

    var filteredData = data.filter(function(record) {
       var date = null;
       if(record.month < 10) {
         date = parseISO(record.year + "0" + record.month);
       } else {
         date = parseISO(record.year + "" + record.month);
       }

       if (date <= oneYearBackFromNow) {
           return false;
       } else {
           return true;
       }
    });

   const expenseArray = [];
   const incomeArray = [];
   const transferArray = [];
   const investmentArray = [];
   var maxExpenseAmount = 0, maxIncomeAmount = 0;
   var minDate = null, maxDate = null;

    filteredData.forEach(function(record) {
          var date = null;
          if(record.month < 10) {
            date = parseISO(record.year + "0" + record.month);
          } else {
            date = parseISO(record.year + "" + record.month);
          }
          record.date = date;

          expenseArray.push({
              'date': date,
              'amount': record.expenseAmount
          });

          if (record.incomeAmount != null) {
                incomeArray.push({
                     'date': date,
                     'amount': record.incomeAmount + record.investmentByCompany
                });
          }

          if (record.transferAmount != null) {
                transferArray.push({
                     'date': date,
                     'amount': record.transferAmount
                });
          }

          if (record.investmentAmount != null) {
                investmentArray.push({
                     'date': date,
                     'amount': record.investmentAmount
                });
          }


          if (maxExpenseAmount < record.expenseAmount) {
              maxExpenseAmount = record.expenseAmount;
          }

          if (maxIncomeAmount < record.incomeAmount) {
              maxIncomeAmount = record.incomeAmount;
          }

          if (minDate == null || minDate > record.date) {
              minDate = record.date;
          }

          if (maxDate == null || maxDate < record.date) {
              maxDate = record.date;
          }
    });

    useEffect(() => {
         drawChart();
    }, [filteredData]);

    function drawChart() {
//       const height = 220;
//       const width = 380;
//       const margin = { top: 0, right: 10, bottom: 80, left: 10 };
       var margin = {top: 0, right: 0, bottom: 0, left: 0},
                 outerWidth = 320,
                 outerHeight = 220,
                 width = outerWidth - margin.left - margin.right,
                 height = outerHeight - margin.top - margin.bottom;
       const numberOfYaxisTicks = 8;

       var allGroup = ["income", "expense", "transfer", "investment"]
       // A color scale: one color for each group
       var myColor = d3.scaleOrdinal()
         .domain(allGroup)
         .range(d3.schemeSet2);

       // Remove the old svg
       d3.select('#summary-line-container')
          .select('svg')
          .remove();

       // Create new svg
       const svg = d3
          .select('#summary-line-container')
          .append('svg')
          .attr('width', outerWidth)
          .attr('height', outerHeight)
          .style('background', 'white')
          .style('overflow', 'visible');

       // Setting the scale
       const xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width]);

       const yScale = d3.scaleLinear()
          .domain([-100000, 850000])
          .range([height, 0]);

      // Setting up the axis
      const xAxis = d3.axisBottom(xScale)
           .ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%b'));

      const yAxis = d3
          .axisLeft(yScale)
          .tickFormat(function(d){ return d/1000 + 'K'; })
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

       // Setting Text
          // Title
       svg.append('text')
          .attr('x', width/2 + 10)
          .attr('y', -20)
          .style('text-anchor', 'middle')
          .style('color', 'teal')
          .style('font-family', 'Helvetica')
          .style('font-size', 18)
          .text('Last 24 months summary');

          // X label - not needed
/*       svg.append('text')
          .attr('x', width/2 )
          .attr('y', height+40)
          .attr('text-anchor', 'middle')
          .style('font-family', 'Helvetica')
          .style('font-size', 14)
          .text('-- Months -->')*/

          // Y label
       /*svg.append('text')
         .attr('text-anchor', 'middle')
         .attr('transform', `translate(-45,100)rotate(-90)`) // translate has x axis and y axis
         .style('font-family', 'Helvetica')
         .style('font-size', 14)
         .text('Amount (Rs)')*/

       //append legends
       var legend = svg.append('g')
           .selectAll('g.legend')
           .data(allGroup)
           .enter()
           .append("g")
           .attr("class", "legend");

       legend.append("circle")
           .attr("cx", width - 310)
           .attr('cy', (d, i) => i * 18 + 10)
           .attr("r", 3)
           .style("fill", d => myColor(d));

       legend.append("text")
           .attr("x", width - 300)
           .attr("y", (d, i) => i * 18 + 12)
           .attr("dx", "-.8em")
           .attr("dy", ".15em")
           .attr("text-anchor", "left")
           .style('font-family', 'Patrick Hand SC')
           .style('font-size', '.5em')
           .text(d => d)

       drawLineAndDots("expense", expenseArray);
       drawLineAndDots("income", incomeArray);
       drawLineAndDots("transfer", transferArray);
       drawLineAndDots("investment", investmentArray);

       // Draw grid lines
       drawHorizontalLines(numberOfYaxisTicks, .2);
       //drawHorizontalLines(numberOfYaxisTicks/2, .1);
       drawVerticalLines();

       function drawLineAndDots(type, data) {
          // Draw the dots for income
          svg.append('g')
            .selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function(d, i) {
               return xScale(d.date);
             })
            .attr('cy', function(d) { return yScale(d.amount); })
            .attr('r', 1.5)
            .attr('transform', `translate(0, 0)`)  // translate has x axis and y axis
            .style('fill', function(d){ return myColor(type) });

          // Draw the line - for income
          svg
            .append('g')
            .append("path")
              .datum(data)
              .attr("d", d3.line()
                .x(function(d) { return xScale(d.date) })
                .y(function(d) { return yScale(d.amount) })
              )
              .attr("stroke", function(d){ return myColor(type) })
              .style("stroke-width", 1)
              .style("fill", "none");
       }

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

       function drawVerticalLines() {
         // preparing data for vertical lines
         const verticalDataGridPoints = [];

         const xIncrBy = (width) / 11.5;
         for (var x = 0; x < width ; x = x + xIncrBy) {
            verticalDataGridPoints.push(
              [{
                   'x': x, 'y': height
               },{
                   'x': x, 'y': 0
               }]
            );
         }
         verticalDataGridPoints.forEach(grid => drawGridLines(grid, .4));
      }

       function drawGridLines(dataGrid, strokeWidth) {
          svg
             .append('g')
             .append("path")
               .datum(dataGrid)
               .attr("d", d3.line()
                 .x(function(d) { return d.x })
                 .y(function(d) { return d.y })
               )
               .attr("stroke", 'grey')
               .style("stroke-width", strokeWidth)
               .style("fill", "none");
       }
   }

   return <div id="summary-line-container" />;
}

export default ExpenseVsIncomeLineChart;

