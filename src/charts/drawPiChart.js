import React, { useEffect } from 'react'
import * as d3 from 'd3';
import { NumberFormatNoDecimal } from "../utils/NumberFormatNoDecimal";
import { NumberFormatNoCurrency } from "../utils/NumberFormatNoCurrency";

function DrawPiChart({data, total, divContainer, heads}) {
   const outerRadius = 105;
   const innerRadius = 50;
   const margin = {
     top: 5, left: 20, bottom: 5, right: 20,
   };

   const width = 2 * outerRadius + margin.left + margin.right;
   const height = 2 * outerRadius + margin.top + margin.bottom;

   useEffect(() => {
     drawChart();
   });

   function drawChart() {

      var myColor = d3.scaleOrdinal()
              .domain(heads)
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

        //append legends
        var legend = svg.append('g')
            .selectAll('g.legend')
            .data(data.map(entry => entry.head))
            .enter()
            .append("g")
            .attr("class", "legend");

        legend.append("circle")
            .attr("cx", width - 115)
            .attr('cy', (d, i) => i * 14 + 23)
            .attr("r", 4)
            .style("fill", d => myColor(d));

        legend.append("text")
            .attr("x", width - 105)
            .attr("y", (d, i) => i * 14 + 25)
            .attr("text-anchor", "left")
            .text(d => d)
            .style('font-family', 'Patrick Hand SC')
            .style('font-size', '.5em')

     // Append arcs
     arc
       .append('path')
       .attr('d', arcGenerator)
       .style('fill', (d, i) => myColor(d.data.head))
       .style('stroke', '#ffffff')
       .style('stroke-width', 0);

     // Append text labels
     arc
       .append('text')
       .attr('text-anchor', 'middle')
       .attr('alignment-baseline', 'middle')
       .text((d) => NumberFormatNoCurrency(d.data.amount))
       //.style('stroke', 'teal')
       .style('font-size', '.8em')
        .style('font-family', "Patrick Hand SC")
        .attr('transform', (d) => {
          const [x, y] = arcGenerator.centroid(d);
          var rotation = d.endAngle < Math.PI ? (d.startAngle / 2 + d.endAngle / 2) * 180 / Math.PI : (d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180 / Math.PI;
          //return `translate(${x}, ${y})`;
          //return "translate(" + [x,y] + ")";
          return "translate(" + [x, y] + ") rotate(-90) rotate(" + rotation + ")";
        });

    // Append total amount in center
     arc
        .append('svg:text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text(NumberFormatNoDecimal(total))
        .style('stroke', 'gray')
        .style('font-size', '10px')
        .style('font-family', "Courier New");
   }

   return <div id={divContainer} />;
 }

export default DrawPiChart;