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
d3.json('/igUserFeed', function(error, data) {

    var dataArr = [];
    var imageInfo = {};

    $.each(data.data, function(index, item){
        var dateString = dateFormat(new Date(parseInt(item.created_time) * 1000));
        //var dateString = dateObj.getDate() + "-" + dateObj.getMonth() + "-" + dateObj.getFullYear();
        console.log(dateString);
        if(dateString in imageInfo){
            imageInfo[dateString] += 1;
        } else{
            imageInfo[dateString] = 1;
        }
    });


    $.each(imageInfo, function(key, value){
        dataArr.push({date: parseDate(key), close: value});
    });

    console.log(dataArr);

    x.domain(d3.extent(dataArr, function(d) { return d.date; }));
  y.domain([0, d3.max(dataArr, function(d) { return d.close; })]);


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

    svg.selectAll(".dot")
        .data(dataArr)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 7)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.close); })
        .style("fill", function(){return "#4F94CD"});

    svg.append("path")
      .datum(dataArr)
      .attr("class", "line")
      .attr("d", line);
  d3.select("#loader")
      .remove();
  d3.selectAll("svg").style("background","white");


});


var dateFormat = function(date){
    var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
    var yyyy = date.getFullYear().toString().substring(2);
    var mm = monthArr[date.getMonth()].toString(); // getMonth() is zero-based
    var dd  = date.getDate().toString();

    return dd + '-' + mm + '-' + yyyy;
}