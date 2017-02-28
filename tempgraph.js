//
//
//
Date.prototype.dtlocal = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    var HH = this.getHours();
    var MM = this.getMinutes();
    var ss = this.getSeconds();

    return [
        this.getFullYear(), '-',
        (mm>9 ? '' : '0') + mm, '-',
        (dd>9 ? '' : '0') + dd,
        'T',
        (HH>9 ? '' : '0') + HH, ':',
        (MM>9 ? '' : '0') + MM, ':',
        (ss>9 ? '' : '0') + ss,
    ].join('');
};

//
//
//
function tempgraph(){
    var form = document.forms.param;
    var viewdate = (form._date.value).replace(/[" ]/g, "").split(/,/);
    var sdate = new Date(viewdate[0] + "T00:00:00+09:00")
    var edate = new Date(viewdate[viewdate.length-1] + "T23:59:59+09:00")
    var value = form._th.value
    var limit = 10000

    var url = "http://api-m2x.att.com/v2/devices/7870230c081b7f4f678dde08bc7bcba7/streams/" + value + "/values.csv?start=" + sdate.toISOString() + "&&end=" + edate.toISOString() + "&&limit=" + limit

    Plotly.d3.text(url).header("X-M2X-KEY", "81faa53c80c0c084e797d706bc84be25").get(function(error, text){
	var rows = Plotly.d3.csv.parseRows(text).reverse();
        
	var tracel = viewdate.map(function(vd){
	    var re_date = new RegExp(vd);
	    var filtered = rows.filter(function(row){
		var dtiso = new Date(row[0]);
		var dt = dtiso.dtlocal();
		var re_min = new RegExp(/[0-9][0-9]:[0-5][05]:[0-9][0-9]$/); // 毎5分のみ
		return dt.match(re_date) && dt.match(re_min);
	    });
	    var trace = {
		type: 'scatter',                    // set the chart type
		mode: 'markers+lines',                      // connect points with lines
		name: vd, 
		x: filtered.map(function(row){          // set the x-data
                    var ret = new Date(row[0]);
		    var HH = ret.getHours();
		    var MM = ret.getMinutes();
		    return [(HH>9 ? '' : '0') + HH, ':',
			    (MM>9 ? '' : '0') + MM].join('');
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
