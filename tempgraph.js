    
//Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/wind_speed_laurel_nebraska.csv', function(rows){
Plotly.d3.csv('http://192.168.1.15/temperature/resultq.csv', function(rows){
    var viewdate = ['2017/02/06', '2017/02/07', '2017/02/08'];

    var tracel = viewdate.map(function(vd){
	var re = new RegExp(vd);
	var filtered = rows.filter(function(row){
	    return (row['datetime'].match(re));
	});
	var trace = {
	    type: 'scatter',                    // set the chart type
	    mode: 'markers+lines',                      // connect points with lines
	    name: vd, 
	    x: filtered.map(function(row){          // set the x-data
		var ret = (row['datetime']).replace(/[0-9][0-9][0-9][0-9]\/[0-9][0-9]\/[0-9][0-9] /, "");
		return ret.replace(/:[0-9][0-9]$/, "");
	    }),
	    y: filtered.map(function(row){          // set the x-data
		return row['temperature'];
	    }),
	    line: {                             // set the width of the line.
		width: 1
	    },
	};
	return trace;
    });

    var layout = {
      yaxis: {title: "temp"},       // set the y axis title
      xaxis: {
        showgrid: false,                  // remove the x-axis grid lines
        tickformat: "%B, %Y"              // customize the date format to "month, day"
      },
      margin: {                           // update the left, bottom, right, top margin
        l: 40, b: 100, r: 10, t: 20
      }
    };

    Plotly.plot(document.getElementById('temperature'), tracel, layout, {showLink: false});
});
