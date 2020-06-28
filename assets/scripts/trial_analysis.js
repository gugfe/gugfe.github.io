"use strict";

/**
 * File allowing the creation of the trial analysis visualisations.
 */
function createTrialAnalysis (trialData, countryData, dashboardWidth){

  // Margins of the charts
  var margin = {top: 80, right: 30, bottom: 40, left: 30};

  // Dimensions of the chart
  var containerHeight = 400 ;
  var fullcontainerWidth = dashboardWidth - margin.left - margin.right
  var smallcontainerWidth = (1/4)*fullcontainerWidth;
  var bigcontainerWidth = (3/4)*fullcontainerWidth;

  // Choice of canvas
  var canvas = d3.select('#canvasV2');

  // Create containers
  // general container
  var container = canvas.append('svg')
    .attr('height', containerHeight)
    .attr('width', fullcontainerWidth)
    .attr('id', 'container');
  container.append('foreignObject')
    .attr('x',container.attr('width'))
    .attr('height',100)
    .append("xhtml:body")
    .html('<div style="width: 150px;">test</div>')

  // globalConv
  container.append('svg')
    .attr('height', containerHeight/2)
    .attr('width', smallcontainerWidth)
    .attr('id', 'globalConv');
  var globalConv = d3.select('#globalConv');

  // trialConv
  container.append('svg')
    .attr('height', containerHeight/2)
    .attr('width', smallcontainerWidth)
    .attr('y', containerHeight/2)
    .attr('id', 'trialConv');
  var trialConv = d3.select('#trialConv');

   // trialGraph
  container.append('svg')
    .attr('height', containerHeight)
    .attr('width', bigcontainerWidth)
    .attr('x', smallcontainerWidth)
    .attr('id', 'trialGraph')
  var trialGraph = d3.select('#trialGraph'); 

  // Fill containers
  var globalConvPct = d3.sum(countryData, d => d.c)/d3.sum(countryData, d => d.n);
  var trialConvPct = d3.sum(trialData, d => d.c)/d3.sum(trialData, d => d.n);

  // globalConv
  globalConv.append('text')
    .attr('x', smallcontainerWidth/2)
    .attr('y', globalConv.attr('height')/2)
    .style("text-anchor", "middle")
    .attr('font-size', 12)
    .style("font-weight", "bold")
    .text('Global conversion rate');

  globalConv.append('text')
    .attr('x', smallcontainerWidth/2)
    .attr('y', globalConv.attr('height')/2 + 10)
    .style("text-anchor", "middle")
    .attr('font-size', 45)
    .attr('fill', '#FF5971')
    .style("font-weight", "bold")
    .attr('dy', '1em')
    .text(parseFloat(100*globalConvPct).toFixed(1)+"%")

  // trialConv
  trialConv.append('text')
    .attr('x', smallcontainerWidth/2)
    .attr('y', (1/4)*trialConv.attr('height'))
    .style("text-anchor", "middle")
    .attr('font-size', 12)
    .style("font-weight", "bold")
    .text('Trial conversion rate');

  trialConv.append('text')
    .attr('x', smallcontainerWidth/2)
    .attr('y', (1/4)*trialConv.attr('height') + 10)
    .style("text-anchor", "middle")
    .attr('font-size', 45)
    .attr('fill', '#FF5971')
    .style("font-weight", "bold")
    .attr('dy', '1em')
    .text(parseFloat(100*trialConvPct).toFixed(1)+"%")

   // trialGraph

   // Create axis
   var formatPercent = d3.format(".0%");

    var x = d3.scaleBand()
      .domain(trialData.map(d => d.nameCat))
      .range([margin.left, bigcontainerWidth - margin.right])
      .padding(0.1)

    var y = d3.scaleLinear()
      .domain([0, d3.max(trialData, d => d.n > d.c ? d.n : d.c)])
      .range([containerHeight - margin.bottom, margin.top]);
      
    var y2 = d3.scaleLinear()
      .domain([0, d3.max(trialData, d => d.rate)])
      .range([containerHeight - margin.bottom, margin.top]);

    var xAxis = trialGraph.append('g')
      .attr("transform", `translate(0, ${containerHeight - margin.bottom})`)
      .call(d3.axisBottom(x));

    var yAxisLeft = trialGraph.append('g')
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    // Add axis label and title for the graph 
    // X axis
    trialGraph.append("text")    
      .attr("x", bigcontainerWidth - margin.right)
      .attr("y", containerHeight - (1/6)*margin.bottom)
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .style("font-style", "italic")
      .text("# of days between the signup and the start of the trial");

    // Y Left Axis 
    trialGraph.append("text")    
      .attr("x", 0)
      .attr("y", (7/8)*margin.top)
      .style("text-anchor", "start")
      .style("font-size", "10px")
      .style("font-style", "italic")
      .text("# of networks");

    // Title of the graph
    trialGraph.append("text")    
      .attr("x", bigcontainerWidth/2)
      .attr("y", (1/3)*margin.top)
      .style("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .text("Conversion analysis of networks who experienced the trial");

    // Create bars, dot and line in the graph 
    trialGraph.selectAll(".bar.n")
      .data(trialData)
      .enter()
      .append("rect")
      .attr("class", "bar n")
        .attr("x", d => x(d.nameCat) + x.bandwidth()/6 - 2)
        .attr("y", d => y(d.n))
        .attr("width", x.bandwidth()/3)
        .attr("height", d => containerHeight - margin.bottom - y(d.n))
        .style("fill", "#E7E7E7")
    
    trialGraph.selectAll(".bar.c")
      .data(trialData)
      .enter()
      .append("rect")
      .attr("class", "bar c")
        .attr("x", d => x(d.nameCat) + x.bandwidth()/2 + 2)
        .attr("y", d => y(d.c))
        .attr("width", x.bandwidth()/3)
        .attr("height", d => containerHeight - margin.bottom - y(d.c))
        .style("fill", "#333333") 

    trialGraph.append("path")
      .datum(trialData)
        .attr("fill", "none")
        .attr("stroke", "#FF5971")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(d => x(d.nameCat) + x.bandwidth()/2)
          .y(d => y2(d.rate)))

    trialGraph.append("g")
      .selectAll("dot")
      .data(trialData)
      .enter()
      .append("circle")
        .attr("cx", d => x(d.nameCat) + x.bandwidth()/2)
        .attr("cy", d => y2(d.rate))
        .attr("r", 4)
        .attr("fill", "#FF5971")

    trialGraph.append("g")
      .selectAll("text")
      .data(trialData)
      .enter()
      .append("text")
        .text(d => parseFloat(100*(d.rate)).toFixed(1) + "%")
        .attr("x", d => x(d.nameCat) + x.bandwidth()/2 + 5)
        .attr("y", d => y2(d.rate) - 10) 
        .style("text-anchor", "middle")
        .attr('font-size', 10)
        .attr('fill', '#FF5971')
        .style("font-weight", "bold")

    // Add legend
    var color_legend = ["#E7E7E7", "#333333", "#FF5971"];
    var text_legend = ["# of trials", "# of conversions from trial", "Conversion rate (%)"];

    var legend = trialGraph.append("g")
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (bigcontainerWidth - margin.left) + ', ' + ((6/10)*containerHeight) + ')');
    
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