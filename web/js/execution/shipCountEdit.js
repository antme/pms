
var saveUrl = "/service/purcontract/repository/update?type=in";
var submitUrl = "/service/purcontract/repository/add?type=in";
var loadUrl = "/service/purcontract/repository/get";


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
	var dataItem = new model();
	if(data){
		$("#purchaserepository-div").hide();
		requestDataItem = data;
		
		for (i in requestDataItem.eqcostList) {			
//			requestDataItem.eqcostList[i].leftCount = requestDataItem.eqcostList[i].leftCount + requestDataItem.eqcostList[i].eqcostApplyAmount;
		}
	    
	}else{
		$("#purchaserepository-div").show();
	}

	if (requestDataItem) {
		requestDataItem = new model(requestDataItem);

	}
	
//	requestDataItem.inDate = "10/10/2013";
	requestDataItem.set("inDate", kendo.toString(requestDataItem.inDate, 'd'));
	kendo.bind($("#purchaserepository-edit-item"), requestDataItem);

	// 渲染成本编辑列表
	itemDataSource.data(requestDataItem.eqcostList);

	$("#purchasecontract-edit-item").show();
	$("#purchasecontract-select").hide();


	if (!$("#purchaserepository-edit-grid").data("kendoGrid")) {
		$("#purchaserepository-edit-grid").kendoGrid({
			dataSource : itemDataSource,
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
			},{
				field : "leftCount",
				title : "可入库数量"
			}, {
				field : "eqcostApplyAmount",
				title : "入库数量"
			}, {
				field : "requestedTotalMoney",
				title : "金额"
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
