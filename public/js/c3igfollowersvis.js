var chart;
var followers;
var self_user;
var loadNext;
var loadPrev;


(function() {
    $.getJSON( '/igFollowsComp')
        .done(function( data ) {
            self_user = data.user;
            followers = data.followers;
            var count = 0;

            chart = c3.generate({
                bindto: '#chart',
                data: {
                    columns: [
                        [self_user.username, self_user.counts.follows],
                        [followers[0].username, followers[0].counts.follows]
                    ],
                    type : 'donut',
                    onclick: function (d, i) { console.log("onclick", d, i); },
                    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                },

                donut: {
                    label: {
                        format: function (value) { return value; }
                    }
                }
            });

            var getNext = function(){
                count++;
                if(count >= followers.length){
                    count = 0;
                }
                return followers[count];
            };

            var getLast = function(){
                count--;
                if(count <= 0) {
                    count = followers.length - 1;
                }
                return followers[count];
            };

            var getCurrent = function(){
              return followers[count];
            };
            loadNext = function(){
                var current = getCurrent();
                var next = getNext();

                chart.load({
                    columns: [
                        [next.username, next.counts.follows]
                    ]
                });

                chart.unload({
                    ids: current.username
                });
            };

            loadPrev = function(){
                var current = getCurrent();
                var last = getLast();

                chart.load({
                    columns: [
                        [last.username, last.counts.follows]
                    ]
                });

                chart.unload({
                    ids: current.username
                });

            };
            d3.select("#loader")
                .remove();

        });
})();
