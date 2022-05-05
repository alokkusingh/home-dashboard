import React, {useEffect} from 'react'
import { format, parseISO } from 'date-fns';
import { NumberFormat } from "./NumberFormat";
import * as d3 from 'd3';
import { useD3 } from './hooks/useD3';


function ExpenseMonthBarChart({ data }) {

  // format the data
  var sum = 0;
  var maxExpenseAmount = 0, maxIncomeAmount = 0;
  var minDate = null, maxDate = null;
  var dataArr = [];
  data.forEach(function(record) {
      var date = parseISO(record.date);
      sum += record.amount;

      if (maxExpenseAmount < record.amount) {
          maxExpenseAmount = record.amount;
      }

      if (minDate == null || minDate > date) {
          minDate = date;
      }

      if (maxDate == null || maxDate < date) {
          maxDate = date;
      }

      dataArr.push({
        'date': date,
        'amount': record.amount
      });
  });

  console.log(minDate);
  console.log(maxDate);
  console.log(maxExpenseAmount);

  data.forEach( record => {
          console.log("Date: " + record.date);
      }
      );

  useEffect(() => {
      drawChart();
  }, [data]);

 function drawChart() {
      const height = 220;
      const width = 300;
      const margin = { top: 0, right: 10, bottom: 80, left: 30 };

      const colorScale = d3.scaleLinear()
        .domain([0,5000,10000])
        .range(['green', 'orange', 'red'])
        .clamp(true)

     // Remove the old svg
     d3.select('#month-exp-bar-container')
        .select('svg')
        .remove();

     // Create new svg
     const svg = d3
        .select('#month-exp-bar-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'white')
        .style('overflow', 'visible');

     // Setting the scale
    const xScale = d3.scaleBand()
         .domain(dataArr.map((record) => record.date))
         .range([width, 0])
         .padding(0.1);

    const yScale = d3.scaleLinear()
       .domain([0, maxExpenseAmount + 1000])
       .range([height, 0]);

    // Setting up the axis
    const xAxis = d3.axisBottom(xScale)
       .ticks(d3.timeDay, 1).tickFormat(d3.timeFormat('%d'))

    const yAxis = d3
       .axisLeft(yScale)
       .tickFormat(function(d){ return d/1000 + 'K'; })
       .ticks(10);

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
      .text('This month expense by day')

      // X label - not working
   svg.append('text')
      .attr('x', width/2 )
      .attr('y', height+40)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Helvetica')
      .style('font-size', 14)
      .text('-- Date -->');

      // Y label
   svg.append('text')
     .attr('text-anchor', 'middle')
     .attr('transform', `translate(-45,100)rotate(-90)`) // translate has x axis and y axis
     .style('font-family', 'Helvetica')
     .style('font-size', 14)
     .text('Expense (Rs)')

   svg.append("text")
      .attr("x", width/2 + 110)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Total: " + sum);

      svg
        .append('g')
        .selectAll(".bar")
        .data(dataArr)
        .enter()
        .append("rect")
            .attr("class", "bar")
            .attr("fill", function(d) { return colorScale(d.amount); })
            .attr("x", function(d) { return xScale(d.date); })
            .attr("y", function(d) { return yScale(d.amount); })
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => yScale(0) - yScale(d.amount))


    }

  return <div id="month-exp-bar-container" />;
}

export default ExpenseMonthBarChart;