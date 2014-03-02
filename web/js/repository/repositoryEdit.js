
var listProjectUrl = "/service/purcontract/repository/contract/list";
var updateUrl = "/service/purcontract/repository/update?type=in";
var createUrl = "/service/purcontract/repository/add?type=in";
var listEqUrl = "/service/purcontract/get/countract_order?type=in";
var loadUrl = "/service/purcontract/repository/get?type=in";
var eqcostApplyAmountLabel = "入库数量";
var leftCountLabel = "可入库数量";



var commonFileds = {
		eqcostAvailableAmount : {
			type : "number"
		},
		pbPlanDate:{type:"date"},
		applicationDepartment:{
			
		},
		eqcostApplyAmount : {
			validation : {
				min : 0
			},
			type : "number"
		},
		eqcostBasePrice : {
			type : "number",
			editable : false
		},
		eqcostRealAmount : {
			editable : false,
			type : "number"
		},
		eqcostProductUnitPrice : {
			type : "number"
		},
		requestedTotalMoney : {
			editable : false
		},
		eqcostContractTotalMoney : {
			type : "number",
			editable : false
		},
		eqcostSalesBasePrice : {
			editable : false
		},
		eqcostDiscountRate : {
			editable : false
		},
		eqcostLastBasePrice : {
			editable : false
		},
		eqcostProductName : {
			editable : false
		},
		eqcostNo : {
			editable : false
		},
		eqcostMaterialCode : {
			editable : false
		},
		eqcostProductType : {
			editable : false
		},
		eqcostAvailableAmount : {
			editable : false
		},
		eqcostUnit : {
			editable : false
		},
		pbTotalCount :{
			editable : false
		},
		pbLeftCount : {
			editable : false
		},
		orderEqcostName : {

		},
		eqcostDeliveryType: {
			defaultValue : "入公司库"
		},
		
		orderEqcostModel : {

		},
		eqcostProductUnitPrice : {
			validation : {
				min : 0
			},
			type : "number"

		},
		comment : {

		},
		eqcostList: {}
	};
var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		repositoryRequestCode : {
			editable : false
		},
		inDate: {
			type:"date"
		},
		outDate: {
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
	if((redirectParams && redirectParams.type == "out") || (popupParams && popupParams.type == "out")){
		listProjectUrl = "/service/purcontract/repository/contract/list?type=out";
		updateUrl = "/service/purcontract/repository/update?type=out";
		createUrl = "/service/purcontract/repository/add?type=out";
		listEqUrl = "/service/purcontract/get/byproject_supplier?type=out";
		loadUrl = "/service/purcontract/repository/get?type=out";
		eqcostApplyAmountLabel = "出库数量";
		leftCountLabel = "可出库数量";
		if(redirectParams && redirectParams.page && redirectParams.page == "confirm"){
			$("#confirmRepositoryOut").show();
		}else{
			$("#saveRepos").show();
		}

	}else{

		$("#purchasecontractselect").kendoDropDownList({
			dataTextField : "purchaseContractCode",
			dataValueField : "_id",
			placeholder : "选择采购合同...",
			dataSource : projectDataSource,
			change : function(e) {
				updateSupplier();
				requestDataItem.purchaseContractCode = this.dataItem().purchaseContractCode;
				requestDataItem.purchaseContractId = this.dataItem()._id;
				requestDataItem.supplierId = this.dataItem().supplier;
				requestDataItem.supplierName = this.dataItem().supplierName;
			},
			dataBound : function(e){	
				requestDataItem.purchaseContractCode = this.dataItem().purchaseContractCode;
				requestDataItem.purchaseContractId = this.dataItem()._id;
				requestDataItem.supplierId = this.dataItem().supplier;
				requestDataItem.supplierName = this.dataItem().supplierName;
				
				updateSupplier();
			}
		});
	}

//	$("#operator").kendoDropDownList({
//		dataTextField : "userName",
//		dataValueField : "_id",
//		optionLabel: "选择入库人...",
//		dataSource : proManagerItems
//	});
//	
	$("#inDate").kendoDatePicker({
	    format: "yyyy/MM/dd",
	    parseFormats: ["yyyy/MM/dd"]
	});
	
	$("#outDate").kendoDatePicker({
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
		postAjaxRequest(loadUrl, redirectParams, editRepository);
		
		if(redirectParams && redirectParams.page == "confirm"){
			$(".repository_management_process").show();
			$(".repository_management").hide();
			
			
		}else if(redirectParams){
			$(".repository_management").show();
			$(".repository_management_process").hide();
		}
	}else if(popupParams){
		
		if(popupParams.type == "out"){
			loadUrl = "/service/purcontract/repository/get?type=out";
			eqcostApplyAmountLabel = "出库数量";
			leftCountLabel = "可出库数量";
		}
		postAjaxRequest(loadUrl, popupParams, editRepository);
		disableAllInPoppup();
	}else{
		$(".repository_management").show();
		$(".repository_management_process").hide();
	}
	
});


function updateSupplier(){
	var orders = undefined;
	var data = projectDataSource.data();
	for(i=0; i<data.length; i++){
		if(data[i]._id == $("#purchasecontractselect").data("kendoDropDownList").value()){
			orders = data[i].orders;
			break;
		}
	}
	$("#supplierName").kendoDropDownList({
		dataTextField : "purchaseOrderCode",
		dataValueField : "_id",
		dataSource :{
			data : orders			
		},
		change : function(e) {
			requestDataItem.projectId = this.dataItem().projectId;
			requestDataItem.projectCode = this.dataItem().projectCode;
			requestDataItem.projectName = this.dataItem().projectName;

			requestDataItem.purchaseOrderId = this.dataItem().purchaseOrderId;
			requestDataItem.scId = this.dataItem().scId;
			requestDataItem.contractCode = this.dataItem().contractCode;
			requestDataItem.purchaseOrderCode = this.dataItem().purchaseOrderCode;
		},
		dataBound : function(e){	
			requestDataItem.projectId = this.dataItem().projectId;
			requestDataItem.projectCode = this.dataItem().projectCode;
			requestDataItem.projectName = this.dataItem().projectName;

			requestDataItem.purchaseOrderId = this.dataItem().purchaseOrderId;
			requestDataItem.scId = this.dataItem().scId;
			requestDataItem.contractCode = this.dataItem().contractCode;
			requestDataItem.purchaseOrderCode = this.dataItem().purchaseOrderCode;
		}

	});

}


var repFields = {
		eqcostBrand : {
			editable : false
		},
		contractCode : {
			editable : false
		},
		purchaseOrderCode : {
			editable : false
		},
		leftCount: {
			editable : false
		}

}
repFields =  $.extend( commonFileds, repFields);

//编辑页面的model对象
//抽象model对象， datasource对象必须绑定一个model为了方便解析parameterMap中需要提交的参数
var reModel = kendo.data.Model.define({
	id : "_id",
	fields : repFields
});


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
		model : reModel
	},
	batch : true
});



function saveRepos(status) {
	var validator = $("#purchaserepository-edit-item").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		alert("验证不通过，请检查表单");
	} else {

		if(requestDataItem.eqcostList　&& requestDataItem.eqcostList.length==0){
			alert("此申请无任何货品");
			return;
		}
		
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
		
		if(requestDataItem.operator && requestDataItem.operator._id){
			requestDataItem.operator = requestDataItem.operator._id;
		}

	
		// 同步数据
		itemDataSource.sync();
	
	}
	
}

function confirmRepository(){
	var validator = $("#purchaserepository-edit-item").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		alert("验证不通过，请检查表单");
	} else{
		if(projectId){
			requestDataItem.projectId = projectId;		
		}
		if(supplierId){
			requestDataItem.supplierId = supplierId;	
		}
		postAjaxRequest("/service/purcontract/repository/confirm?type=in", {models:kendo.stringify(requestDataItem)}, checkStatus);
	}
}

function cancelRepositoryWindow(){
	loadPage("repository_repository", null);
}

function cancelRepositoryOutWindow(){
	loadPage("repository_repositoryout", null);
}

function checkStatus() {
	if(redirectParams && redirectParams.type == "out"){
		loadPage("repository_repositoryout", null);
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
	
	var param = {"purchaseContractId": projectId, "purchaseOrderCode" : supplierId};
	
	postAjaxRequest(listEqUrl, param, loadContracts);
}

function loadContracts(data){
	
	if(data && data.data){
		requestDataItem.eqcostList = data.data;
		editRepository();
	}
}

function editRepository(data) {
	// 初始化空对象
	var dataItem = new model();
	if(data){
		$("#purchaserepository-div").hide();
//		if(data.eqcostList){
//			requestDataItem.eqcostList = data.eqcostList;
//		}
		requestDataItem = new model(data);
	}else{
		requestDataItem.inType="采购入库";
		requestDataItem.operatorName = user.userName;
		requestDataItem.operatorId = user.userName;
		$("#purchaserepository-div").show();
	}

	
	if(requestDataItem.eqcostList){
		var eqList = requestDataItem.eqcostList;
		if(requestDataItem.status == "已提交"){
			for(i=0; i<eqList.length; i++){
				eqList[i].leftCount = eqList[i].leftCount + eqList[i].eqcostApplyAmount;
				
			}
		}
	}
	if (requestDataItem) {
		requestDataItem = new model(requestDataItem);
	}
//	requestDataItem.eqcostList = eqList;
//	requestDataItem.inDate = "10/10/2013";
	requestDataItem.set("inDate", kendo.toString(requestDataItem.inDate, 'd'));
	requestDataItem.set("outDate", kendo.toString(requestDataItem.outDate, 'd'));
	kendo.bind($("#purchaserepository-edit-item"), requestDataItem);

	// 渲染成本编辑列表
	if(requestDataItem.eqcostList.length > 0){
		itemDataSource.data(requestDataItem.eqcostList);
	

	$("#purchasecontract-edit-item").show();
	$("#purchasecontract-select").hide();

		if (!$("#purchaserepository-edit-grid").data("kendoGrid")) {
			$("#purchaserepository-edit-grid").kendoGrid({
				dataSource : itemDataSource,
				columns : [  
				{
					field : "eqcostMaterialCode",
					title : "物料代码"
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
					field : "eqcostUnit",
					title : "单位"
	
				}, {
					field : "eqcostApplyAmount",
					title : eqcostApplyAmountLabel,
					attributes: { "style": "color:red"}
				},{
					field : "leftCount",
					title : leftCountLabel,
					attributes: { "style": "color:red"}
				}, {
					field : "contractCode",
					title : "销售合同编号"
				},{
					field : "purchaseOrderCode",
					title : "订单编号"
				},{
					field : "remark",
					title : "备注"
				}],
				scrollable : true,
				editable : true,
				resizable: true,
				width : "800px",
				sortable : true,
				save: function(e){
					if (e.values.eqcostApplyAmount) {					
						if(e.values.eqcostApplyAmount > e.model.leftCount){
							alert("最多可以入库" + e.model.leftCount);
							e.preventDefault();
						}
					}
				}
	
			});
		}
		
		if(redirectParams && redirectParams.page == "confirm"){
			var grid = $("#purchaserepository-edit-grid").data("kendoGrid");
			if(grid){
				grid.hideColumn("leftCount");
			}
			
			$("#orderCode").attr("required", "required");
		}
	}else{
		alert("无设备清单");
	}
}

function submitConfirmRepositoryOut(){
	var validator = $("#purchaserepository-edit-item").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		alert("验证不通过，请检查表单");
	} else{
		 postAjaxRequest("/service/purcontract/repositoryout/confirm?type=out", {models:kendo.stringify(requestDataItem)}, function(data){
			 loadPage("repository_repositoryout", null);
		 });
	}
}
