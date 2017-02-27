function tempgraph(){
    var form = document.forms.param;
    var viewdate = (form._date.value).replace(/[" ]/g, "").split(/,/);
    var sdate = viewdate[0] + "T00:00:00.000Z"
    var edate = viewdate[viewdate.length-1] + "T23:59:59.999Z"
    var value = form._th.value
    var limit = 10000

    var url = "http://api-m2x.att.com/v2/devices/7870230c081b7f4f678dde08bc7bcba7/streams/" + value + "/values.csv?start=" + sdate + "&&end=" + edate + "&&limit=" + limit

    Plotly.d3.text(url).header("X-M2X-KEY", "81faa53c80c0c084e797d706bc84be25").get(function(error, text){
	var rows = Plotly.d3.csv.parseRows(text).reverse();
        
	var tracel = viewdate.map(function(vd){
	var re_date = new RegExp(vd);
	var filtered = rows.filter(function(row){
	    //return (row['datetime'].match(re));
	    var dt = row[0];
	    var re_min = new RegExp(/[0-9][0-9]:[0-5][05]:[0-9][0-9]\./); // 毎5分のみ
	    return dt.match(re_date) && dt.match(re_min);
	});
	var trace = {
	    type: 'scatter',                    // set the chart type
	    mode: 'markers+lines',                      // connect points with lines
	    name: vd, 
	    x: filtered.map(function(row){          // set the x-data
		//var ret = (row['datetime']).replace(/[0-9][0-9][0-9][0-9]\/[0-9][0-9]\/[0-9][0-9] /, "");
		var ret = row[0];
		ret = ret.replace(/[0-9][0-9][0-9][0-9]\-[0-9][0-9]\-[0-9][0-9]T/, "");  // 日付削除
		return ret.replace(/:[0-9][0-9]\.[0-9][0-9][0-9]Z/, "");  // 秒削除
	    }),
	    y: filtered.map(function(row){          // set the x-data
		return row[1];
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
