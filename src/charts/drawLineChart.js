import React, { useEffect, useMemo } from 'react'
import { parseISO, format } from 'date-fns';
import * as d3 from 'd3';

function DrawLineChart({ data, divContainer, domain }) {

    let yearsBackFromNow = new Date();
    let today = new Date();
    let numberOfYears = 5;
    yearsBackFromNow.setFullYear(yearsBackFromNow.getFullYear() - numberOfYears);

    // 1. Memoize datasets to prevent unnecessary calculations and re-renders
    const { filteredData, maxAsOnValue, maxInvestmentAmount, contributionArray, investmentValueArray } = useMemo(() => {
        if (!data || data.length === 0) {
            return { filteredData: [], maxAsOnValue: 0, maxInvestmentAmount: 0, contributionArray: [], investmentValueArray: [] };
        }

        let fData = data.filter(function(record) {
            let date = parseISO(record.yearMonth);
            return date > yearsBackFromNow;
        });

        fData = fData.filter(function(record) {
            return record.asOnInvestment >= domain[0]; // Fixed index bug mapping boundary constraint
        });

        fData.sort((a,b) => {
            if (a.yearMonth < b.yearMonth) return -1;
            if (a.yearMonth > b.yearMonth) return 1;
            return 0;
        });

        let maxValue = 0;
        let maxInv = 0;
        const cArray = [];
        const iValArray = [];

        fData.forEach(function(record) {
            if (maxValue < record.asOnValue) maxValue = record.asOnValue;
            if (maxInv < record.asOnInvestment) maxInv = record.asOnInvestment;

            cArray.push({
                'yearMonth': parseISO(record.yearMonth),
                'amount': record.asOnInvestment
            });

            iValArray.push({
                'yearMonth': parseISO(record.yearMonth),
                'amount': record.asOnValue
            });
        });

        return {
            filteredData: fData,
            maxAsOnValue: maxValue,
            maxInvestmentAmount: maxInv,
            contributionArray: cArray,
            investmentValueArray: iValArray
        };
    }, [data, domain]);

    // Setup color definitions to explicitly match between D3 lines and the HTML Legend boxes
    const colorValue = "#66c2a5";
    const colorInvested = "#fc8d62";

    useEffect(() => {
        if (filteredData.length > 0) {
            drawChart();
        }
    }, [filteredData]);

    function drawChart() {
        const margin = { top: 10, right: 20, bottom: 50, left: 35 };
        const height = 280;
        const width = 1100;

        const outerWidth = width + margin.left + margin.right;
        const outerHeight = height + margin.top + margin.bottom;

        const numberOfYaxisTicks = 10;

        // Wipe old element nodes safely before rendering
        d3.select('#' + divContainer).select('svg').remove();

        const svg = d3
            .select('#' + divContainer)
            .append('svg')
            .attr('width', outerWidth)
            .attr('height', outerHeight)
            .style('background', 'white')
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const xScale = d3.scaleTime()
            .domain([yearsBackFromNow, today])
            .range([width, 0]);

        const yScale = d3.scaleLinear()
            .domain(domain)
            .range([height, 0]);

        const xAxis = d3
            .axisBottom(xScale)
            .ticks(d3.timeMonth, 2)
            .tickFormat(d3.timeFormat('%b %y'));

        const yAxis = d3
            .axisLeft(yScale)
            .tickFormat(function(d){ return d/100000 + 'L'; })
            .ticks(numberOfYaxisTicks);

        // Render X-Axis exactly clamped to the bottom of the grid lines
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .style('font-size', '11px')
            .style('fill', '#4a5568')
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        svg.append('g')
            .call(yAxis)
            .selectAll("text")
            .style('font-size', '11px')
            .style('fill', '#4a5568');

        // Removed old D3 legend injection logic entirely to let it live in the clean HTML view block below
        drawLineAndDots(colorValue, investmentValueArray);
        drawLineAndDots(colorInvested, contributionArray);

        drawHorizontalLines(numberOfYaxisTicks, 0.1);
        drawVerticalLines();

        function drawLineAndDots(colorHex, dataPoints) {
            svg.append('g')
                .selectAll('dot')
                .data(dataPoints)
                .enter()
                .append('circle')
                .attr('cx', function(d) { return xScale(d.yearMonth); })
                .attr('cy', function(d) { return yScale(d.amount); })
                .attr('r', 3)
                .style('fill', colorHex);

            svg.append('g')
                .append("path")
                .datum(dataPoints)
                .attr("d", d3.line()
                    .x(function(d) { return xScale(d.yearMonth) })
                    .y(function(d) { return yScale(d.amount) })
                )
                .attr("stroke", colorHex)
                .style("stroke-width", 2)
                .style("fill", "none");
        }

        function drawHorizontalLines(numberOfTicks, strokeWidth) {
            svg.append("g")
                .attr("class", "grid")
                .attr("stroke-width", strokeWidth)
                .attr("fill", "none")
                .call(d3.axisLeft(yScale)
                    .tickSize(-width)
                    .tickFormat("")
                    .ticks(numberOfTicks)
                );
        }

        function drawVerticalLines() {
            const verticalDataGridPoints = [];
            const xIncrBy = width / 5;
            for (var x = 0; x < width ; x = x + xIncrBy) {
                verticalDataGridPoints.push([
                    { 'x': x, 'y': height },
                    { 'x': x, 'y': 0 }
                ]);
            }
            verticalDataGridPoints.forEach(grid => drawGridLines(grid));
        }

        function drawGridLines(dataGrid) {
            svg.append('g')
                .append("path")
                .datum(dataGrid)
                .attr("d", d3.line()
                    .x(function(d) { return d.x })
                    .y(function(d) { return d.y })
                )
                .attr("stroke", '#e2e8f0')
                .style("stroke-width", 1)
                .style("stroke-dasharray", "3,3")
                .style("fill", "none");
        }
    }

    return (
        /* Negative margins neutralize the bulky inner whitespace added by the Materialize Card container */
        <div style={{ width: 'auto', background: 'transparent', margin: '15px -20px -20px -20px' }}>

            {/* Tight Left-Aligned Legend Box aligned with Y-axis offset line exactly */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '20px', marginBottom: '4px', paddingLeft: '25px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#4a5568', fontFamily: 'sans-serif' }}>
                    <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: colorValue, marginRight: '5px' }} />
                    <strong>Value:</strong>&nbsp;{parseFloat(maxAsOnValue/100000).toFixed(2)}L
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#4a5568', fontFamily: 'sans-serif' }}>
                    <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: colorInvested, marginRight: '5px' }} />
                    <strong>Invested:</strong>&nbsp;{parseFloat(maxInvestmentAmount/100000).toFixed(2)}L
                </div>
            </div>

            {/* Mobile Swipe Container Layer */}
            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <div id={divContainer} style={{ minWidth: '715px', paddingBottom: '0px', position: 'relative' }} />
            </div>
        </div>
    );
}

export default DrawLineChart;