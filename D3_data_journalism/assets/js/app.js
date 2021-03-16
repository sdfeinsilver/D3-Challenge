// Goal: Use the D3 Library to create a scatter plot examining the relationship between poverty level and healthcare

// Set up Chart
let svgWidth = 800;
let svgHeight = 500;

// Margin for SVG graphics
let margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

let width = svgWidth - margin.left - margin.right -100;
let height = svgHeight - margin.top - margin.bottom;

// Create a SVG wrapper, append a SVG group that will hold our chart, and shift the SVG group by left and top margins
let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import CSV data using D3
d3.csv("assets/data/data.csv").then(function (healthData) {
    
    // Console.log to test that you have access to data
    console.log(healthData);
    
    // Foreach Loop to get data
    healthData.forEach(function(data) {
        // Parse necessary data and cast as numbers
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Create Scale Functions
    let xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.poverty)])
        .range([0, width]);
    
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);

    // Create Axis Functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles for Scatterplot
    let circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "CadetBlue")
    .attr("opacity", "1");
    
    // Put State Abbreviations inside Scatter Plot points
    let stateAbbr = chartGroup.selectAll(null)
        .data(healthData)
        .enter()
        .append('text');
    
    stateAbbr
        .attr('x', function (d) {
            return xLinearScale(d.poverty) - 7;
        })
        .attr('y', function(d) {
            return yLinearScale(d.healthcare) + 3;
        })
        .text(function (d) {
            return d.abbr;
        })
        .attr("class", "stateAbbrText")
        .attr("font-size", "10px")
        .attr("font-weight", "bold");

    // Create Axes Labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Healthcare Level")
        .attr("font-weight", "bold");
    
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty Level")
        .attr("font-weight", "bold"); 
}).catch(function(error) {
    console.log(error);
});
