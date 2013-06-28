$(document).ready(function() {
    var options = {
        chart: {
            renderTo: 'container',
            type: 'column'
        },
        title: {
            text: '收款信息'
        },
        yAxis: {
            title: {
                text: '金额'
            }
        },
        xAxis: {},
        series: [{}]
    };
    
    var url =  "../service/sc/get?_id=51cae6274af1dd698a5f9f8b";
    $.getJSON(url,  function(data) {
		options.series[0].data = data.scGotMoneyInfo.money;
		options.series[0].name = '月度金额';
		options.xAxis.categories = data.scGotMoneyInfo.date;
		var chart = new Highcharts.Chart(options);
    });
});