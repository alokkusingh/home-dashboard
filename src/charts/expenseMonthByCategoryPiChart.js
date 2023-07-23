import React, { useEffect } from 'react'
import * as d3 from 'd3';
import { NumberFormatNoDecimal } from "../utils//NumberFormatNoDecimal";

function ExpenseMonthByCategoryPiChart({data, categories}) {

  var sum = 0;
  data.forEach(function(record) {
        sum += record.amount;
  });

   const outerRadius = 105;
   const innerRadius = 60;
   const margin = {
     top: 5, left: 20, bottom: 5, right: 20,
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
     //const categories = ["Bills", "Fuel", "Milk", "Maintenance", "Travel", "House Help", "Food Outside", "Accessories", "Grocery", "Education", "Medical", "Grooming", "Appliances", "Gift", "Entertainment", "Baby Care", "Furniture", "Other"];

      var myColorX = d3.scaleOrdinal()
              .domain(categories)
              .range(d3.schemeSet2);

      // https://reactnative.dev/docs/colors
      var myColor = [
        "palevioletred", "gold", "#69b3a2", "#F9CAC8",
        "yellow", "lightgrey", "orange", "lightblue",
        "tan", "#8884d8", "goldenrod", "bisque",
        "#82ca9d", "lightsalmon", "cadetblue", "burlywood",
        "darkgoldenrod", "lightcoral", "azure", "aliceblue",
        "steelblue", "greenyellow", "olive"
      ];

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
           .attr('x', width/2 - 130 )
           .attr('y', -130)
           .style('text-anchor', 'middle')
           .style('color', 'teal')
           .style('font-family', 'Helvetica')
           .style('font-size', 18)
           .text('This month expense by category')

        //append legends
        var legend = svg.append('g')
            .selectAll('g.legend')
            //.data(categories)
            .data(data.map(entry => entry.category))
            .enter()
            .append("g")
            .attr("class", "legend");

        legend.append("circle")
            .attr("cx", width - 107)
            .attr('cy', (d, i) => i * 14 - 55)
            .attr("r", 5)
            .style("fill", (d, i) => myColor[i]);

        legend.append("text")
            .attr("x", width - 87)
            .attr("y", (d, i) => i * 14 - 53)
             .attr("dx", "-.8em")
             .attr("dy", ".15em")
            .attr("text-anchor", "left")
            .style('font-family', 'Patrick Hand SC')
            .style('font-size', '.5em')
            .text(d => d)

     // Append arcs
     arc
       .append('path')
       .attr('d', arcGenerator)
       .style('fill', (d, i) => myColor[i])
       .style('stroke', '#ffffff')
       .style('stroke-width', 0);

     // Append text labels
     arc
       .append('text')
       .attr('text-anchor', 'middle')
       .attr('alignment-baseline', 'middle')
       //.text((d) => d.data.category + ' (' + d.data.amount + ')')
       .text((d) => d.data.amount)
       //.style('stroke', 'black')
       .style('font-size', '.8em')
       .style('font-family', "Patrick Hand SC")
       .attr('transform', (d) => {
         const [x, y] = arcGenerator.centroid(d);
         var rotation = d.endAngle < Math.PI ? (d.startAngle / 2 + d.endAngle / 2) * 180 / Math.PI : (d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180 / Math.PI;
         //return `translate(${x}, ${y})`;
         //return "translate(" + [x,y] + ")";
         return "translate(" + [x, y] + ") rotate(-90) rotate(" + rotation + ")";
       });
       //.attr("transform", "rotate(-65)");

     // Append total amount in center
      arc
         .append('svg:text')
         .attr('text-anchor', 'middle')
         .attr('alignment-baseline', 'middle')
         .text(NumberFormatNoDecimal(sum))
         .style('stroke', 'gray')
         .style('font-size', '10px')
         .style('font-family', "Courier New");
   }

   return <div id="pie-container" />;
 }

export default ExpenseMonthByCategoryPiChart;