
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
    	eqcostsettlementAmount: { type: "number", validation: { min: 0} },
    	arrivalAmount: { type: "number", validation: {  min: 0} },
    	giveUp: { editable: false },
    	leftAmount: { editable: false  },
    	eqcostDeliveryType : {editable: false},
    	eqcostMemo: {}
    }
});


var project ;

var commonDataSource = new kendo.data.DataSource({
	  group: [
		      	{field:"salesContractCode"}
		      ],
	schema : {
		model : eqModel
	}
});


$(document).ready(function() {
	var deleteCommand  = undefined;
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
		$(".settlement-add").hide();
		$(".settlement-edit").show();
		
	}else{
		deleteCommand =  { command: "destroy", text: "删除", width: 90 };
	
	
		 project = $("#project").kendoComboBox({
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
	        	model.set("customer", dataItem.customer);
	        	model.set("applicationDepartment", dataItem.department);
	        	
	        	loadSettlement();
	        	
	        }
	    }).data("kendoComboBox");
	}

	if(popupParams){
		postAjaxRequest("/service/settlement/get", popupParams, editsettlement);
		disableAllInPoppup();
	} else if (redirectParams && redirectParams._id) {//Edit		
		postAjaxRequest("/service/settlement/get", {_id:redirectParams._id}, editsettlement);
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
		loadEqList(model.eqcostList);
	}
}

var supplierlist = new Array();
var bjList = new Array();
var shList = new Array();

function loadEqList(data){
	var eqList = data;
	if(data.data){
		 eqList = data.data;
	}
	supplierlist = new Array();
	bjList = new Array();
	shList = new Array();
	var emptyList = new Array();
    suppliersettlementDataSource.data(emptyList);
    shDataSource.data(emptyList);
    allsettlementDataSource.data(emptyList);
	commonDataSource.data(emptyList);
	bjDataSource.data(emptyList);
	$(".settlement-grid").hide();
	
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
			
			
			
			if(eqList[i].settlementType == "北京备货货架"){
				eqList[i].settlementTypeDisplay = "上海—北京库";
				bjList.push(eqList[i]);
			}else if(eqList[i].settlementType == "上海备货货架"){
				shList.push(eqList[i]);
				eqList[i].settlementTypeDisplay = "上海—上海库";
			}else if(eqList[i].settlementType == "直发现场"){
				eqList[i].settlementTypeDisplay = "直发现场";
				supplierlist.push(eqList[i]);
			}else{									
				if(eqList[i].settlementType == "上海—上海泰德库"){
					eqList[i].settlementTypeDisplay = "上海—上海泰德库";
					shList.push(eqList[i]);
				}else{
					eqList[i].settlementTypeDisplay = "上海—北京泰德库";
					bjList.push(eqList[i]);
				}									
			} 
		
		}
		
		var settlementType = new kendo.data.DataSource({
	
		});
		
		
		if(supplierlist.length >0){
			settlementType.add({ text: "直发现场" });
		}
		if(bjList.length >0){
			settlementType.add({ text: "上海—北京库" });
		}
		if(shList.length >0){
			settlementType.add({ text: "上海—上海库" });
		}
	
		var settlementDataKendo = $("#settlementType").data("kendoDropDownList");	
		
		if (settlementType.data().length > 0) {
//			if(!settlementDataKendo){};
			$("#settlementType").kendoDropDownList({
		        dataTextField: "text",
		        dataValueField: "text",
		        dataSource: settlementType,
		        optionLabel: "选择发货类型...",
		        change: function(e) {
		        	var dataItem = this.dataItem();
		        	if(dataItem.text=="选择发货类型..."){
			        	model.settlementType = undefined;    	
		        	}else{		        	
		        		model.settlementType = dataItem.text;   
		        	}
		        	updatesettlementGrid();
		        	$("#common-settlement").hide();
		        }
		    });
			$("#settlement-type").show();
			settlementDataKendo = $("#settlementType").data("kendoDropDownList");	
		}else{
			$("#settlement-type").hide();
		}


		//COMMON EQ LIST
		commonDataSource.data(bjList);

		for(var item in supplierlist){
			commonDataSource.add(supplierlist[item]);
		}
	
		for(var item in shList){
			commonDataSource.add(shList[item]);
		}
		
		
		settlementDataKendo = $("#settlementType").data("kendoDropDownList");	
		settlementDataKendo.value("");
		if(model.settlementType){
			settlementDataKendo.value(model.settlementType);
			updatesettlementGrid();
		}else{
			$("#common-settlement").show();
		}
	}
}

function updatesettlementGrid(){
	if(model.settlementType == "直发现场"){
		suppliersettlementDataSource.data(supplierlist);
		$("#supplier-settlement").show();
		$("#bj-settlement").hide();
		$("#sh-settlement").hide();
	}else if(model.settlementType == "上海—上海库" || model.settlementType == "上海—上海泰德库"){
		shDataSource.data(shList);
		$("#supplier-settlement").hide();
		$("#bj-settlement").hide();
		$("#sh-settlement").show();
	}else if(model.settlementType == "上海—北京库" || model.settlementType == "上海—北京泰德库"){
		bjDataSource.data(bjList);		
		$("#supplier-settlement").hide();
		$("#bj-settlement").show();
		$("#sh-settlement").hide();
	} 
	$("#common-settlement").hide();
}

function savesettlement(needCheck) {
	allsettlementDataSource.data([]);
	var data = new Array();
	$("#bjOutCode").attr("disabled",true);
	$("#shOutCode").attr("disabled",true);
	if(!model.settlementType){
		alert("请选择发货类型");
		return;
	}
	
    if (model.settlementType == "直发现场") {
		 data = suppliersettlementDataSource.data();
	} else if (model.settlementType == "上海—上海库")  {
		if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
			 $("#shOutCode").removeAttr("disabled",true);
		}
		 data = shDataSource.data();
	}else if (model.settlementType == "上海—北京库")  {
		if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
			 $("#bjOutCode").removeAttr("disabled",true);
		}
		 data = bjDataSource.data();
	}
	
	
	if (data.length == 0) {
		alert("无任何设备清单");
		return;
	}
	var validator = $("#addsettlement").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		alert("验证不通过，请检查表单");
	} else {


		for(i=0; i< data.length; i++){
			allsettlementDataSource.add(data[i]);				
			if(data[i].leftAmount <  data[i].eqcostsettlementAmount && needCheck){
				alert("请检查设备可发货数量");
				return;
			}
		}

		model.set("eqcostList", allsettlementDataSource.data());
		
		if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
			postAjaxRequest("/service/settlement/record", {models:kendo.stringify(model)}, checkStatus);
		}else if(redirectParams && redirectParams.type && redirectParams.type == "submit") {
			postAjaxRequest("/service/settlement/submit", {models:kendo.stringify(model)}, checkStatus);
		}else{
			postAjaxRequest("/service/settlement/create", {models:kendo.stringify(model)}, checkStatus);
		}
	
		

	}
}


function approve_settlement() {
	var url =crudServiceBaseUrl + "/settlement/approve";
	if(model.status == "已初审"){
		 url =crudServiceBaseUrl + "/settlement/finalapprove";
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
	var url =crudServiceBaseUrl + "/settlement/reject";
	if(model.status == "已初审"){
		 url =crudServiceBaseUrl + "/settlement/finalreject";
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
	if(!redirectParams){
		redirectParams = {};
	}
	redirectParams.type = "submit";
	savesettlement(true);
}

function cancle() {
	loadPage("execution_settlement");
}