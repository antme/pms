
var settlement = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	settlementCode: {},
    	applicationDepartment: {},
    	projectId: {},
    	projectName: {},
    	customerId: {},
    	customerName: {},
    	settlementDate: {
    		type:"date"
    	},
    	eqcostList: {},
    	status :{
    		
    	}
    }
});
var model = new settlement();
var eqModel = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	eqcostNo: { editable: false },
    	eqcostMaterialCode: { editable: false },
    	eqcostProductName: { editable: false },
    	eqcostProductType: { editable: false },
    	eqcostUnit: { editable: false },
    	eqcostBrand: { editable: false },
    	leftAmount: { editable: false },
    	settlementAmount: { type: "number", validation: { min: 0} },
    	eqcostDeliveryType : {editable: false},
    	eqcostMemo: {}
    }
});


var project ;

var commonDataSource = new kendo.data.DataSource({
	  group: [
		      	{field:"contractCode"}
		      ],
	schema : {
		model : eqModel
	}
});

var deleteCommand = {};
$(document).ready(function() {
	$("#project-select").hide();
	if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
		//do nothing
		$(".settlement-edit").show();
		$(".settlement-add").hide();
	}else if(redirectParams && redirectParams.type && redirectParams.type == "approve"){
		//do nothing
		$(".settlement-add").hide();
		$(".settlement-edit").show();
	}else if(popupParams){
		//do nothing
		$(".settlement-add").hide();
		$(".settlement-edit").show();
	}else if(redirectParams && redirectParams._id){
		//do nothing
		deleteCommand =  { command: "destroy", text: "删除", width: 90 };
		$(".settlement-add").hide();
		$(".settlement-edit").show();
		
	}else{
		deleteCommand =  { command: "destroy", text: "删除", width: 90 };
		$("#project-select").show();
	
		 project = $("#projectId").kendoComboBox({
	        placeholder: "Select project",
	        dataTextField: "projectName",
	        dataValueField: "_id",
	        filter: "contains",
	        suggest: true,
	        dataSource: new kendo.data.DataSource({
	            transport: {
	                read: {
	                    url: "../service/arrivalNotice/project/list",
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
	        	model.set("projectName", dataItem.projectName);
	        	model.set("projectId", dataItem._id);
	        	model.set("customerName", dataItem.customerName);
	        	model.set("applicationDepartment", dataItem.department);
	        	model.set("projectManagerName", dataItem.projectManagerName);
	        	model.set("projectManagerId", dataItem.projectManagerId);
	        	kendo.bind($("#addsettlement"),model);
	        	loadSettlement();
	        	
	        }
	    }).data("kendoComboBox");
	}

	if(popupParams){
		postAjaxRequest("/service/ship/settlement/get", popupParams, editsettlement);
		disableAllInPoppup();
	} else if (redirectParams && redirectParams._id) {//Edit		
		postAjaxRequest("/service/ship/settlement/get", {_id:redirectParams._id}, editsettlement);
	} else {//Add
		editsettlement();
	}
});


function loadSettlement(){
	 postAjaxRequest("/service/ship/settlement/eqlist", {projectId:model.projectId}, loadEqList);
}


function editsettlement(data) {

	if(data){
		model = new settlement(data);
		
		if($("#project").data("kendoComboBox")){
			$("#project").data("kendoComboBox").enable(false);
		}
		
		if($("#salesContract").data("kendoComboBox")){
			$("#salesContract").data("kendoComboBox").enable(false);
		}
		
	}
	setDate(model, "deliveryStartDate", model.deliveryStartDate);

	kendo.bind($("#addsettlement"), model);
	
	if(model.eqcostList){
		var eqcostList = model.eqcostList;
		if(model.status=="申请中"){
			for(index in eqcostList){
				
				if(eqcostList[index].settlementAmount){
					eqcostList[index].leftAmount = eqcostList[index].leftAmount + eqcostList[index].settlementAmount;
				}
				
			}
		}
		loadEqList(eqcostList);
	}
}

var supplierlist = new Array();

function loadEqList(data){
	var eqList = data;
	if(data.data){
		 eqList = data.data;
	}
	var emptyList = new Array();
	commonDataSource.data(emptyList);
	
	if(eqList && eqList.length ==0){
		$(".settlement-button").hide();
		alert("此销售合同没有可发货设备！");	
	}else{
	
		if(popupParams){
			disableAllInPoppup();
		}else{
			$(".settlement-button").show();
			
			if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
				disableAllInPoppup();
				$("#save-button").hide();
				$("#submit-button").hide();
				$("#approve-button").hide();
				$("#reject-button").hide();
			}else if(redirectParams && redirectParams.type && redirectParams.type == "approve"){
				disableAllInPoppup();
				$("#save-button").hide();
				$("#submit-button").hide();
				$("#confirm-button").hide();
			}else{
				$("#confirm-button").hide();
				$("#approve-button").hide();
				$("#reject-button").hide();
			}
			
			
		}

		for(i=0; i<eqList.length; i++){
			if(!eqList[i].arrivalAmount || eqList[i].arrivalAmount==0){
				eqList[i].arrivalAmount = eqList[i].eqcostsettlementAmount;
			}
			
			if(!eqList[i].actureAmount){
				eqList[i].actureAmount = eqList[i].eqcostsettlementAmount;
			}
			

		
		}
		
		
	

		//COMMON EQ LIST
		commonDataSource.data(eqList);

		$("#common-settlement-grid").kendoGrid({
			dataSource : commonDataSource,
		    columns: [
		       
		        { field: "contractCode", title: "销售合同" },
		        { field: "eqcostMaterialCode", title: "物料代码" },
		        { field: "eqcostProductName", title: "产品名称" },
		        { field: "eqcostProductType", title: "规格型号" },
		        { field: "eqcostBrand", title: "品牌" },
		        { field: "eqcostUnit", title: "单位" },
		    	
		        
		        { field: "leftAmount", title: "未发货数量" , attributes: { "style": "color:red"}}
		        ,{ field: "settlementAmount", title: "去除数量" , attributes: { "style": "color:red"}},{
					field : "shipType",
					title : "来源"
				},	        
		        { field: "eqcostMemo", title: "备注" },
		        deleteCommand
		        ],
		    editable: true,
		    groupable : true,
		    resizable: true,
		    sortable : true,
		    save : function(e){
		    	if(e.values.settlementAmount > e.model.leftAmount){
					alert("最多可以消除" + e.model.leftAmount);
					e.preventDefault();
				}else{
			    	var grid = $("#common-settlement-grid").data("kendoGrid");
			    	grid.refresh();
				}
		    }
		});
		
		
	
	}
}


function savesettlement(isDraft) {

	   if(isDraft){
		   model.set("status", "草稿");
	   }else{
		   model.set("status", "申请中");
	   }
		model.set("eqcostList", commonDataSource.data());
	
	   postAjaxRequest("/service/ship/settlement/add", {models:kendo.stringify(model)}, reloadPage);
		

}


function approve_settlement() {
	var url = "/service/ship/settlement/approve";
	if(model.status == "已初审"){
		 url = "/service/ship/settlement/finalapprove";
	}
	var param = {
			_id : model._id
		};
	postAjaxRequest(url, param, function(response) {
		alert("批准成功");
		 loadPage("execution_settlement");
	});

}

function reject_settlement() {
	var url = "/service/ship/settlement/reject";
	if(model.status == "已初审"){
		 url = "/service/ship/settlement/finalreject";
	}
	var param = {
		_id : model._id
	};
	postAjaxRequest(url, param, function(response) {
		alert("拒绝成功");
		 loadPage("execution_settlement");
	});

}


function submitsettlement(){
	model.set("status", "申请中");
	savesettlement(true);
}

function reloadPage() {
	loadPage("execution_settlement");
}