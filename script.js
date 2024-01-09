document.addEventListener('DOMContentLoaded', function() {
    const h = 500; // SVG height
    const w = 1000; // SVG width
    const padding = 60;
   
    //fetch dataset from API
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(response => response.json())
      .then(data => {
      const dataset = data["data"];
      const parseTime = d3.timeParse("%Y-%m-%d"); //parse date string in JSON date object
      const formatDate = d3.timeFormat("%Y-%m-%d"); //format JSON date object into YYYY-MM-DD string
      
      //loop for converting date strings to JSON Date object
      dataset.forEach((d) => {
        d[0] = parseTime(d[0]); //assign them back to dataset
      });
      
      const xScale = d3.scaleTime()
                       .domain(d3.extent(dataset, d => d[0]))
                       .range([padding, w - padding]);
      
      const yScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset, (d, i) => d[1])])
                       .range([h - padding, padding]);
     
      //SVG canvas
      const svg = d3.select("body")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("id", "chart");
      
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
  
      svg.append("g")
         .attr("transform", "translate(0, " + (h - padding) + ")")
         .attr("id", "x-axis")
         .call(xAxis);
  
      svg.append("g")
         .attr("transform", "translate(" + padding + ", 0)")
         .attr("id", "y-axis")
         .call(yAxis);    
      
      //Data bars
      const bars = svg.selectAll("rect")
                       .data(dataset)
                       .enter()
                       .append("rect")
                       .attr("x", d => xScale(d[0]))
                       .attr("y", d => yScale(d[1]))
                       .attr("width", (w - 2 * padding) / dataset.length) //equal space for each data point
                       .attr("height", d => h - padding - yScale(d[1]))
                       .attr("fill", "steelblue")
                       .attr("data-date", d => formatDate(d[0])) //actual date
                       .attr("data-gdp", d => d[1]) //actual gdp
                       .attr("class", "bar");
      
        const tooltip = d3.select("#chart")
          .append("div")
          .attr("class", "tooltip")
          .attr("id", "tooltip")
          .style("display", "none");
  
        // Mouse move function
        svg.selectAll("rect")
           .on("mouseover", function(event, d) {
              const xPos = xScale(d[0]);
              const yPos = yScale(d[1]);
  
              tooltip
                .attr("data-date", formatDate(d[0]))
                .style("display", "block")
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 50}px`)
                .html(`<strong>Date:</strong> ${formatDate(d[0])}<br><strong>GDP: $</strong> ${d[1]} Billion`);
           })
           .on("mouseout", function() {
              tooltip.style("display", "none");
           });    
    });
  });