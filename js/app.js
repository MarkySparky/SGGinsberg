//Declare a global app variable
var app = {

    // Point to our data sources
    // This will point the the actual ginsberg data once proxy in place
    // todo: create simple proxy, 406 error and jsonp are not good bedfellows.
    // https://openapi.project-ginsberg.com/v1/s/mood
    // https://openapi.project-ginsberg.com/v1/o/sleep
    paths : {"mood":"data/moods.json","sleep":"data/sleep.json"},

    // A dropdown list might ask for the year of interest
    yearSelected: 2010,

    //Define our bubble colors - last in array represents best mood
    bubbleColors : ["#e2e2e2", "#ddf", "#ccf", "#aaf", "#88f", "#77f", "#55f", "#44f", "#33f", "#11f", "#00f"],

   /**
    * Given a value, it will return a RGBA value with a saturation between 0 and 1
    */
    bubbleColor: function getBubbleColor(value) {
        var saturation = Math.round(Math.min(value || 0, 100) / 10);
        return app.bubbleColors[saturation];
    },
    
   /**
    * Initialises the grabbing of data
    * and generation of chart
    */
    init: function init() {
        //Clear out the old
        localStorage.clear();

        //Grab the data then draw the chart
        $.when(
            $.getJSON(app.paths.mood, function (data) {
              app.moodData = data;
            }),
            $.getJSON(app.paths.sleep, function (data) {
              app.sleepData = data;
            })
        ).then(function () {
        
            //Prepopulate the sleep data into the hash
            app.populateSleepJson(app.sleepData);
            
            //Populate the moods data into the hash
            app.moodData = app.populateMoodJson(app.moodData);
            //app.populateMoodsJson(app.moodData);
            
            //Process the data into an array
            app.moodData = app.mergeData();
            
            //Draw the chart
            app.drawChart("#chart", app.moodData);

        });
    },
    
    /**
    * Reformats sleep data into year / month / value
    * comes in like this
    * {"timestamp":"13/02/2014 10:30:00","total_sleep":1245.0,"deep_sleep":0.0,"rem_sleep":0.0,"light_sleep":0.0,"awake":0.0,"times_awoken":0}
    * and leaves like this
    * {year: 2013,  month: 02, dayOfWeek: 03, value: 1245}
    */
    populateSleepJson : function populateSleepJson(sleepData) {

      var res = $.map(sleepData, function (rowdata) {

        //Get a datetime object from the timestamp
        var dt = moment(rowdata.timestamp,"DD/MM/YYYY");
        
        //Should we include this data?
        if (app.yearSelected == dt._d.getUTCFullYear()) {
            return {
                "year": dt._d.getUTCFullYear(),
                "month": dt._d.getUTCMonth(),
                "dayOfWeek": dt._d.getUTCDay(),
                "value": rowdata.total_sleep
            }
        }
        
      });

        //initialise the localStorage hash
        //todo: Move from localStorage to pouchDB
        for (var i = 0; i <= 11; i++) {
            for (var j = 0; j <= 6; j++) {
                localStorage["sleep_m" + i + "d" + j + "value"] = 0;
                localStorage["sleep_m" + i + "d" + j + "count"] = 0;
            }
        }

        //Now average these days to the day of week per month
        $(res).each(function () {
            m = this.month;
            d = this.dayOfWeek;
            localStorage["sleep_m" + m + "d" + d + "value"] = parseInt(localStorage["sleep_m" + m + "d" + d + "value"]) + Math.round(this.value/60,2);
            localStorage["sleep_m" + m + "d" + d + "count"] = parseInt(localStorage["sleep_m" + m + "d" + d + "count"]) + 1;
        });
        

    },

    /**
    * Reformats the moods data into year / month / value
    * comes in like this
    * {timestamp: "2013-07-04T17:19:12.093", type: "Mood", value: 20}
    * and leaves like this
    * {year: 2013,  month: 08, dayOfWeek: 3, value: 20}
    */
    populateMoodJson : function populateMoodJson(moodData) {
        var res = $.map(moodData, function (rowdata) {

          //Get a datetime object from the timestamp
          var dt = moment(rowdata.timestamp, "YYYY-MM-DD");

          //Should we include this data?
          if (app.yearSelected == dt._d.getUTCFullYear()) {

              return {
                  "year": dt._d.getUTCFullYear(),
                  "month": dt._d.getUTCMonth(),
                  "dayOfWeek": dt._d.getUTCDay(),
                  "value": rowdata.value
              }
          }
        });

        //initialise the localStorage hash
        //todo: Move from localStorage to pouchDB
        for (var i = 0; i <= 11; i++) {
            for (var j = 0; j <= 6; j++) {
                localStorage["mood_m" + i + "d" + j + "value"] = 0;
                localStorage["mood_m" + i + "d" + j + "count"] = 0;
            }
        }

        //Post the data to localStorage
        $(res).each(function () {
            m = this.month;
            d = this.dayOfWeek;
            localStorage["mood_m" + m + "d" + d + "value"] = parseInt(localStorage["mood_m" + m + "d" + d + "value"]) + this.value;
            localStorage["mood_m" + m + "d" + d + "count"] = parseInt(localStorage["mood_m" + m + "d" + d + "count"]) + 1;
        });

    },

   /**
    * Pulls in the localStorage data 
    * and creates an array suitable for highcharts
    */
    mergeData : function mergeData() {
        
        //Create an empty array to pass to highcharts
        result = [];
        
        //Loop all months / days, grabbing data from the store and adding to the array
        for (var i = 0; i <= 11; i++) {
            for (var j = 0; j <= 6; j++) {

                var totalVal = localStorage["mood_m" + i + "d" + j + "value"];
                var totalCount = localStorage["mood_m" + i + "d" + j + "count"];
                var bubbleColor = app.bubbleColor(totalVal / totalCount);
                var bubbleSize = Math.round(Math.max(localStorage["sleep_m" + i + "d" + j + "value"],1) / Math.max(localStorage["sleep_m" + i + "d" + j + "count"],1),2) ;
                var dta = {
                    x: i,
                    y: j,
                    z: bubbleSize * bubbleSize * bubbleSize, /*exagerate the differences for visual effect*/
                    color: bubbleColor,
                    bubbleSize: bubbleSize,
                    lineColor: "#ccc",
                    states: {
                        hover: {
                            fillColor: bubbleColor
                        }
                    }
                };
                result.push(dta);
            }
        }

        return result;
    },
    
   /**
    * Draws the chart data $data on dom element $container 
    */
    drawChart : function drawChart($container, $data) {
        $($container).highcharts({

            chart: {
                defaultSeriesType: 'scatter'
            },

            title: {
                text: ''
            },

            xAxis: {
                categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                title: {
                    text: ''
                },
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                minorTickLength: 0,
                tickLength: 0,
                labels: {
                    enabled: true
                },
            },

            yAxis: {
                tickPositions: [0, 1, 2, 3, 4, 5, 6],
                categories: ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'],
                title: {
                    text: ''
                },
                lineWidth: 0,
                minorGridLineWidth: 0,
                gridLineColor: '#cccccc',
                lineColor: 'transparent',
                minorTickLength: 1,
                tickLength: 0,
                labels: {
                    enabled: true
                },
            },

            series: [{
                data: $data,
                title: {
                    text: 'Sleep and Mood data'
                },
                color: '#000000',
                name: "Sleep vs Mood",
                type: 'bubble',
                showInLegend: false,
                maxSize: 45,
                minSize: "2"
            }],
            tooltip: {
                  backgroundColor: '#FCFFC5',
                  borderRadius: 10,
                  borderWidth: 3,
                    formatter: function() {
                    console.log(this);
                        return 'In <b>' + this.series.yAxis.categories[this.y] + ' </b>during <b>' + this.x + '</b> you averaged <b>' + this.point.bubbleSize + ' hours sleep';
                    }
            }


        });
    }
  }

//When dom ready then run...
$(function () {
    app.init();
});