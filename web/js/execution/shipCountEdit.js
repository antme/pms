
var submitUrl = "/service/ship/count/submit";
var loadUrl = "/service/ship/count/get";


var model = kendo.data.Model.define({
	id : "_id",
	fields : {
	}
});

var requestDataItem=new model();


$(document).ready(function() {
	checkRoles();
	if (redirectParams && redirectParams._id) {
		postAjaxRequest(loadUrl, redirectParams, edit);
	} 
	
});





function saveRequest() {

	
}

function submitRequest(){

}

function cancel(){
	loadPage("execution_shipCount", null);
}

function checkStatus() {
	if(redirectParams && redirectParams.type == "out"){
		loadPage("repository_repositoryout", null);
	}else{
		loadPage("repository_repository", null);
	}
}



function edit(data) {

	// 初始化空对象

	if (requestDataItem) {
		requestDataItem = new model(requestDataItem);

	}
	
	if(data){
		requestDataItem = new model(data);

	}
	
	kendo.bind($("#ship-count-edit"), requestDataItem);
	
	if(!requestDataItem.eqList){
		$("#ship-count-grid").html("无发货数据");
	}

	if (!$("#ship-count-grid").data("kendoGrid")) {
		$("#ship-count-grid").kendoGrid({
			data : requestDataItem.eqList,
			columns : [ {
				field : "eqcostNo",
				title : "序号",
				width : 80
			},{
				field : "eqcostProductType",
				title : "规格型号"

			}, {
				field : "eqcostProductName",
				title : "货品名",
				width : 80
			},{
				field : "eqcostBrand",
				title : "品牌"
			}, {
				field : "eqcostProductType",
				title : "单位"

			},{
				field : "eqcostBasePrice",
				title : "采购单价"
			}, {
				field : "salesContractCode",
				title : "销售合同编号"
			},{
				field : "purchaseOrderCode",
				title : "订单编号"
			}],
			scrollable : true,
			editable : true,
			width : "800px",
			save: function(e){
				if (e.values.eqcostApplyAmount) {					
					if(e.values.eqcostApplyAmount > e.model.leftCount){
//						alert("最多可以入库" + e.model.leftCount);
//						e.preventDefault();
					}
				}
			}

		});
	}
}
