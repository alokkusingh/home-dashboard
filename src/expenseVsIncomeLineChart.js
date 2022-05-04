import React, {useEffect} from 'react'
import { parseISO } from 'date-fns';
import { NumberFormat } from "./NumberFormat";
import * as d3 from 'd3';

function ExpenseVsIncomeLineChart({ data }) {

    var oneYearBackFromNow = new Date();
    oneYearBackFromNow.setFullYear(oneYearBackFromNow.getFullYear() - 1);

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
                     'amount': record.incomeAmount
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
       const height = 220;
       const width = 300;
       const margin = { top: 0, right: 10, bottom: 80, left: 30 };

       var allGroup = ["income", "expense", "transfer", "saving", "investment"]
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
           .ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%b'));

      const yAxis = d3.axisLeft(yScale)
          .ticks(10);

       // Setting Text
          // Title
       svg.append('text')
          .attr('x', width/2 + 70)
          .attr('y', -20)
          .style('text-anchor', 'middle')
          .style('color', 'teal')
          .style('font-family', 'Helvetica')
          .style('font-size', 14)
          .text('Last 12 months summary');

          // X label - not working
       svg.append('text')
          .attr('x', width/2 )
          .attr('y', height+35)
          .attr('text-anchor', 'middle')
          .style('font-family', 'Helvetica')
          .style('font-size', 8)
          .text('Months')

          // Y label
       svg.append('text')
         .attr('text-anchor', 'middle')
         .attr('transform', `translate(-50,100)rotate(-90)`) // translate has x axis and y axis
         .style('font-family', 'Helvetica')
         .style('font-size', 8)
         .text('Amount (Rs)')

       svg.append('g')
          .call(xAxis)
          .attr('transform', `translate(0, ${height})`);

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

// ---------- for expense --------------
       // Draw the dots for expense
        svg.append('g')
          .selectAll('dot')
          .data(expenseArray)
          .enter()
          .append('circle')
          .attr('cx', function(d, i) {
             return xScale(d.date);
           })
          .attr('cy', function(d) { return yScale(d.amount); })
          .attr('r', 3)
          .attr('transform', `translate(0, 0)`)  // translate has x axis and y axis
          .style('fill', function(d){ return myColor("expense") });

      // Draw the line - for expense
      svg
            .append('g')
            .append("path")
              .datum(expenseArray)
              .attr("d", d3.line()
                .x(function(d) { return xScale(d.date) })
                .y(function(d) { return yScale(d.amount) })
              )
              .attr("stroke", function(d){ return myColor("expense") })
              .style("stroke-width", 2)
              .style("fill", "none")

   // ---------- for income --------------
          // Draw the dots for income
           svg.append('g')
             .selectAll('dot')
             .data(incomeArray)
             .enter()
             .append('circle')
             .attr('cx', function(d, i) {
                return xScale(d.date);
              })
             .attr('cy', function(d) { return yScale(d.amount); })
             .attr('r', 3)
             .attr('transform', `translate(0, 0)`)  // translate has x axis and y axis
             .style('fill', function(d){ return myColor("income") });

         // Draw the line - for income
         svg
               .append('g')
               .append("path")
                 .datum(incomeArray)
                 .attr("d", d3.line()
                   .x(function(d) { return xScale(d.date) })
                   .y(function(d) { return yScale(d.amount) })
                 )
                 .attr("stroke", function(d){ return myColor("income") })
                 .style("stroke-width", 2)
                 .style("fill", "none")

   // ---------- for transfer --------------
             // Draw the dots for income
              svg.append('g')
                .selectAll('dot')
                .data(transferArray)
                .enter()
                .append('circle')
                .attr('cx', function(d, i) {
                   return xScale(d.date);
                 })
                .attr('cy', function(d) { return yScale(d.amount); })
                .attr('r', 3)
                .attr('transform', `translate(0, 0)`)  // translate has x axis and y axis
                .style('fill', function(d){ return myColor("transfer") });

            // Draw the line - for income
            svg
                  .append('g')
                  .append("path")
                    .datum(transferArray)
                    .attr("d", d3.line()
                      .x(function(d) { return xScale(d.date) })
                      .y(function(d) { return yScale(d.amount) })
                    )
                    .attr("stroke", function(d){ return myColor("transfer") })
                    .style("stroke-width", 2)
                    .style("fill", "none")

   // ---------- for investment --------------
                // Draw the dots for income
                 svg.append('g')
                   .selectAll('dot')
                   .data(investmentArray)
                   .enter()
                   .append('circle')
                   .attr('cx', function(d, i) {
                      return xScale(d.date);
                    })
                   .attr('cy', function(d) { return yScale(d.amount); })
                   .attr('r', 3)
                   .attr('transform', `translate(0, 0)`)  // translate has x axis and y axis
                   .style('fill', function(d){ return myColor("investment") });

               // Draw the line - for income
               svg
                     .append('g')
                     .append("path")
                       .datum(investmentArray)
                       .attr("d", d3.line()
                         .x(function(d) { return xScale(d.date) })
                         .y(function(d) { return yScale(d.amount) })
                       )
                       .attr("stroke", function(d){ return myColor("investment") })
                       .style("stroke-width", 2)
                       .style("fill", "none");
         }

   return <div id="summary-line-container" />;
}

export default ExpenseVsIncomeLineChart;

