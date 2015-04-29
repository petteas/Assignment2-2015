var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left","auto")
    .style("margin-right","auto")
    .style("display","block")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
console.log(parseDate("1-May-12"));
d3.json('/igMediaCounts', function(error, data) {
var data = [{date:parseDate("1-May-12"),close:12},{date:parseDate("30-Apr-12"),close:15},{date:parseDate("27-Apr-12"),close:5},{date:parseDate("26-Apr-12"),close:9},{date:parseDate("25-Apr-12"),close:19}];
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 1)
      .attr("dy", ".05em")
      .style("text-anchor", "end")
      .text("Number of posts on your feed");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  d3.select("#loader")
      .remove();
  d3.selectAll("svg").style("background","white");
});