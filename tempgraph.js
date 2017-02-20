function tempgraph(){    
//Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/wind_speed_laurel_nebraska.csv', function(rows){
Plotly.d3.csv('http://192.168.1.15/temperature/result.csv', function(rows){

    var form = document.forms.param;

    //var viewdate = ['2017/02/06', '2017/02/07', '2017/02/08'];
    var viewdate = (form._date.value).replace(/[" ]/g, "").split(/,/);

    var tracel = viewdate.map(function(vd){
	var re_date = new RegExp(vd);
	var filtered = rows.filter(function(row){
	    //return (row['datetime'].match(re));
	    var dt = row['datetime'];
	    var re_min = new RegExp(/[0-9][0-9]:[0-5][05]:[0-9][0-9]$/); // 毎5分のみ
	    return dt.match(re_date) && dt.match(re_min);
	});
	var trace = {
	    type: 'scatter',                    // set the chart type
	    mode: 'markers+lines',                      // connect points with lines
	    name: vd, 
	    x: filtered.map(function(row){          // set the x-data
		//var ret = (row['datetime']).replace(/[0-9][0-9][0-9][0-9]\/[0-9][0-9]\/[0-9][0-9] /, "");
		var ret = row['datetime'];
		ret = ret.replace(/[0-9][0-9][0-9][0-9]\/[0-9][0-9]\/[0-9][0-9] /, "");  // 日付削除
		return ret.replace(/:[0-9][0-9]$/, "");  // 秒削除
	    }),
	    y: filtered.map(function(row){          // set the x-data
		if(form._th.value == 'temperature'){
		    return row['temperature'];
		}else{
		    return row['humidity'];
		}
	    }),
	    line: {                             // set the width of the line.
		width: 1
	    },
	};
	return trace;
    });

    var layout = {
	yaxis: {
	    title: form._th.value
	},
	xaxis: {
            showgrid: false,                  // remove the x-axis grid lines
            tickformat: "%B, %Y"              // customize the date format to "month, day"
	},
	margin: {                           // update the left, bottom, right, top margin
            l: 40, b: 100, r: 10, t: 20
	}
    };

    Plotly.newPlot(document.getElementById('temperature'), tracel, layout, {showLink: false});
});
};
