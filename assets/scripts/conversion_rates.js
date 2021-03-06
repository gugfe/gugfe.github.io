"use strict";

/**
 * File allowing the creation of the conversion rates visualisations.
 */
function createConversionRates(channelData, countryData, sizeData, countrychannelData, countrysizeData, channelsizeData, dashboardWidth){

    // Concatenate the 3 dimensions into 1 for the charts
    var oneDimData = channelData.concat(countryData, sizeData)
    var twoDimData = countrychannelData.concat(countrysizeData, channelsizeData)

    twoDimData.sort(function(a, b) {
        var keyA = a.UB, keyB = b.UB;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
    twoDimData.sort(function(a, b) {
        var keyA = a.rate, keyB = b.rate;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      }).reverse();

    // Margins of the charts
    var margin = {top: 60, right: 20, bottom: 60, left: 30};
    var xMargin = 100;

    // Detailed category tag
    var detailedTag = "United States"

    // Dimensions of the charts
    var leftChartPct = 0.50
    var containerHeight = 350
    var leftChartWidth = (dashboardWidth - xMargin) * leftChartPct
    var rightChartWidth = (dashboardWidth - xMargin) * (1 - leftChartPct)

    // Choice of canvas
    var canvas = d3.selectAll('#canvasV1')

    var y_min = 0
    var y_max = 0.22
    var y = d3.scaleLinear()
        .domain([y_min, y_max])
        .range([containerHeight - margin.bottom, margin.top]);

    // Format function
    var formatPercent = d3.format(".1%")

    //Create conversRate container
    var conversRate = canvas.append('svg')
        .attr('width', dashboardWidth)
        .attr('height', containerHeight)

    // Creation of the svg for the confidence rate chart
    var confidenceRateChart = conversRate.append('svg')
        .attr('height', containerHeight)
        .attr('width', leftChartWidth)
        .attr('id', 'confidenceRateChart');

    // Creation of the svg for the detailed chart
    var detailedChart = conversRate.append('svg')
        .attr('x', leftChartWidth + xMargin)
        .attr('height', containerHeight)
        .attr('width', rightChartWidth)
        .attr('id', 'detailedChart');

    /*************************************************************************/
    /************************** Right chart *********************************/
    /*************************************************************************/

    // Create g elements that will need to be updated
    var g_xAxis = detailedChart.append('g')
    var g_nCount = detailedChart.append('g')
    var g_labels = detailedChart.append('g')
    var g_title = detailedChart.append("g")

    // Get a sub-array with only the elements with the detaileTag
    var newTwoDimData = filteredTwoDimData(twoDimData, detailedTag)
        
    // X Scale
    var x_D = d3.scaleBand()	   
        .domain(newTwoDimData.map(function(d) { return d.nameCat } ) )	    
        .range([margin.left, rightChartWidth - margin.right])

    // Add the count (n)
    g_nCount.selectAll("text")
        .data(newTwoDimData)
        .enter()
        .append("text")
        .text(function(d) {return "n = " + d.n;})
        .attr("x", function(d) {return x_D(d.nameCat)+ x_D.bandwidth()/2}) 
     //   .attr("y", function(d) { return (1 - d.UB/y_max) * (containerHeight - margin.bottom) - 6})
        .attr("y", function(d) { return y(d.UB) - 6})
        .attr("text-anchor", "middle")  
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "#333333");

    // Add labels
    g_labels.selectAll("text")
            .data(newTwoDimData)
            .enter()
            .append("text")
            .text(function(d) {return Math.round(d.rate * 1000)/10 + "%";})
            .attr("x", function(d) {return x_D(d.nameCat)+ x_D.bandwidth()/2 + 10}) 
            .attr("y", function(d) { return y(d.rate)} )
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("fill", "#333333")

    // Add the rectangles to show the confidence intervals
    detailedChart.selectAll("rect")
        .data(newTwoDimData)
        .enter()
        .append("rect")
        .attr("fill", function(d) {
            if (d.nameCat == 'United States' || d.nameCat == 'Canada' || d.nameCat == 'United Kingdom' || d.nameCat == 'Other Country') {
                return '#1053FF';
            } else if (d.nameCat == 'Website' || d.nameCat == 'Paid Search' || d.nameCat == 'Slack' || d.nameCat == 'Other Channel') {
                return '#FCC205';
            } else if (d.nameCat == 'Very Small' || d.nameCat == 'Small' || d.nameCat == 'Medium' || d.nameCat == 'Large') {
                return '#FF5971';
            } else {return "#333333"}})
        .attr("x", function(d) {return x_D(d.nameCat)+ x_D.bandwidth()/2 - 1})
      //  .attr("y", function(d) { return (1 - d.UB/y_max) * (containerHeight - margin.bottom) })
        .attr("y", function(d) { return y(d.UB)})
        .attr("width", 2)
      //  .attr("height", function(d) { return (d.UB - d.LB) / y_max * (containerHeight - margin.bottom) });
        .attr("height", function(d) { return y(d.LB) - y(d.UB) });

    // Add the circle to show the estimated conversion rates
    detailedChart.selectAll("circle")
        .data(newTwoDimData)
        .enter()
        .append("circle")
        .attr("cx", function(d) {return x_D(d.nameCat)+ x_D.bandwidth()/2})
        .attr("cy", function(d) { return y(d.rate) } )
        .attr("r", 7)
        .attr("fill", function(d) {
            if (d.nameCat == 'United States' || d.nameCat == 'Canada' || d.nameCat == 'United Kingdom' || d.nameCat == 'Other Country') {
                return '#1053FF';
            } else if (d.nameCat == 'Website' || d.nameCat == 'Paid Search' || d.nameCat == 'Slack' || d.nameCat == 'Other Channel') {
                return '#FCC205';
            } else if (d.nameCat == 'Very Small' || d.nameCat == 'Small' || d.nameCat == 'Medium' || d.nameCat == 'Large') {
                return '#FF5971';
            } else {return "#333333"}})
        .on("mouseover", function(d) {
            d3.select(this).transition().duration(100).attr('r',12)
            detailedChart.append("text")
            .attr("id", "tooltip")
            .attr("x", rightChartWidth) 
            .attr("y", 75) 
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text("Estimated rate = " + formatPercent(d.rate) + " / Bounds of the 80% CI: [" + formatPercent(d.LB) + " ; " + formatPercent(d.UB) + "]");
            })
        .on("mouseout", function() {
            d3.select("#tooltip").remove();
            d3.select(this).transition().duration(100).attr('r',7)
        });

    // Chart title
    g_title.append("text")
        .attr("x", (rightChartWidth / 2))             
        .attr("y", margin.top / 3)
        .attr("text-anchor", "middle")  
        .style("font-size", "13px") 
        .style("font-weight", "bold") 
        .text("Detailed view - " + detailedTag);

    // Axis
    // X Axis
    g_xAxis.attr("transform", "translate( 0," + (containerHeight - margin.bottom) + ")")
        .call(d3.axisBottom(x_D))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform","rotate(-30)");

    // Y Axis
    detailedChart.append('g')
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y));
    
    // Y Axis Title
    detailedChart.append("text")    
        .attr("x", 0)
        .attr("y", (6/8)*margin.top)
        .style("text-anchor", "start")
        .style("font-size", "10px")
        .style("font-style", "italic")
        .text("Conversion rate (%)");

    /*************************************************************************/
    /*************************** Left chart *********************************/
    /*************************************************************************/

    // X Scale
    var x_CR = d3.scaleBand()	   
        .domain(oneDimData.map(function(d) { return d.nameCat } ) )	    
        .range([margin.left, leftChartWidth-margin.right])
        //.paddingInner(1);
        
    // Add labels
    confidenceRateChart.selectAll("text")
        .data(oneDimData)
        .enter()
        .append("text")
        .text(function(d) {return Math.round(d.rate * 1000)/10 + "%";})
        .attr("x", function(d) {return x_CR(d.nameCat) + x_CR.bandwidth()/2 + 10})
        .attr("y", function(d) { return (1 - d.rate/y_max) * (containerHeight - margin.bottom)} )
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "#333333");

    // Add the rectangles to show the confidence intervals
    confidenceRateChart.selectAll("rect")
        .data(oneDimData)
        .enter()
        .append("rect")
        .attr('id', 'cRect')
        .attr("fill", function(d) {
            if (d.nameCat == 'United States' || d.nameCat == 'Canada' || d.nameCat == 'United Kingdom' || d.nameCat == 'Other Country') {
                return '#1053FF';
            } else if (d.nameCat == 'Website' || d.nameCat == 'Paid Search' || d.nameCat == 'Slack' || d.nameCat == 'Other Channel') {
                return '#FCC205';
            } else if (d.nameCat == 'Very Small' || d.nameCat == 'Small' || d.nameCat == 'Medium' || d.nameCat == 'Large') {
                return '#FF5971';
            } else {return "#333333"}})
        .attr("x", function(d) {return x_CR(d.nameCat)+x_CR.bandwidth()/2 -1})
        .attr("y", function(d) { return y(d.UB)})
        .attr("width", 2)
        .attr("height", function(d) { return y(d.LB) - y(d.UB) });

    // Add the circle to show the estimated conversion rates
    confidenceRateChart.selectAll("circle")
        .data(oneDimData)
        .enter()
        .append("circle")
        .attr("cx", function(d) {return x_CR(d.nameCat)+x_CR.bandwidth()/2})
        .attr("cy", function(d) { return y(d.rate) } )
        .attr("r", 7)
        .attr("fill", function(d) {
            if (d.nameCat == 'United States' || d.nameCat == 'Canada' || d.nameCat == 'United Kingdom' || d.nameCat == 'Other Country') {
                return '#1053FF';
            } else if (d.nameCat == 'Website' || d.nameCat == 'Paid Search' || d.nameCat == 'Slack' || d.nameCat == 'Other Channel') {
                return '#FCC205';
            } else if (d.nameCat == 'Very Small' || d.nameCat == 'Small' || d.nameCat == 'Medium' || d.nameCat == 'Large') {
                return '#FF5971';
            } else {return "#333333"}})
        .on("mouseover", function(d) {
            
            d3.select(this).transition().duration(100).attr('r',12)
            confidenceRateChart.append("text")
            .attr("id", "tooltip")
            .attr('class', 'd3-tip')
            .attr("x", leftChartWidth) 
            .attr("y", (3.5/10)*containerHeight) 
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text("Estimated rate = " + formatPercent(d.rate) + " / Bounds of the 80% CI: [" + formatPercent(d.LB) + " ; " + formatPercent(d.UB) + "]");
            })
        .on("mouseout", function() {
            d3.select("#tooltip").remove();
            d3.select(this).transition().duration(100).attr('r',7)
        })
        .on("click", function(d){
            detailedTag = d.nameCat
            updateDetailedChart(twoDimData, detailedTag, g_xAxis, g_title, detailedChart, g_labels, g_nCount, y_max, rightChartWidth, margin, containerHeight, y)
        });

    // Chart title
    confidenceRateChart.append("g")
        .append("text")
        .attr("x", (leftChartWidth / 2))             
        .attr("y", margin.top / 3)
        .attr("text-anchor", "middle")  
        .style("font-size", "13px") 
        .style("font-weight", "bold") 
        .text("Conversion rates and 80% confidence interval");

    // Axis
    // X Axis
    confidenceRateChart.append('g')
        .attr("transform", "translate( 0," + (containerHeight - margin.bottom) + ")")
        .call(d3.axisBottom(x_CR))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform","rotate(-30)");
    // Y Axis
    confidenceRateChart.append('g')
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y));
    
    // Y Axis Title
    confidenceRateChart.append("text")    
        .attr("x", 0)
        .attr("y", (6/8)*margin.top)
        .style("text-anchor", "start")
        .style("font-size", "10px")
        .style("font-style", "italic")
        .text("Conversion rate (%)");

    // Add legend
    var color_legend = ["#FCC205", "#1053FF", "#FF5971"];
    var text_legend = ["Acquisition channel", "Country", "Company size"];

    var legend = confidenceRateChart.append("g")
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (leftChartWidth - margin.left) + ', ' + ((1.5/10)*containerHeight) + ')');
    
    legend.selectAll('rect')
      .data(color_legend)
      .enter()
      .append('rect')
        .attr('x', 0)
        .attr('y', function(d, i){
            return i * 18;
        })
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', function(d, i){
            return color_legend[i];
        });
  
    legend.selectAll('text')
        .data(text_legend)
        .enter()
        .append('text')
            .attr('x', -5)
            .attr('y', function(d, i){
                return i * 18 + 3;
            })
            .text(function(d, i){
            return text_legend[i];
            })
            .attr('text-anchor', 'end')
            .attr('font-size', '10px')
            .attr('alignment-baseline', 'hanging');
}