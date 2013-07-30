
var listProjectUrl = "/service/purcontract/repository/contract/list";
var updateUrl = "/service/purcontract/repository/update?type=in";
var createUrl = "/service/purcontract/repository/add?type=in";
var listEqUrl = "/service/purcontract/get/byproject_supplier";
var loadUrl = "/service/purcontract/repository/get";

if(redirectParams && redirectParams.type == "out"){
	listProjectUrl = "/service/purcontract/repository/contract/list?type=out";
	updateUrl = "/service/purcontract/repository/update?type=out";
	createUrl = "/service/purcontract/repository/add?type=out";
	listEqUrl = "/service/purcontract/get/byproject_supplier?type=out";
}

var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		repositoryRequestCode : {
			editable : false
		},
		inDate: {
			type:"date"
		},
		eqcostApplyAmount : {
			validation : {
				min : 0
			},
			type : "number"
		}
	}
});

var requestDataItem=new model();

var projectDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			dataType : "jsonp",
			url : listProjectUrl,
			type : "post"
		}
	},
	schema : {
		total: "total", 
		data: "data"
	}
});
$(document).ready(function() {
	checkRoles();
	$("#purchasecontractselect").kendoDropDownList({
			dataTextField : "projectName",
			dataValueField : "_id",
			placeholder : "选择项目...",
			dataSource : projectDataSource,
			change : function(e) {
				updateSupplier();
				requestDataItem.projectName = this.dataItem().projectName;
			},
			dataBound : function(e){	
				requestDataItem.projectName = this.dataItem().projectName;
				updateSupplier();
			}
		});
	
	$("#operator").kendoDropDownList({
		dataTextField : "userName",
		dataValueField : "_id",
		optionLabel: "选择入库人...",
		dataSource : proManagerItems
	});
	
	$("#inDate").kendoDatePicker({
	    format: "yyyy/MM/dd",
	    parseFormats: ["yyyy/MM/dd"]
	});
	
	
	
	$("#storeHouse").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择库房...",
		dataSource : storeHouseType
	});
	
	if (redirectParams && redirectParams._id) {
		postAjaxRequest(loadUrl, redirectParams, edit);
	} 
	
});


function updateSupplier(){
	var supplier = undefined;
	var data = projectDataSource.data();
	for(i=0; i<data.length; i++){
		if(data[i]._id == $("#purchasecontractselect").data("kendoDropDownList").value()){
			supplier = data[i].suppliers;
			break;
		}
	}
	$("#supplierName").kendoDropDownList({
		dataTextField : "supplierName",
		dataValueField : "_id",
		dataSource :{
			data : supplier			
		},
		change : function(e) {
			requestDataItem.supplierName = this.dataItem().supplierName;
		},
		dataBound : function(e){	
			requestDataItem.supplierName = this.dataItem().supplierName;
		}

	});
}


var itemDataSource = new kendo.data.DataSource({
	transport : {
		update : {
			url : updateUrl,
			dataType : "jsonp",
			type : "post"
		},
		create : {
			url : createUrl,
			dataType : "jsonp",
			type : "post"
		},
		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {
					// 解析成json_p模式
					json_p : kendo.stringify(requestDataItem),
					mycallback : "checkStatus"
				};
			}
		}
	},
	schema : {
		model : model
	},
	batch : true
});



function save(status) {
	
	
	if(!requestDataItem.status && redirectParams && redirectParams.type == "out"){
		requestDataItem.status = "已提交";
	}	
	if(!requestDataItem.status){
		requestDataItem.status = "草稿";
	}
	if(status){
		requestDataItem.status = status;
	}
	
	
	if(itemDataSource.at(0)){
		// force set haschanges = true
		itemDataSource.at(0).set("uid", kendo.guid());
	}

	if(projectId){
		requestDataItem.projectId = projectId;		
	}
	
	if(supplierId){
		requestDataItem.supplierId = supplierId;	
	}

	// 同步数据
	itemDataSource.sync();
	
	
}

function confirmRepository(){

	postAjaxRequest("/service/purcontract/repository/approve", {models:kendo.stringify(requestDataItem)}, checkStatus);
}

function cancel(){
	loadPage("repository_repository", null);
}

function checkStatus() {
	if(redirectParams && redirectParams.type == "out"){
		loadPage("repository_repositoryOut", null);
	}else{
		loadPage("repository_repository", null);
	}
}
// 计算成
var projectId = undefined;
var supplierId = undefined;

function selectContracts() {

	 projectId = $("#purchasecontractselect").data("kendoDropDownList").value();
	 supplierId = $("#supplierName").data("kendoDropDownList").value();
	
	var param = {"projectId": projectId, "supplier" : supplierId};
	
	postAjaxRequest(listEqUrl, param, loadContracts);
}

function loadContracts(data){
	requestDataItem.eqcostList = data.data;
	edit();
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
