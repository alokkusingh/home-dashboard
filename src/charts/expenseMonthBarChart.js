import React, {useEffect} from 'react'
import { parseISO } from 'date-fns';
import * as d3 from 'd3';


function ExpenseMonthBarChart({ data }) {

  // format the data
  var maxExpenseAmount = 0;
  var minDate = null, maxDate = null;
  var dataArr = [];
  data.forEach(function(record) {
      var date = parseISO(record.date);

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

  useEffect(() => {
      drawChart();
  }, [data]);

 function drawChart() {
      //const height = 220;
      //const width = 380;
      //const margin = { top: 0, right: 10, bottom: 80, left: 30 };
      var margin = {top: 0, right: 0, bottom: 0, left: 0},
          outerWidth = 350,
          outerHeight = 250,
          width = outerWidth - margin.left - margin.right,
          height = outerHeight - margin.top - margin.bottom;

      const colors = ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

      const numberOfYaxisTicks = 11;

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

      const getWeekDay = function(date) {
        return date.getDay();
      }


     // Remove the old svg
     d3.select('#month-exp-bar-container')
        .select('svg')
        .remove();

     // Create new svg
     const svg = d3
        .select('#month-exp-bar-container')
        .append('svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight)
        .style('background', 'white')
        .style('overflow', 'visible')
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     // Setting the scale
    const xScale = d3.scaleBand()
         //.domain(dataArr.map((record) => record.date))
         .domain(getDaysOfMonthDomain())
         .range([0, width])
         .padding(0.05);

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
      .text('This month expense by day')

      // X label - not needed
/*   svg.append('text')
      .attr('x', width/2 )
      .attr('y', height+40)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Helvetica')
      .style('font-size', 14)
      .text('-- Date -->');*/

      // Y label
//   svg.append('text')
//     .attr('text-anchor', 'middle')
//     .attr('transform', `translate(-45,100)rotate(-90)`) // translate has x axis and y axis
//     .style('font-family', 'Helvetica')
//     .style('font-size', 14)
//     .text('Expense (Rs)')

   //svg.append("text")
   /*   .attr("x", width/2 + 110)
      .attr("y", 15)
      .style("color", "grey")
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Total: " + sum);*/

      svg
        .append('g')
        .selectAll(".bar")
        .data(dataArr)
        .enter()
        .append("rect")
            .attr("class", "bar")
            .attr("fill", function(d) { return colorScale(d.amount); })
            .attr("fill", function(d) { return colors[getWeekDay(d.date)]; })
            .attr("x", function(d) { return xScale(parseD3Time(d.date)); })
            .attr("y", function(d) { return yScale(d.amount); })
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => yScale(0) - yScale(d.amount))
      svg
        .append('g')
        .selectAll("text")
        .data(dataArr)
        .enter()
        .append("text")
            .text(function(d) { return (d.amount / 1_000).toFixed(1); })
            .attr("x", function(d) { return xScale(parseD3Time(d.date)) + xScale.bandwidth() / 2; })
            .attr("y", function(d) { return yScale(d.amount) + 6; })
            .style("font-size", 6.5)
            .style("text-anchor", "middle")
            .style('fill', 'white')


   var legend = svg.append('g')
           .attr('class', 'legend')
           .attr('transform', 'translate(' + (20) + ',0)');

       legend.selectAll('rect')
           .data(days)
           .enter()
           .append('rect')
           .attr('x', width - 50)
           .attr('y', function(d, i){
               return (i * 12) + 6;
           })
           .attr('width', 6)
           .attr('height', 6)
           .attr('fill', function(d,i){
               return colors[i];
           });

       legend.selectAll('text')
           .data(days)
           .enter()
           .append('text')
           .text(function(d){
               return d;
           })
           .attr('x', width - 40)
           .attr('y', function(d, i){
               return (i * 12) + 6;
           })
           .style('font-family', 'Patrick Hand SC')
           .style('font-size', '.50em')
           .attr('text-anchor', 'start')
           .attr('alignment-baseline', 'hanging');

      //drawHorizontalLines(numberOfYaxisTicks/2, .2);
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

   return <div id="month-exp-bar-container" />;
}

export default ExpenseMonthBarChart;