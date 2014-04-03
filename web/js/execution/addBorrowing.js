var grid, inSalesContract, model;
var inProjectId;
var eqDataSource, crudServiceBaseUrl = "../service";

var borrowing = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	borrowCode: {},
    	inProjectId: {},
    	inProjectCode: {},
    	inProjectName: {},
    	inProjectManagerId: {},
    	inScId: {},
    	inSalesContractCode: {},
    	inSalesContractType: {},
    	inProjectCustomer: {},
    	outProjectId: {},
    	outScId: {},
    	eqcostList: {}
    	
    }
});

var eqModel = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	eqcostNo: { editable: false },
    	eqcostMaterialCode: { editable: false },
    	eqcostProductName: { editable: false },
    	eqcostProductType: { editable: false },
    	eqcostCanBorrowAmount: { editable: false },
    	eqcostBorrowAmount: { editable: true , type: "number", validation: { required: true, min: 0} },
    	eqcostUnit: { editable: false },
    	eqcostBrand: { editable: false },
    	eqcostMemo: { editable: false },
    	shipType: { editable: false },
    	eqcostShipAmount: { editable: false },
    	projectName: { editable: false },
    	contractCode: { editable: false }
    }
});


var scList = new Array();
var deleteCommand  = {}
$(document).ready(function() {
	
	
	// 选项卡
    $("#tabstrip").kendoTabStrip({
        animation:  {
            open: {
                effects: "fadeIn"
            }
        }
    });
	

    $("#addBorrowing button").hide();
    $(".cancel-button").show();
    if(popupParams || redirectParams){
		$(".borrowing-add").hide();	
		
		if(redirectParams){
			if(redirectParams.page=="confirmborrowing"){
				$(".borrowing-confirm").show();	
			}else if(redirectParams.page=="returnborrowing"){
				$(".submit-borrowing-back").show();	
			}else if(redirectParams.page=="confirmreturnborrowing"){
				$(".borrowing-back-approve").show();	
			}else if(redirectParams.page=="approve"){
				$(".borrowing-approve").show();	
			}else if(redirectParams._id){
				$(".borrowing-management").show();	
			}else{
				$(".borrowing-add").show();	
			}
		}else{
			
		}
	} else {
		$(".borrowing-add").show();	
		//添加表单绑定一个空的 Model
		model = new borrowing();
		kendo.bind($("#addBorrowing"), model);
		$(".borrowing-edit").hide();	
		$(".borrowing-management").show();	
	    
		var inprojects = $("#in-projects").kendoComboBox({
	        placeholder: "Select project",
	        dataTextField: "projectName",
	        dataValueField: "_id",
	        filter: "contains",
	        suggest: true,
	        dataSource: new kendo.data.DataSource({
	            transport: {
	                read: {
	                    url: "../service/borrowing/list/project",
	                    dataType: "jsonp",
	    	            data: {
	    	            	type: "in"
	    	            },
	    	            data: {
	    	            	pageSize: 0
	    	            }
	                }
	            },
	            schema: {
	            	total: "total",
	            	data: "data"
	            }
	        }),
	        change: function(e) {
	        	var dataItem = this.dataItem();
	        	if (dataItem) {
	        		model.set("inProjectCustomerId", dataItem.customerId);
	        		model.set("inProjectCode", dataItem.projectCode);
	        		model.set("inProjectManagerId", dataItem.projectManagerId);
	        		model.set("inProjectName", dataItem.projectName);
	        		model.set("applicationDepartment", dataItem.department);
	        		model.set("projectManagerName", dataItem.projectManagerName);
	        		scList = dataItem.scList;
		        	inSalesContract.value(null);
		        	inProjectId = this.value();
		        	inSalesContract.dataSource.data(scList);
	        	}
	        }
	    }).data("kendoComboBox");
		
		inSalesContract = $("#inSalesContract").kendoComboBox({
			autoBind: false,
			dataSource: new kendo.data.DataSource({
	        }),
	        placeholder: "销售合同编号",
	        dataTextField: "contractCode",
	        dataValueField: "_id",
	        filter: "contains",
	        suggest: true,
	        change: function(e) {
	        	var dataItem = this.dataItem();
	        	if (dataItem) {
			        	model.set("inSalesContractCode", dataItem.contractCode);
			        	model.set("inSalesContractType", dataItem.contractType);
			        	model.set("inScId", this.value());
			        	
			        	var scId = this.value();
			        	
			        	eqDataSource = new kendo.data.DataSource({
			        	    transport: {
			        	        read: {
			        	            url: crudServiceBaseUrl + "/borrowing/eqlist",
			        	            dataType: "jsonp",
			        	            data: {
			        	            	inScId: scId,
			        	            	type: 1
			        	            }
			        	        }
			        	    },
			        	    batch: true,
			        	    schema: {
			        	        model: eqModel,
			        	        total: "total",
			                	data: "data"
			        	    }
			        	});
		        	
			        	grid.setDataSource(eqDataSource);
	        		}
	        	}
			}).data("kendoComboBox");
	
		grid = $("#equipments-grid").kendoGrid({
		    toolbar: [ { name: "cancel", text: "撤销编辑" } ],
		    columns: [
		        
		        { field: "eqcostMaterialCode", title: "物料代码" },
		        { field: "eqcostProductName", title: "产品名称" },
		        { field: "eqcostProductType", title: "规格型号" },
		        { field: "eqcostUnit", title: "单位" },
		        { field: "eqcostCanBorrowAmount", title: "未到货数量" },
		        { field: "eqcostBrand", title: "品牌" },
		        { field: "eqcostMemo", title: "备注" },
		        { command: "destroy", title: "&nbsp;", width: 90 }],
		    editable: true,
		    resizable: true,
		    sortable : true
		}).data("kendoGrid");
	    
	}
	
	
	if(popupParams){
		postAjaxRequest("/service/borrowing/get", popupParams, edit);
		disableAllInPoppup();
	} else if (redirectParams) {//Edit
		postAjaxRequest("/service/borrowing/get", redirectParams, edit);
	} else {//Add
		//添加表单绑定一个空的 Model
		deleteCommand =  { command: "destroy", title: "&nbsp;", width: 90 };
		model = new borrowing();
		model.borrowType = "借货调拨";
		kendo.bind($("#addBorrowing"), model);
		model.set("type", 1);
	}
});

function searchBorrowingEqCost(){
	
	$(".borrowing-info").hide();
	
	model.eqcostList = grid.dataSource.data();
	postAjaxRequest("/service/borrowing/search", {models:kendo.stringify(model)}, function(data){
		eqModel.fields.eqcostBorrowAmount.editable = true;
		if(data.data && data.data.length > 0){
			$(".borrowing-info").show();
			initBorrowGrid(data.data)
		}else{
			alert("无可借货清单");
		}
	});
}

function initBorrowGrid(eqList){

	var canBorrowingDataSource = new kendo.data.DataSource({
    	data: eqList,
    	group: {
    		field:"contractCode"
    	},
    	schema: {
	        model: eqModel
	    }
    });
	
	for(index in eqList){
		
		if(eqList[index].eqcostBorrowAmount == undefined){
			eqList[index].eqcostBorrowAmount = 0;
		}
	}
	
	$("#equipments-find-grid").kendoGrid({
	    toolbar: [ { name: "cancel", text: "撤销编辑" } ],
	    columns: [
	        
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "shipType", title: "货物来源" },
	        { field: "eqcostShipAmount", title: "可借数量",  attributes: { "style": "color:red"} },
	        { field: "eqcostBorrowAmount", title: "借货数量",  attributes: { "style": "color:red"} },
	        { field: "projectName", title: "项目名" },
	        { field: "contractCode", title: "销售合同" },
	        deleteCommand],
	    editable: true,
	    resizable: true,
	    sortable : true,
	    dataSource: canBorrowingDataSource
	});

	
}

function edit(data) {
	model = new borrowing(data);

	if (model.inProjectId) {
		inProjectId = model.inProjectId;
	}
	
	if (model.outProjectId) {
		outProjectId = model.outProjectId;
	}
	
	kendo.bind($("#addBorrowing"), model);
	initBorrowGrid(model.eqcostList);
	
}



function saveBorrowing() {
	
	var validator = $("#addBorrowing").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		return;
    } else {
    	var grid = $("#equipments-find-grid").data("kendoGrid");
    	if(grid){
    		var data = grid.dataSource.data();
	
    		if (data.length > 0) {
    			model.set("eqcostList", data);
    			model.set("status", "已提交");
    			postAjaxRequest("/service/borrowing/update", {models:kendo.stringify(model)}, reloadPage);
    	        
    		}else{
    			alert("无可借货清单")
    		}
		
    	}else{
    		alert("无可借货清单")
    	}
    }
}

function confirmBorrowing(){
	postAjaxRequest("/service/borrowing/confirm", {_id:model._id}, reloadPage);
}

function confirmBorrowingBack(){
	postAjaxRequest("/service/borrowing/return/confirm", {_id:model._id}, reloadPage);
}

function approveBorrowing(){
	postAjaxRequest("/service/borrowing/approve", {_id:model._id}, reloadPage);
}


function rejectBorrowing(){
	postAjaxRequest("/service/borrowing/reject", {_id:model._id}, reloadPage);
}

function submitBorrowingBack(){
	postAjaxRequest("/service/borrowing/return/submit", {_id:model._id}, reloadPage);
}

function reloadPage() {
	loadPage("execution_borrowing");
}