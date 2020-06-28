/**
 * Function allowing the update of the right chart in the conversion rates tab.
 */
function updateDetailedChart(twoDimData, detailedTag, g_xAxis, g_title, detailedChart, g_labels, g_nCount, y_max, rightChartWidth, margin, containerHeight, yScale){

    // Format function
    var formatPercent = d3.format(".1%")

    // Get a sub-array with only the elements with the detaileTag
    var newTwoDimData = filteredTwoDimData(twoDimData, detailedTag)
    for (var i=0; i < newTwoDimData.length; i++ ){
    }
    // Set default values for transition
        var t = d3.transition()
            .duration(700);

    // Chart title
    g_title.selectAll("text")
        .attr("x", (rightChartWidth / 2))             
        .attr("y", margin.top / 3)
        .attr("text-anchor", "middle")  
        .style("font-size", "13px") 
        .style("font-weight", "bold") 
        .text("Detailed view - " + detailedTag);

    // X Scale
    var x_D = d3.scaleBand()	   
        .domain(newTwoDimData.map(function(d) { return d.nameCat } ) )	    
        .range([margin.left, rightChartWidth-margin.right]);

    g_xAxis.attr("transform", "translate( 0," + containerHeight + ")")
        .transition(t)
        .call(d3.axisBottom(x_D))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform","rotate(-30)");

    g_nCount.selectAll("text")
        .data(newTwoDimData)
        .transition(t)
        .text(function(d) {return "n = " + d.n;})
        .attr("x", function(d) {return x_D(d.nameCat) + x_D.bandwidth()/2}) 
        .attr("y", function(d) { return yScale(d.UB) - 6})
        .attr("text-anchor", "middle")  
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "#333333");

    // Update the labels
    g_labels.selectAll("text")
            .data(newTwoDimData)
            .transition(t)
            .text(function(d) {return Math.round(d.rate * 1000)/10 + "%";})
            .attr("x", function(d) {return x_D(d.nameCat)+ x_D.bandwidth()/2 + 15}) 
            .attr("y", function(d) { return yScale(d.rate)} )
            .attr("font-family", "sans-serif")
            .attr("font-size", "12px")
            .attr("fill", "#333333")

    // Update the circles
    detailedChart.selectAll("circle")
        .data(newTwoDimData)
        .transition(t)
        .attr("cx", function(d) {return x_D(d.nameCat) + x_D.bandwidth()/2})
        .attr("cy", function(d) { return yScale(d.rate) } )
        .attr("fill", function(d) {
            if (d.nameCat == 'United States' || d.nameCat == 'Canada' || d.nameCat == 'United Kingdom' || d.nameCat == 'Other Country') {
                return '#1053FF';
            } else if (d.nameCat == 'Website' || d.nameCat == 'Paid Search' || d.nameCat == 'Slack' || d.nameCat == 'Other Channel') {
                return '#FCC205';
            } else if (d.nameCat == 'Very Small' || d.nameCat == 'Small' || d.nameCat == 'Medium' || d.nameCat == 'Large') {
                return '#FF5971';
            } else {return "#333333"}})

    // Update the rectangles to show the confidence intervals
    detailedChart.selectAll("rect")
        .data(newTwoDimData)
        .transition(t)
        .attr("fill", function(d) {
            if (d.nameCat == 'United States' || d.nameCat == 'Canada' || d.nameCat == 'United Kingdom' || d.nameCat == 'Other Country') {
                return '#1053FF';
            } else if (d.nameCat == 'Website' || d.nameCat == 'Paid Search' || d.nameCat == 'Slack' || d.nameCat == 'Other Channel') {
                return '#FCC205';
            } else if (d.nameCat == 'Very Small' || d.nameCat == 'Small' || d.nameCat == 'Medium' || d.nameCat == 'Large') {
                return '#FF5971';
            } else {return "#333333"}})
        .attr("x", function(d) {return x_D(d.nameCat) + x_D.bandwidth()/2 - 1})
        .attr("y", function(d) { return yScale(d.UB) })
        .attr("width", 2)
        .attr("height", function(d) { return yScale(d.LB) - yScale(d.UB) });



}
