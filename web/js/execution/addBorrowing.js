var grid, inSalesContract, outSalesContract, model;
var inProjectId, outProjectId;
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
    	eqcostBorrowAmount: { type: "number", validation: { required: true, min: 1} },
    	eqcostUnit: { editable: false },
    	eqcostBrand: { editable: false },
    	eqcostMemo: { editable: false }
    }
});


$(document).ready(function() {
	
	// 选项卡
    $("#tabstrip").kendoTabStrip({
        animation:  {
            open: {
                effects: "fadeIn"
            }
        }
    });
	

//    $("button").hide();
    $(".cancel-button").show();
    if(popupParams || redirectParams){
		$(".borrowing-add").hide();	
		
		if(redirectParams){
			if(redirectParams.page=="approve"){
				$(".borrowing-approve").show();	
			}else{
				$(".borrowing-management").show();	
			}
		}else{
			
		}
	} else {
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
	        		
		        	inSalesContract.value(null);
		        	inProjectId = this.value();
		        	inSalesContract.dataSource.read();
	        	}
	        }
	    }).data("kendoComboBox");
		
		inSalesContract = $("#inSalesContract").kendoComboBox({
			autoBind: false,
			dataSource: new kendo.data.DataSource({
	            transport: {
	                read: {
	                    url: crudServiceBaseUrl + "/borrowing/sclist",
	                    dataType: "jsonp",
	    	            data: {
	    	            	projectId: function() {
	                            return inProjectId;
	                        }
	    	            }
	                }
	            },
	            schema: {
	            	total: "total",
	            	data: "data"
	            }
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
	
	}
	
	grid = $("#equipments-grid").kendoGrid({
	    toolbar: [ { name: "cancel", text: "撤销编辑" } ],
	    columns: [
	        
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostUnit", title: "单位" },
	        { field: "eqcostCanBorrowAmount", title: "可借数量" },
	        { field: "eqcostBorrowAmount", title: "借货数量" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostMemo", title: "备注" },
	        { command: "destroy", title: "&nbsp;", width: 90 }],
	    editable: true,
	    resizable: true,
	    sortable : true
	}).data("kendoGrid");
    
	if(popupParams){
		postAjaxRequest("/service/borrowing/get", popupParams, edit);
		disableAllInPoppup();
	} else if (redirectParams) {//Edit
		postAjaxRequest("/service/borrowing/get", redirectParams, edit);
	} else {//Add
		//添加表单绑定一个空的 Model
		model = new borrowing();
		kendo.bind($("#addBorrowing"), model);
		model.set("type", 1);
	}
});

function searchBorrowingEqCost(){
	postAjaxRequest("/service/borrowing/search", {models:kendo.stringify(model)}, function(data){
		
	});
}
function searchEqCost(){
	var outprojects = $("#out-projects").kendoComboBox({
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
	        	outSalesContract.value(null);
	        	model.set("outProjectCustomerId", dataItem.customerId);
        		model.set("outProjectCode", dataItem.projectCode);
        		model.set("outProjectManagerId", dataItem.projectManagerId);
        		model.set("outProjectName", dataItem.projectName);
	        	outProjectId = this.value();
	        	outSalesContract.dataSource.read();
	        	outSalesContract.readonly(false);
        	}
        }
    }).data("kendoComboBox");
	
	outSalesContract = $("#outSalesContract").kendoComboBox({
		autoBind: false,
		dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: crudServiceBaseUrl + "/borrowing/sclist",
                    dataType: "jsonp",
    	            data: {
    	            	projectId: function() {
                            return outProjectId;
                        }
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
		        	model.set("outSalesContractCode", dataItem.contractCode);
		        	model.set("outScId", this.value());
        	}
        },
        placeholder: "销售合同编号",
        dataTextField: "contractCode",
        dataValueField: "_id",
        filter: "contains",
        suggest: true
    }).data("kendoComboBox");
	
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
	
	eqDataSource = new kendo.data.DataSource({
	    data: model.eqcostList,
	    batch: true,
	    schema: {
	        model: eqModel
	    }
	});
	
	grid.setDataSource(eqDataSource);
}


function saveDraftBorrowing(){
	
}

function saveBorrowing() {
	
	var validator = $("#addBorrowing").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		return;
    } else {
    	if (eqDataSource) {
    		var data = eqDataSource.data();
    		if (data.length > 0) {
    			model.set("eqcostList", data);
    			model.set("status", "已提交");
    			console.log(model);
    			postAjaxRequest("/service/borrowing/update", {models:kendo.stringify(model)}, reloadPage);
    	        
    		}
		}
    }
}

function approveBorrowing(){
	postAjaxRequest("/service/borrowing/approve", {_id:model._id}, reloadPage);
}

function rejectBorrowing(){
	postAjaxRequest("/service/borrowing/reject", {_id:model._id}, reloadPage);
}


function reloadPage() {
	loadPage("execution_borrowing");
}