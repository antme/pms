$(document).ready(function() {
	var scGotMoneyInfo;
	
	var data = [
        { text: "按月统计", value: "1" },
        { text: "按年统计", value: "2" }
    ];

    $("#date").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: function(e) {
            var value = $("#date").val();
            if (value == 1) {
            	options.series[0].data = scGotMoneyInfo.monthMoneyList;
        		options.series[0].name = '月度金额';
        		options.xAxis.categories = scGotMoneyInfo.monthDateList;
        		var chart = new Highcharts.Chart(options);
    		} else {
    			options.series[0].data = scGotMoneyInfo.yearMoneyList;
        		options.series[0].name = '年度金额';
        		options.xAxis.categories = scGotMoneyInfo.yearDateList;
        		var chart = new Highcharts.Chart(options);
    		}
        }
    });
    
    ;
    
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
    	scGotMoneyInfo = data.scGotMoneyInfo;
		options.series[0].data = data.scGotMoneyInfo.monthMoneyList;
		options.series[0].name = '月度金额';
		options.xAxis.categories = data.scGotMoneyInfo.monthDateList;
		var chart = new Highcharts.Chart(options);
    });
});