
var listProjectUrl = "/service/purcontract/repository/contract/list";
var updateUrl = "/service/purcontract/repository/update?type=in";
var createUrl = "/service/purcontract/repository/add?type=in";
var listEqUrl = "/service/purcontract/get/byproject_supplier";
var loadUrl = "/service/purcontract/repository/get";
var eqcostApplyAmountLabel = "入库数量";
var leftCountLabel = "可入库数量";

if(redirectParams && redirectParams.type == "out"){
	listProjectUrl = "/service/purcontract/repository/contract/list?type=out";
	updateUrl = "/service/purcontract/repository/update?type=out";
	createUrl = "/service/purcontract/repository/add?type=out";
	listEqUrl = "/service/purcontract/get/byproject_supplier?type=out";
	eqcostApplyAmountLabel = "出库数量";
	leftCountLabel = "可出库数量";
	if(redirectParams.page == "confirm"){
		$("#confirmRepositoryOut").show();
	}else{
		$("#saveRepos").show();
	}

}

var commonFileds = {
		eqcostAvailableAmount : {
			type : "number"
		},
		pbPlanDate:{type:"date"},
		pbDepartment:{
			
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
				requestDataItem.projectCode = this.dataItem().projectCode;
			},
			dataBound : function(e){	
				requestDataItem.projectName = this.dataItem().projectName;
				requestDataItem.projectCode = this.dataItem().projectCode;
				updateSupplier();
			}
		});
	
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
	
	
	
	$("#storeHouse").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择库房...",
		dataSource : storeHouseType
	});
	
	if (redirectParams && redirectParams._id) {
		postAjaxRequest(loadUrl, redirectParams, edit);
	}else if(popupParams){
		postAjaxRequest(loadUrl, popupParams, edit);
		disableAllInPoppup();
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


var repFields = {
		eqcostBrand : {
			editable : false
		},
		salesContractCode : {
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
			requestDataItem.supplier = supplierId;	
		}
		
		if(requestDataItem.operator && requestDataItem.operator._id){
			requestDataItem.operator = requestDataItem.operator._id;
		}
		
	
		// 同步数据
		itemDataSource.sync();
	
	}
	
}

function confirmRepository(){
	if(projectId){
		requestDataItem.projectId = projectId;		
	}
	if(supplierId){
		requestDataItem.supplier = supplierId;	
	}
	postAjaxRequest("/service/purcontract/repository/approve", {models:kendo.stringify(requestDataItem)}, checkStatus);
}

function cancel(){
	loadPage("repository_repository", null);
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
	
	var param = {"projectId": projectId, "supplier" : supplierId};
	
	postAjaxRequest(listEqUrl, param, loadContracts);
}

function loadContracts(data){
	
	if(data && data.data){
		requestDataItem.eqcostList = data.data;
		edit();
	}
}

function edit(data) {
	// 初始化空对象
	var dataItem = new model();
	if(data){
		$("#purchaserepository-div").hide();
		requestDataItem = data;
	    
	}else{
		requestDataItem.inType="采购入库";
		requestDataItem.operatorName = user.userName;
		requestDataItem.operatorId = user.userName;
		$("#purchaserepository-div").show();
	}
	var eqList = requestDataItem.eqcostList;
	if(requestDataItem.status == "已提交"){
		for(i=0; i<eqList.length; i++){
			eqList[i].leftCount = eqList[i].leftCount + eqList[i].eqcostApplyAmount;
			
		}
	}
	if (requestDataItem) {
		requestDataItem = new model(requestDataItem);

	}
	
//	requestDataItem.inDate = "10/10/2013";
	requestDataItem.set("inDate", kendo.toString(requestDataItem.inDate, 'd'));
	kendo.bind($("#purchaserepository-edit-item"), requestDataItem);

	// 渲染成本编辑列表
	if(requestDataItem.eqcostList.length > 0){
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
				}, 
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
					field : "salesContractCode",
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
	}else{
		alert("无可入库清单");
	}
}

function submitConfirmRepositoryOut(){
	 postAjaxRequest("/service/purcontract/repository/confirm?type=out", {models:kendo.stringify(requestDataItem)}, function(data){
		 loadPage("repository_repositoryout", null);
	 });
}
