var submitUrl = "/service/ship/count/submit";
var loadUrl = "/service/ship/count/get";

var model = kendo.data.Model.define({
	id : "_id",
	fields : {}
});

var requestDataItem = new model();

$(document).ready(function() {
	checkRoles();
	if (redirectParams && redirectParams._id) {
		postAjaxRequest(loadUrl, redirectParams, edit);
	}

});


function submitRequest() {
	postAjaxRequest(submitUrl, {_id:requestDataItem._id}, function(data){
		loadPage("execution_shipCount");
	});
}

function cancel() {
	loadPage("execution_shipCount", null);
}

function checkStatus() {
	if (redirectParams && redirectParams.type == "out") {
		loadPage("repository_repositoryout", null);
	} else {
		loadPage("repository_repository", null);
	}
}

var sdataSource = new kendo.data.DataSource({
	 data : []
});


function edit(data) {

	// 初始化空对象

	if (requestDataItem) {
		requestDataItem = new model(requestDataItem);

	}

	if (data) {
		requestDataItem = new model(data);

	}

	kendo.bind($("#ship-count-edit"), requestDataItem);
	if (!requestDataItem.eqcostList) {
		$("#ship-count-grid").html("无发货数据");
	}

	var eqList = [];
	
	if(requestDataItem.eqcostList){
		eqList = requestDataItem.eqcostList;
	}
	sdataSource.data(requestDataItem.eqcostList);
	$("#ship-count-grid").kendoGrid({
		dataSource : sdataSource,
		columns : [ {
			field : "eqcostNo",
			title : "序号",
			width : 80
		}, {
			field : "eqcostProductType",
			title : "规格型号"

		}, {
			field : "eqcostProductName",
			title : "货品名",
			width : 80
		}, {
			field : "eqcostBrand",
			title : "品牌"
		}, {
			field : "eqcostProductType",
			title : "单位"

		}, {
			field : "eqcostShipAmount",
			title : "发货数"

		}, {
			field : "eqcostBasePrice",
			title : "采购单价"
		} ],
		width : "800px"

	});

}
