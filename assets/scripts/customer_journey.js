"use strict";

//https://www.d3-graph-gallery.com/graph/stackedarea_basic.html

/**
 * File allowing the creation of the customer journey analysis visualisations.
 */
function createCustomerJourney(clientList, journeyData, dashboardWidth) {

    // Margins of the charts
    var margin = { top: 60, right: 20, bottom: 50, left: 30 };

    // Dimensions of the chart
    var containerWidth = dashboardWidth / 2;
    var containerHeight = 350;

    // Choice of canvas
    var canvas = d3.select('#canvasV3').append('svg')
        .attr('height', containerHeight)
        .attr('width', containerWidth * 2);

    // Creation of the left svg for the stacked area chart
    canvas.append('svg')
        .attr('height', containerHeight)
        .attr('width', containerWidth)
        .attr('id', 'clientStatusGraph');

    // Creation of the right svg for the stacked bars chart
    canvas.append('svg')
        .attr('height', containerHeight)
        .attr('width', containerWidth)
        .attr('x', containerWidth)
        .attr('id', 'stackedBars');

    // Variables to store the two charts
    var statusGraph = d3.select('#clientStatusGraph');
    var stackedBars = d3.select('#stackedBars');

    /********** Status Graph Code ***********/
    // Scales
    var x = d3.scaleLinear()
        .domain([0, journeyData.length - 1])
        .range([margin.left, containerWidth - margin.right]);

    var y = d3.scaleLinear()
        .domain([0, 0.20])
        .range([containerHeight - margin.bottom, margin.top]);

    // Axis
    var XAxis = statusGraph.append('g')
        .attr("transform", 'translate(0,' + (containerHeight - margin.bottom) + ')')
        .call(d3.axisBottom(x));

    var YAxis = statusGraph.append('g')
        .attr("transform", 'translate(' + margin.left + ', 0)')
        .call(d3.axisLeft(y));

    // Creation of the elements for the interactivity
    var focus = statusGraph.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

    focus.append("circle")
        .attr("r", 3)
        .attr('id', 'trialCircle');

    focus.append("circle")
        .attr("r", 3)
        .attr('id', 'premiumCircle');

    focus.append("rect")
        .attr("x", containerWidth - margin.right - 210)
        .attr("y", margin.top)
        .attr("height", 60)
        .attr("width", 205)
        .attr("fill", "#333333");

    focus.append("text")
        .attr("transform", "translate(" + (containerWidth - margin.right - 10) + "," + margin.top + ")")
        .attr("dy", "1em")
        .attr('text-anchor', 'end')
        .attr('id', 'freemiumText')
        .attr('fill', '#FFFFFF');

    focus.append("text")
        .attr("transform", "translate(" + (containerWidth - margin.right - 10) + "," + margin.top + ")")
        .attr("dy", "2em")
        .attr('id', 'trialText')
        .attr('text-anchor', 'end')
        .attr('fill', '#FFECAF');

    focus.append("text")
        .attr("transform", "translate(" + (containerWidth - margin.right - 10) + "," + margin.top + ")")
        .attr("dy", "3em")
        .attr('text-anchor', 'end')
        .attr('id', 'premiumText')
        .attr('fill', '#FCC205');

    focus.append("text")
        .attr("transform", "translate(" + (containerWidth - margin.right - 10) + "," + margin.top + ")")
        .attr("dy", "4em")
        .attr('text-anchor', 'end')
        .attr('id', 'dssText')
        .attr('fill', "#FFFFFF")
        .attr('font-style', 'italic');

    // Mouse interactivity coding
    var area = statusGraph.append('g')
        //  .attr("clip-path", "url(#clip)")
        .on('mouseover', function () { focus.style("display", null); })
        .on('mouseout', function () { focus.style("display", "none"); })
        .on('mousemove', function () {
            // Calculates an interpolated value between 2 days for placing the points
            var x0 = x.invert(d3.mouse(this)[0]);
            var x1 = Math.floor(x0);
            var y1T = journeyData[x1].trial_pct, y1P = journeyData[x1].premium_pct;
            var x2 = Math.ceil(x0);
            var y2T = journeyData[x2].trial_pct, y2P = journeyData[x2].premium_pct;
            // If statement to manage edge case when x0 tends towards 0
            if (x0 <= 0.000001) {
                var yPremium = 0;
                var yTrial = 0;
            } else {
                var yPremium = y1P + (x0 - x1) * (y2P - y1P) / (x2 - x1);
                var yTrial = yPremium + (y1T + (x0 - x1) * (y2T - y1T) / (x2 - x1));
            }

            focus.select('#trialCircle').attr("transform", "translate(" + x(x0) + "," + y(yTrial) + ")");
            focus.select('#premiumCircle').attr("transform", "translate(" + x(x0) + "," + y(yPremium) + ")");
            focus.select('#freemiumText').text(function () {

                var percent = parseFloat(100 * (1 - yPremium - yTrial)).toFixed(1) + " %";
                return 'Freemium: ' + percent;
            })

            focus.select('#trialText').text(function () {
                var percent = parseFloat(100 * (yTrial - yPremium)).toFixed(1) + " %";
                return 'Trial: ' + percent;
            })

            focus.select('#premiumText').text(function () {
                var percent = parseFloat(100 * yPremium).toFixed(1) + " %";
                return 'Premium: ' + percent;
            })

            focus.select('#dssText').text(function () {
                var dss = Math.round(x0);
                return 'Days since signup: ' + dss;
            })
        });

    // Creation of the areas 
    var initArea = d3.area()
        .x(d => x(journeyData.indexOf(d)))
        .y0(y(0))
        .y1(d => y(0));

    // Premium area
    var areaGenerator = d3.area()
        .x(d => x(journeyData.indexOf(d)))
        .y0(y(0))
        .y1(d => y(d.premium_pct));

    // Trial area
    var areaGenerator2 = d3.area()
        .x(d => x(journeyData.indexOf(d)))
        .y0(y(0))
        .y1(d => y(d.trial_pct + d.premium_pct));

    // Freemium area    
    var areaGenerator3 = d3.area()
        .x(d => x(journeyData.indexOf(d)))
        .y0(y(0))
        .y1(d => y(d.freemium_pct + d.trial_pct + d.premium_pct));

    // Display the 3 areas
    displayArea(journeyData, areaGenerator3, area, "white", initArea);
    displayArea(journeyData, areaGenerator2, area, "#FFECAF", initArea);
    displayArea(journeyData, areaGenerator, area, "#FCC205", initArea);
    focus.raise();

    // Axis labels and titles for the graph status graph
    // X axis
    statusGraph.append("text")
        .attr("x", containerWidth - margin.right)
        .attr("y", containerHeight - margin.bottom + 25)
        .style("text-anchor", "end")
        .style("font-size", "10px")
        .style("font-style", "italic")
        .text("# of days since signup");

    // Y Axis 
    statusGraph.append("text")
        .attr("x", 0)
        .attr("y", (6 / 8) * margin.top)
        .style("text-anchor", "start")
        .style("font-size", "10px")
        .style("font-style", "italic")
        .text("% of networks in each segment");

    // Title of the graph
    statusGraph.append("text")
        .attr("x", containerWidth / 2)
        .attr("y", (1 / 3) * margin.top)
        .style("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "bold")
        .text("% of networks in each segment by days since signup");

    /********** Stacked Bar Graph Code ***********/
    /* Here is the decision tree used to determine how to process clients
       for the stacked bars graph. Associated keys are displayed in
       journey path array.

        .
        ├── Trial
        │   ├── Not Converted
        │   │   ├── Trial Start Date == Signup Date
        │   │   │   └── Trial -> Freemium
        │   │   └── Trial Start Date !== Signup Date
        │   │       └── Freemium -> Trial -> Freemium
        │   └── Converted
        │       ├── Trial Start Date == Signup Date
        │       │   └── Trial -> Premium
        │       └── Trial Start Date !== Signup Date
        └── No Trial
            ├── Not Converted
            │   └── 
            │       └── Freemium
            └── Converted
                ├── Signup Date !== Premium Start Date
                │   └── Freemium -> Premium
                └── Signup Date == Premium Start Date
                    └── Premium
    */
    // journeyPaths shows each path that needs to be studied
    var journeyPaths = [
        [['Freemium'], [0, 0, 0]],
        [['Trial', 'Freemium'], [1, 0, 1]],
        [['Freemium', 'Trial', 'Freemium'], [1, 0, 0]],
        [['Freemium', 'Trial', 'Premium'], [1, 1, 0]],
        [['Trial', 'Premium'], [1, 1, 1]],
        [['Freemium', 'Premium'], [0, 1, 0]],
        [['Premium'], [0, 1, 1]]
    ];

    // 1 array element in journeySplits represents on bar in the bar graph 
    var journeySplits = [];
    journeyPaths.forEach((path, i) => journeySplits.push(getTypicalCustomerJourney(clientList, journeyPaths[i], journeyData.length)));

    // Create the stacked bar chart
    createStackedBarChart(stackedBars, journeySplits, journeyData.length);

    // Stacked bar chart title
    stackedBars.append("text")
        .attr("x", stackedBars.attr('width') / 2 + 50)
        .attr("y", (1 / 3) * margin.top)
        .style("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "bold")
        .text("Customer journeys over the first " + journeyData.length + ' days');
        
    // Add color legend
        var legendColors = [['Freemium','#333333'], ['Trial','#FFECAF'], ['Premium','#FCC205']]
    stackedBars.selectAll('textLegend')
        .data(legendColors)
        .enter()
        .append('text')
        .text(d => d[0])
        .attr('y', function(d,i) {return i * 12 + 10})
        .attr('x', 20)
        .attr('font-size', '13px')
    stackedBars.selectAll('rectLegend')
        .data(legendColors)
        .enter()
        .append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('y', function(d,i) {return i * 12})
        .attr('x', 5)
        .attr('fill', d => d[1])
}
/**
 * This function incorporates the decision tree in order to generate the data for the stacked bar chart
 * @param clientList Array of client information
 * @param journeyPath Array of client distribution over time
 * @param days Number of days in the journey (typically 90 days)
 */
function getTypicalCustomerJourney(clientList, journeyPath, days) {
    var dateList = [];
    var key = journeyPath[1];
    clientList.forEach(function (client) {

        // The "if" logic for the decision tree
        if (key[0] && client.didTrial === '1') {
            if (key[1] && client.isConverted === '1') {
                if (key[2] && client.trialStartDay === '0' && client.conversionDay < days) {
                    dateList.push([client.conversionDay]);
                } else if (!key[2] && client.trialStartDay !== '0' && client.trialEndDay < days) {
                    dateList.push([client.trialStartDay, client.conversionDay - client.trialStartDay]);
                }
            } else if (!key[1] && client.isConverted === '0') {
                if (key[2] && client.trialStartDay === '0' && client.trialEndDay < days) {
                    dateList.push([client.trialEndDay]);
                } else if (!key[2] && client.trialStartDay !== '0' && client.trialEndDay < days) {
                    dateList.push([client.trialStartDay, client.trialEndDay - client.trialStartDay]);
                }
            }
        } else if (!key[0] && client.didTrial === '0') {
            if (key[1] && client.isConverted === '1') {
                if (key[2] && client.conversionDay === '0') {
                    dateList.push([]);
                } else if (!key[2] && client.trialStartDay !== '0' && client.conversionDay < days) {
                    dateList.push([client.conversionDay]);
                }
            } else if (!key[1] && client.isConverted === '0') {
                if (!key[2]) {
                    dateList.push([]);
                }
            }
        }
    })
    var averageDate = []
    // Generate the averages days based on each possible scenario
    if (dateList[0].length == 0) {
        var averageDate = [0, days];
    } else if (dateList[0].length == 1) {
        var averageDate = [0, d3.mean(dateList.map(x => x[0])), days];
    } else {
        var averageDate = [0, d3.mean(dateList.map(x => x[0])), d3.mean(dateList.map(x => x[1])), days];
    }
    var journeyPercent = dateList.length / clientList.length;
    var barElement = {
        dates: averageDate,
        percent: journeyPercent,
        name: journeyPath[0]
    };
    return barElement;
}

/**
 * This function creates the displayed area on the status graph
 */
function displayArea(journeyData, areaGen, area, color, initArea) {
    area.append("path")
        .data([journeyData])
        .attr("class", "premiumArea")
        .attr("fill", color)
        .attr("fill-opacity", 1)
        .attr('d', initArea)
        .transition()
        .duration(800)
        .attr("d", areaGen);
}

/**
 * These 2 functions handle the display
 */
function handleMouseOver(d, i) {
    focus.style('display', null);
}
function handleMouseOut(d, i) {
    focus.style('display', 'none');
}
/**
 * This function creates the graphical elements of the stacked bar chart
 */
function createStackedBarChart(container, data, days) {

    var margin = { top: 20, right: 30, bottom: 20, left: 160 };
    var color = d3.scaleOrdinal()
        .domain(['Freemium', 'Trial', 'Premium'])
        .range(['#333333', '#FFECAF', '#FCC205']);
    var x = d3.scaleLinear()
        .domain([0, days])
        .range([0, 0.65 * container.attr('width')]);

    var y = d3.scaleBand()
        .range([20, container.attr('height') - margin.bottom])
        .domain(data.map(d => d.name))
        .padding(0.3);

    container.append("g")
        .call(d3.axisLeft(y))
        .attr("transform", "translate(" + (margin.left - 1) + "," + 0 + ")")
        .attr("font-weight", "normal");

    // Loops through the three possible segments of the stacked bar chart to draw then
    for (var i = 0; i < 3; i++) {
        // Create the rectangles in the stacked bars
        container.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect")
            .attr("transform", "translate(" + margin.left + "," + 0 + ")")
            .attr("y", d => y(d.name))
            .attr("height", y.bandwidth())
            .attr("fill", d => color(d.name[i]))
            .attr("x", function (d) {
                if (d.dates.length - 2 >= i) {
                    return x(d.dates[i]);
                }
            })
            .attr('width', function (d) {
                if (d.dates.length - 2 >= i) {
                    return x(d.dates[i + 1] - d.dates[i]);
                }
            });

        // Create the text labels inside the stacked bars
        container.selectAll("rectText")
            .data(data)
            .enter()
            .append('text')
            .text(function (d) {
                if (!isNaN(d.dates[i + 1])) {
                    return Math.round(d.dates[i + 1] - d.dates[i]);
                }
            })
            .attr('x', function (d) {
                if (!isNaN(d.dates[i + 1])) {
                    return x(d.dates[i] + (d.dates[i + 1] - d.dates[i]) / 2);
                }
            })
            .attr('y', d => y(d.name) + y.bandwidth() / 1.7)
            .attr("transform", "translate(" + margin.left + "," + 0 + ")")
            .attr('fill', function (d) {
                if (d.name[i] == 'Freemium') {
                    return ('white')
                } else {
                    return 'black'
                }
            })
            .attr('text-anchor', 'middle')
            .attr('font-size', 10);
    }

    // Create the percent values to the right of the chart
    container.selectAll('myPercent')
        .data(data)
        .enter()
        .append('text')
        .text(d => parseFloat(100 * (d.percent)).toFixed(1) + '%')
        .attr('x', x(days) + 5)
        .attr('y', d => y(d.name) + y.bandwidth() / 1.7)
        .attr("transform", "translate(" + margin.left + "," + 0 + ")")
        .attr("font-size", 10);
}
