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

  useEffect(() => {
      drawChart();
  }, [data]);

 function drawChart() {
      const height = 220;
      const width = 300;
      const margin = { top: 0, right: 10, bottom: 80, left: 30 };

      const colorScale = d3.scaleLinear()
        .domain([0,5000,15000])
        .range(['green', 'orange', 'red'])
        .clamp(true)


      const parseD3Time = d3.timeFormat('%d')

      const getDaysOfMonthDomain = function() {
            const today = new Date();
            const month = d3.timeDay(today).getMonth();
            const year = d3.timeDay(today).getFullYear();
            const numberOfDays = getNumberOfDaysInMonth(today);

            const days = [];

            for (let day = 1; day <= numberOfDays; day++) {
               days.push(parseD3Time(new Date(year, month, day)));
            }

            console.log("days: " + days)

            return days;
      }

      const getNumberOfDaysInMonth = function(date) {
        const month = d3.timeDay(date).getMonth() + 1;

        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            return 31;
        }

        if (month === 4 || month === 6 || month === 9 || month === 11) {
            return 30;
        }

        const year = d3.timeDay(date).getFullYear();

        if (year % 4 === 0) {
            return 29;
        }

        return 28;
      }


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
         //.domain(dataArr.map((record) => record.date))
         .domain(getDaysOfMonthDomain())
         .range([0, width])
         .padding(0.1);

    const yScale = d3.scaleLinear()
       .domain([0, maxExpenseAmount + 1000])
       .range([height, 0]);

    // Setting up the axis
    const xAxis = d3.axisBottom(xScale)
       //.ticks(d3.timeDay, 1).tickFormat(d3.timeFormat('%d'))
       .ticks(d3.timeDay, 1)

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
            .attr("x", function(d) { return xScale(parseD3Time(d.date)); })
            .attr("y", function(d) { return yScale(d.amount); })
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => yScale(0) - yScale(d.amount))

      console.log("timeMonth: " + getDaysOfMonthDomain);
    }

  return <div id="month-exp-bar-container" />;
}

export default ExpenseMonthBarChart;