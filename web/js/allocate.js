$(document).ready(function() {
    var options = {
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        series: [{}]
    };
    
    var url =  "../service/sc/get?_id=51b6ccd12b6001f9de9c5627";
    $.getJSON(url,  function(data) {
    	var gotMoneyInfo = data.scGotMoneyInfo;
    	var a = [];
    	for ( var int = 0; int < gotMoneyInfo.length; int++) {
    		var b = gotMoneyInfo[int].scGotMoney;
    		a.push(parseInt(b));
		}
    	console.log(a);
		options.series[0].data = a;
		var chart = new Highcharts.Chart(options);
    });
});