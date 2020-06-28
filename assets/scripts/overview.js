
"use strict";
/**
 * Extract the data needed for the trial analysis
 *
 * @param clientList  Array of clients and their data
 * @param dashboardWidth   Dashboard width to keep the tab widths consistent
 * @param countryData Array of countries and related signups
 * @param sizeData Array of company size and related signups
 */
function createOverview(clientList, dashboardWidth, countryData, sizeData) {

    // Wrap function: https://jsfiddle.net/goldrydigital/qgc2g51x/
    function wrap(text, width) {
        text.each(function () {
            let text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                x = text.attr("x"),
                y = text.attr("y"),
                dy = 1.1,
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
    
    var containerWidth = dashboardWidth
    var containerHeight = 180
    var fraction = 5

    //Create overview container
    d3.select('div.overview').append('svg')
        .attr('width', containerWidth)
        .attr('height', containerHeight)
        .attr('id', 'overviewtext')
    var overview = d3.select('svg');

    //Create the svg containers for overview elements
    //TextOverview
    overview.append('svg') //signups
        .attr('height', (1 / 3) * containerHeight)
        .attr('width', 3 * containerWidth / fraction - 50)
        .attr('id', 'textoverview')

    //Signups
    overview.append('svg') //signups
        .attr('y', (1 / 3) * containerHeight)
        .attr('height', (2 / 3) * containerHeight)
        .attr('width', containerWidth / fraction)
        .attr('id', 'signups')

    //Trials
    overview.append('svg')
        .attr('x', containerWidth / fraction)
        .attr('y', (1 / 3) * containerHeight)
        .attr('height', (2 / 3) * containerHeight)
        .attr('width', containerWidth / fraction)
        .attr('id', 'trials')

    //Premiums
    overview.append('svg')
        .attr('x', 2 * containerWidth / fraction)
        .attr('y', (1 / 3) * containerHeight)
        .attr('height', (2 / 3) * containerHeight)
        .attr('width', containerWidth / fraction)
        .attr('id', 'premiums')

    // Networks by country
    overview.append('svg')
        .attr('x', 3 * containerWidth / fraction)
        .attr('height', (3 / 8) * containerHeight)
        .attr('width', 2 * containerWidth / fraction)
        .attr('id', 'netByCountry')

    //Networks by compagny
    overview.append('svg')
        .attr('x', 3 * containerWidth / fraction)
        .attr('y', (4 / 8) * containerHeight)
        .attr('height', (3 / 8) * containerHeight)
        .attr('width', 2 * containerWidth / fraction)
        .attr('id', 'netByCompany')

    var textoverview = d3.select('#textoverview')
    var signups = d3.select('#signups')
    var trials = d3.select('#trials')
    var premiums = d3.select('#premiums')
    var netByCountry = d3.select('#netByCountry')
    var netByCompany = d3.select('#netByCompany')

    // Text overview
    textoverview.append('text')
        .text('This dashboard presents information around networks conversion, using data from Jan to May 2020. The top section presents high-level statistics about networks and monthly activity, while the bottom section includes advanced analysis of different topics.')
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'start')
        .attr("dy", "0em")
        .attr('font-size', '12px')
        .attr('font-weight', 'normal')
        .call(wrap, 3 * containerWidth / fraction - 50)

    //Create monthly average text
    var containers = [signups, trials, premiums]
    containers.forEach(function (element) {
        element.append('text')
            .text('Monthly average')
            .attr('x', element.attr('width') / 2)
            .attr('y', containerHeight / 6 + 12)
            .attr('font-size', 10)
            .attr('font-weight', "normal")
            .attr('font-style', "italic")
    })

    // Calculate the extent of the data to determine monthly averages
    var dateMin = Date.parse(d3.min(clientList, d => d.creationDate))
    var dateMax = Date.parse(d3.max(clientList, d => d.creationDate))
    var oneMonth = 30 * 24 * 60 * 60 * 1000
    var deltaDate = (dateMax - dateMin) / oneMonth
    var formatComma = d3.format(",")

    // SIGNUPS
    signups.append('text')
        .text('SIGNUPS')
        .attr('x', signups.attr('width') / 2)
        .attr('y', containerHeight / 6)

    signups.append('text')
        .text(formatComma(Math.round(clientList.length / deltaDate)))
        .attr('fill', '#0000B1')
        .attr('x', signups.attr('width') / 2)
        .attr('y', containerHeight / 6 + 60)
        .attr('font-size', 50)

    // TRIALS
    trials.append('text')
        .text('TRIALS')
        .attr('x', trials.attr('width') / 2)
        .attr('y', containerHeight / 6)

    trials.append('text')
        .text(formatComma(Math.round(d3.sum(clientList, d => d.didTrial) / deltaDate)))
        .attr('fill', '#0000B1')
        .attr('x', trials.attr('width') / 2)
        .attr('y', containerHeight / 6 + 60)
        .attr('font-size', 50)

    // PREMIUMS
    premiums.append('text')
        .text('PREMIUMS')
        .attr('x', premiums.attr('width') / 2)
        .attr('y', containerHeight / 6)

    premiums.append('text')
        .text(formatComma(Math.round(d3.sum(clientList, d => d.isConverted) / deltaDate)))
        .attr('fill', '#0000B1')
        .attr('x', premiums.attr('width') / 2)
        .attr('y', containerHeight / 6 + 60)
        .attr('font-size', 50)

    // NETWORKS BY COUNTRY AND COMPANY SIZE 
    netByCountry.append('text')
        .text('Network signups by country')
        .attr('x', 0)
        .attr('y', 15)
        .attr("text-anchor", "start")
        .attr('font-size', 12)

    netByCompany.append('text')
        .text('Network signups by company size')
        .attr('x', 0)
        .attr('y', 15)
        .attr("text-anchor", "start")
        .attr('font-size', 12)
    // Call functions to create bar charts
    createBarChart(netByCompany, sizeData, '#333333', formatComma)
    createBarChart(netByCountry, countryData, '#333333', formatComma)
}
// Creates the graphicals elements of the overview bar charts
function createBarChart(container, data, graphColor, formatComma) {

    var margin = { top: 20, right: 30, bottom: 40, left: 90 };
    var axis_margin = 90

    var x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.n)])
        .range([0, 0.65 * container.attr('width')]);

    var y = d3.scaleBand()
        .range([20, container.attr('height')])
        .domain(data.map(d => d.nameCat))
        .padding(0.2)

    container.append("g")
        .call(d3.axisLeft(y))
        .attr("transform", "translate(" + axis_margin + "," + 0 + ")")
        .attr("font-weight", "normal")

    container.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0) + axis_margin)
        .attr("y", d => y(d.nameCat))
        .transition()
        .duration(800)
        .attr("width", d => x(d.n))
        .attr("height", y.bandwidth())
        .attr("fill", graphColor)

    // Adds the numbers at the end of the bars
    container.selectAll("rectText")
        .data(data)
        .enter()
        .append('text')
        .text(d => formatComma(d.n))
        .attr("x", d => x(0) + 100)
        .attr("y", d => y(d.nameCat) + y.bandwidth() - 2)
        .transition()
        .duration(800)
        .attr("x", d => x(d.n) + axis_margin + 8)
        .attr("y", d => y(d.nameCat) + y.bandwidth() - 2)

        .attr("font-size", 10)
        .attr("font-weight", "normal")
        .attr("text-anchor", "start")

}

