var requestDataItem;

var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		repositoryRequestCode : {
			editable : false
		},
		inDate:{
			type:"date"
		}
	}
});
var projectDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			dataType : "jsonp",
			url : "/service/purcontract/repository/contract/list",
			type : "post"
		},
	},
	schema : {
		total: "total", 
		data: "data"
	}
});

$(document).ready(function() {
	$("#purchasecontractselect").kendoDropDownList({
			dataTextField : "projectName",
			dataValueField : "_id",
			placeholder : "选择项目...",
			dataSource : projectDataSource,
			change : function(e) {
				updateSupplier();
			},
			dataBound : function(e){		
				updateSupplier();
			}
		});
	
	$("#inOperator").kendoDropDownList({
		dataTextField : "userName",
		dataValueField : "_id",
        optionLabel: "选择入库人...",
		dataSource : proManagerItems,
	});
	
	$("#inDate").kendoDatePicker();
	
	if (redirectParams) {
		postAjaxRequest("/service/purcontract/repository/get", redirectParams, edit);
	} 
	
});



var itemDataSource = new kendo.data.DataSource({
	transport : {
		update : {
			url : "/service/purcontract/repository/update?type=out",
			dataType : "jsonp",
			type : "post"
		},
		create : {
			url : "/service/purcontract/repository/add?type=out",
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

	if(projectId){
		requestDataItem.projectId = projectId;		
	}
	
	if(supplierId){
		requestDataItem.supplierId = supplierId;	
	}

	// 同步数据
	itemDataSource.sync();
	
	
}

function checkStatus() {
	loadPage("repositoryOut", null);
}
// 计算成
var projectId = undefined;
var supplierId = undefined;

function selectContracts() {

	 projectId = $("#purchasecontractselect").data("kendoDropDownList").value();
	
	var param = {"projectId": projectId};
	
	postAjaxRequest("/service/purcontract/repository/list/byproject", param, loadContracts);
}

function loadContracts(data){
	console.log(data);
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
	
	requestDataItem.set("inDate", kendo.toString(requestDataItem.inDate, 'd'));
	
//	requestDataItem.inDate = "10/10/2013";

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
				field : "eqcostProductType",
				title : "货品类别",
				width : 80
			}, {
				field : "eqcostProductType",
				title : "货品型号",
				width : 80

			}, {
				field : "eqcostApplyAmount",
				title : "本次入库数量"
			}],
			scrollable : true,
			editable : true,
			width : "800px"

		});
	}
}
