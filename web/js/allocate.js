$(document).ready(function() {
    var options = {
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        xAxis: {},
        series: [{}]
    };
    
    var url =  "../service/sc/list";
    $.getJSON(url,  function(data) {
//    	var gotMoneyInfo = data.scGotMoneyInfo;
//    	var a = [];
//    	for ( var int = 0; int < gotMoneyInfo.length; int++) {
//    		var b = gotMoneyInfo[int].scGotMoney;
//    		a.push(parseInt(b));
//		}
    	var a = [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4];
    	console.log(a);
		options.series[0].data = a;
		options.xAxis.categories = [
		                    'Jan',
		                    'Feb',
		                    'Mar',
		                    'Apr',
		                    'May',
		                    'Jun',
		                    'Jul',
		                    'Aug',
		                    'Sep',
		                    'Oct',
		                    'Nov',
		                    'Dec'
		                ];
		var chart = new Highcharts.Chart(options);
    });
});