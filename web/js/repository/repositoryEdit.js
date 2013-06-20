var requestDataItem;

var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		repositoryRequestCode : {
			editable : false
		}
	}
});


$(document).ready(function() {
	$("#purchasecontractselect").kendoDropDownList({
			dataTextField : "projectName",
			dataValueField : "_id",
			placeholder : "选择项目...",
			dataSource : {
				transport : {
					read : {
						dataType : "jsonp",
						url : "/service/purcontract/repository/contract/list",
					}
				},
				schema : {
					total: "total", 
					data: "data"
				}		
			},
			select : function(e) {
				updateSupplier();
			},
			dataBound : function(e){		
				updateSupplier();
			}
		});
	
	
	if (redirectParams) {
		postAjaxRequest("/service/purcontract/repository/get", redirectParams, edit);
	} 
	
});


function updateSupplier(){
	$("#supplierName").kendoDropDownList({
		dataTextField : "supplierName",
		dataValueField : "_id",
		dataSource :{
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/purcontract/project/contract/suppliers/list",
				},
			
				parameterMap : function(options, operation) {
					return {
						// 解析成json_p模式
						json_p : '{"projectId" : ' + $("#purchasecontractselect").data("kendoDropDownList").value() + '}'
					}
				}
			},
			schema : {
				total: "total",
				data: "data"
			}
		}
	});
}


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
		// force set haschanges = true
		itemDataSource.at(0).set("uid", kendo.guid());
	}


	// 同步数据
	itemDataSource.sync();
	
	
}

function checkStatus() {
	loadPage("repository", null);
}
// 计算成

function selectContracts() {

	var projectId = $("#purchasecontractselect").data("kendoDropDownList").value();
	var supplierId = $("#supplierName").data("kendoDropDownList").value();
	
	var param = {"projectId": projectId, "supplier" : supplierId};
	
	postAjaxRequest("/service/purcontract/get/byproject_supplier", param, loadContracts);
}

function loadContracts(data){
	requestDataItem = new model();
	requestDataItem.eqcostList = data.data;
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
