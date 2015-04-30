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

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Count:</strong> <span style='color:red'>"+ d.close+"</span>";
    })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left","auto")
    .style("margin-right","auto")
    .style("display","block")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.call(tip);
d3.json('/igUserFeed', function(error, data) {

    var dataArr = [];
    var imageInfo = {};

    $.each(data.data, function(index, item){
        var dateString = dateFormat(new Date(parseInt(item.created_time) * 1000));
        //var dateString = dateObj.getDate() + "-" + dateObj.getMonth() + "-" + dateObj.getFullYear();
        if(dateString in imageInfo){
            imageInfo[dateString] += 1;
        } else{
            imageInfo[dateString] = 1;
        }
    });

    $.each(imageInfo, function(key, value){
        dataArr.push({date: parseDate(key), close: value});
    });

    
    dataArr.pop();


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
      .attr("y", 3)
      .attr("dy", ".25em")
      .style("text-anchor", "end");

    svg.selectAll(".dot")
        .data(dataArr)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 7)
        .on('mouseover',tip.show)
        .on('mouseout', tip.hide)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.close); })
        .style("fill", function(){return "#4F94CD"});

    svg.append("path")
      .datum(dataArr)
        .attr("id","line1")
      .attr("class", "line")
      .attr("d", line)
        .style("stroke-width","3px");

  d3.select("#loader")
      .remove();
  d3.selectAll("svg").style("background","white");
    d3.select("#dataInfo")
        .style("display", "inherit");
    drawInfo(dataArr);

});

function setStrokeWidth7Px(){
    d3.select("#line1").style("stroke-width","7px");
}
function setStrokeWidth3Px(){
    d3.select("#line1").style("stroke-width","3px");
}
function drawInfo(d) {
    var count = 0;
    var total = 0;
    var max = 0;
    var min = 9007199254740992;
    $.each(d, function(key, value){
        count++;
        total = total+value.close;
        if(value.close>max){
            max=value.close;
        }
        if(value.close<min){
            min=value.close;
        }
    });
    d3.select("body").select("#min")
        .text("Minimum Value: "+min);
    d3.select("body").select("#max")
        .text("Maximum Value: "+ max);
    d3.select("body").select("#avg")
        .text("Average Value: "+ Math.round(total/count));
}

var dateFormat = function(date){
    var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
    var yyyy = date.getFullYear().toString().substring(2);
    var mm = monthArr[date.getMonth()].toString(); // getMonth() is zero-based
    var dd  = date.getDate().toString();

    return dd + '-' + mm + '-' + yyyy;
}