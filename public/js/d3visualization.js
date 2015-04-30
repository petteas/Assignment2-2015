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
        return "<strong>Count:</strong> <span style='color:red'>"+"</span>";
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
var data1 = [{date:parseDate("1-May-12"),close:12},{date:parseDate("30-Apr-12"),close:15},{date:parseDate("27-Apr-12"),close:5},{date:parseDate("26-Apr-12"),close:9},{date:parseDate("25-Apr-12"),close:19}];
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
      .attr("y", 3)
      .attr("dy", ".25em")
      .style("text-anchor", "end");

  svg.append("path")
      .attr("id","line1")
      .datum(dataArr)
      .attr("class", "line")
      .attr("d", line)
      .on("click", function(d,i) {drawInfo(d)})
      .on('mouseover',tip.show)
      .on('mouseout', tip.hide)
      //.on("mouseover", function(d,i) {setStrokeWidth7Px()})
      //.on("mouseout", function(d,i) {setStrokeWidth3Px()})
        .style("stroke-width","3px");
  d3.select("#loader")
      .remove();
  d3.selectAll("svg").style("background","white");
    d3.select("#dataInfo")
        .style("display", "inherit");

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
    console.log(max);
    console.log(min);
    console.log(count);
    console.log(total);
    d3.select("body").select("#min")
        .text("Minimum Value: "+min);
    d3.select("body").select("#max")
        .text("Maximum Value: "+ max);
    d3.select("body").select("#avg")
        .text("Average Value: "+ (total/count));
}

var dateFormat = function(date){
    var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
    var yyyy = date.getFullYear().toString().substring(2);
    var mm = monthArr[date.getMonth()].toString(); // getMonth() is zero-based
    var dd  = date.getDate().toString();

    return dd + '-' + mm + '-' + yyyy;
}