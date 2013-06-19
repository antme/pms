$(document).ready(function() {
	if(popupParams){
		postAjaxRequest("/service/history/sc/amount", popupParams, edit);
	}
});

function edit(data){
	$("#contractAmountHistoryGrid").kendoGrid({
		dataSource : data.data,
        sortable: {
            mode: "multiple",
            allowUnsort: true
        },
		columns : [ {
			field : "oldValue",
			title : "修改前数据"
		},{
			field : "newValue",
			title : "修改后数据"
		}, {
			field : "time",
			title : "修改时间"
		}, {
			field : "operator",
			title : "修改人"
		}]
	});
}