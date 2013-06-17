var requestDataItem;
var selectedRequest;

var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		repositoryRequestCode : {
			editable : false
		}
	}
});


$(document).ready(function() {

	
	if (!$("#purchasecontractselect").data("kendoDropDownList")) {
		$("#purchasecontractselect").kendoDropDownList({
			dataTextField : "purchaseContractCode",
			dataValueField : "_id",
			placeholder : "选择采购合同...",
			dataSource : {
				transport : {
					read : {
						dataType : "jsonp",
						url : "/service/purcontract/list",
					}
				}
			},
			// 当用户选择不同的采购申请时候赋值给requestDataItem对象
			select : function(e) {
				selectedRequest = this.dataSource.at(e.item.index());
			}
		});
	}

	
	if (redirectParams) {
		postAjaxRequest("/service/purcontract/repository/get", redirectParams, edit);
	} 
	
});



var itemDataSource = new kendo.data.DataSource({
	transport : {
		update : {
			url : "/service/purcontract/repository/update",
			dataType : "jsonp",
			type : "post"
		},
		create : {
			url : "/service/purcontract/repository/add",
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
	if(!requestDataItem.status){
		requestDataItem.status = "草稿";
	}
	if(status){
		requestDataItem.status = status;
	}
	
	
	if(itemDataSource.at(0)){
		//force set haschanges = true
		itemDataSource.at(0).set("uid", kendo.guid());
	}


	// 同步数据
	itemDataSource.sync();
	
	
}

function checkStatus() {
	loadPage("repository", null);
}
// 计算成

function showOrderWindow() {
	// 如果用户用默认的采购申请，select event不会触发， 需要初始化数据
	var purchaseRequestGrid = $("#purchasecontractselect").data("kendoDropDownList");

	
	if (!selectedRequest) {
		selectedRequest = purchaseRequestGrid.dataSource.at(0);
	}
	
	console.log(selectedRequest);
	requestDataItem = new model({});
	requestDataItem.eqcostList = selectedRequest.eqcostList;
	requestDataItem.supplierName = selectedRequest.supplierName;

	edit();
}

function edit(data) {

	// 初始化空对象
	var dataItem = new model();
	if(data){
		$("#purchaserepository-div").hide();
		requestDataItem = data;
	}else{
		$("#purchaserepository-div").show();
	}

	if (requestDataItem) {
		requestDataItem = new model(requestDataItem);

	}

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
				title : "货品编号",
				width : 80
			}, {
				field : "eqcostProductName",
				title : "货品名",
				width : 80
			}, {
				field : "eqcostProductCategory",
				title : "货品类别",
				width : 80
			}, {
				field : "eqcostProductType",
				title : "货品型号",
				width : 80

			}, {
				field : "eqcostApplyAmount",
				title : "本次采购数量"
			}],
			scrollable : true,
			editable : false,
			width : "800px"

		});
	}
}
