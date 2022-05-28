import React, {useEffect} from 'react'
import { parseISO } from 'date-fns';
import * as d3 from 'd3';

function ExpenseVsIncomeLineChartAll({ data }) {


    var oneYearBackFromNow = new Date();
    oneYearBackFromNow.setFullYear(oneYearBackFromNow.getFullYear() - 10);

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

          if (record.expenseAmount != null && record.expenseAmount != 0) {
            expenseArray.push({
              'date': date,
              'amount': record.expenseAmount
            });
          }

          if (record.incomeAmount != null && record.incomeAmount != 0) {
            incomeArray.push({
                 'date': date,
                 'amount': record.incomeAmount
            });
          }

          if (record.transferAmount != null && record.transferAmount != 0) {
            transferArray.push({
                 'date': date,
                 'amount': record.transferAmount
            });
          }

          if (record.investmentAmount != null && record.investmentAmount != 0) {
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
    }, [data]);

    function drawChart() {
       const height = 220;
       const width = 1300;
       const margin = { top: 0, right: 10, bottom: 80, left: 30 };
       const numberOfYaxisTicks = 10;

       var allGroup = ["income", "expense", "transfer", "saving", "investment"]
       // A color scale: one color for each group
       var myColor = d3.scaleOrdinal()
         .domain(allGroup)
         .range(d3.schemeSet2);


       // Remove the old svg
       d3.select('#summary-all-line-container')
          .select('svg')
          .remove();

       // Create new svg
       const svg = d3
          .select('#summary-all-line-container')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('background', 'white')
          .style('overflow', 'visible');

       // Setting the scale
       const xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, width]);


       const yScale = d3.scaleLinear()
          .domain([0, maxIncomeAmount + 10000])
          .range([height, 0]);

      // Setting up the axis
      const xAxis = d3.axisBottom(xScale)
           .ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%b %y'));

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
          .text('Last 10 years summary');

          // X label - not working
       /*svg.append('text')
          .attr('x', width/2 )
          .attr('y', height+40)
          .attr('text-anchor', 'middle')
          .style('font-family', 'Helvetica')
          .style('font-size', 14)
          .text('-- Months -->')*/

          // Y label
       svg.append('text')
         .attr('text-anchor', 'middle')
         .attr('transform', `translate(-45,100)rotate(-90)`) // translate has x axis and y axis
         .style('font-family', 'Helvetica')
         .style('font-size', 14)
         .text('Amount (Rs)')

       //append legends
       var legend = svg.append('g')
           .selectAll('g.legend')
           .data(allGroup)
           .enter()
           .append("g")
           .attr("class", "legend");

       legend.append("circle")
           .attr("cx", width + 15)
           .attr('cy', (d, i) => i * 30 + 90)
           .attr("r", 6)
           .style("fill", d => myColor(d));

       legend.append("text")
           .attr("x", width + 25)
           .attr("y", (d, i) => i * 30 + 93)
           .attr("text-anchor", "left")
           .text(d => d)
           .style('font-family', 'Helvetica')
           .style('font-size', 10)

       drawLineAndDots("expense", expenseArray);
       drawLineAndDots("income", incomeArray);
       drawLineAndDots("transfer", transferArray);
       drawLineAndDots("investment", investmentArray);

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
                 return xScale(d.date);
               })
              .attr('cy', function(d) { return yScale(d.amount); })
              .attr('r', 3)
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

         const xIncrBy = width / 11;
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

   return <div id="summary-all-line-container" />;
}

export default ExpenseVsIncomeLineChartAll;

