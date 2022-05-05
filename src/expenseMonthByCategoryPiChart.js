import React, { useEffect } from 'react'
import * as d3 from 'd3';

function ExpenseMonthByCategoryPiChart({data}) {
   const outerRadius = 111;
   const innerRadius = 70;
   const margin = {
     top: 0, right: 50, bottom: 0, left: 50,
   };

   const width = 2 * outerRadius + margin.left + margin.right;
   const height = 2 * outerRadius + margin.top + margin.bottom;

   const colorScale = d3
     .scaleSequential()
     .interpolator(d3.interpolateCool)
     .domain([0, data.length]);

   useEffect(() => {
     drawChart();
   }, [data]);

   function drawChart() {
     const categories = ["Bills", "Fuel", "Milk", "Maintenance", "Travel", "House Help", "Food Outside", "Accessories", "Grocery", "Education", "Medical", "Grooming", "Appliances", "Gift", "Entertainment", "Baby Care", "Furniture", "Other"];

      var myColor = d3.scaleOrdinal()
              .domain(categories)
              .range(d3.schemeSet2);

     // Remove the old svg
     d3.select('#pie-container')
       .select('svg')
       .remove();

     // Create new svg
     const svg = d3
       .select('#pie-container')
       .append('svg')
       .attr('width', width)
       .attr('height', height)
       .style('background', 'white')
       .style('overflow', 'visible')
       .append('g')
       .attr('transform', `translate(${width / 2}, ${height / 2})`)

     const arcGenerator = d3
       .arc()
       .innerRadius(innerRadius)
       .outerRadius(outerRadius);

     const pieGenerator = d3
       .pie()
       .padAngle(0)
       .value((d) => d.amount);

     const arc = svg
       .selectAll()
       .data(pieGenerator(data))
       .enter();

     svg.append('text')
           .attr('x', width/2 - 150 )
           .attr('y', -130)
           .style('text-anchor', 'middle')
           .style('color', 'teal')
           .style('font-family', 'Helvetica')
           .style('font-size', 18)
           .text('This month expense by category')

        //append legends
        var legend = svg.append('g')
            .selectAll('g.legend')
            .data(categories)
            .enter()
            .append("g")
            .attr("class", "legend");

        legend.append("circle")
            .attr("cx", width - 150)
            .attr('cy', (d, i) => i * 14 - 90)
            .attr("r", 4)
            .style("fill", d => myColor(d));

        legend.append("text")
            .attr("x", width - 140)
            .attr("y", (d, i) => i * 14 - 88)
            .attr("text-anchor", "left")
            .text(d => d)
            .style('font-family', 'Helvetica')
            .style('font-size', 6)

     // Append arcs
     arc
       .append('path')
       .attr('d', arcGenerator)
       .style('fill', (d, i) => myColor(d.data.category))
       .style('stroke', '#ffffff')
       .style('stroke-width', 0);

     // Append text labels
     arc
       .append('text')
       .attr('text-anchor', 'middle')
       .attr('alignment-baseline', 'middle')
       //.text((d) => d.data.category + ' (' + d.data.amount + ')')
       .text((d) => d.data.amount)
       .style('stroke', 'teal')
       .style('font-size', '10px')
       .style('font-family', "Courier New")
       .attr('transform', (d) => {
         const [x, y] = arcGenerator.centroid(d);
         return `translate(${x}, ${y})`;
       });
   }

   return <div id="pie-container" />;
 }

export default ExpenseMonthByCategoryPiChart;