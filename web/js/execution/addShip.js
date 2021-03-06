var bjDataSource, crudServiceBaseUrl = "../service";

var ship = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	shipCode: {},
    	applicationDepartment: {},
    	scId: {},
    	contractCode: {},
    	contractType: {},
    	projectId: {},
    	projectName: {},
    	customer: {},
    	deliveryContact: {},
    	deliveryContactWay: {},
    	deliveryUnit: {},
    	deliveryAddress: {},
    	deliveryStartDate: {
    		type:"date"
    	},
    	deliveryEndDate: {
    		type:"date"
    	},
    	deliveryRequirements: {},
    	otherDeliveryRequirements: {},
    	eqcostList: {},
    	shipType: {},
    	status :{
    		
    	}
    }
});
var model = new ship();
var eqModel = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	eqcostNo: { editable: false },
    	eqcostMaterialCode: { editable: false },
    	eqcostProductName: { editable: false },
    	eqcostProductType: { editable: false },
    	eqcostUnit: { editable: false },
    	eqcostBrand: { editable: false },
    	eqcostShipAmount: { type: "number", validation: { min: 0} },
    	arrivalAmount: { type: "number", validation: {  min: 0} },
    	giveUp: { editable: false },
    	leftAmount: { editable: false  },
    	eqcostDeliveryType : {editable: false},
    	eqcostMemo: {}
    }
});


var project ;
var salesContract;
bjDataSource = new kendo.data.DataSource({
    group: [
    	{field:"shipTypeDisplay"}
    ],
	schema : {
		model : eqModel
	}
});

var supplierShipDataSource = new kendo.data.DataSource({
	group : [ {
		field : "purchaseOrderCode"
	} ],
	schema : {
		model : eqModel
	}
});


var commonDataSource = new kendo.data.DataSource({
	  group: [
		      	{field:"shipTypeDisplay"}
		      ],
	schema : {
		model : eqModel
	}
});

var shDataSource = new kendo.data.DataSource({
	  group: [
	      	{field:"shipTypeDisplay"}
	      ],
	 schema : {
		model : eqModel
	 }
});

var allShipDataSource = new kendo.data.DataSource({

});

var scList = new Array();

$(document).ready(function() {
	var deleteCommand  = undefined;
	if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
		//do nothing
		$(".ship-edit").show();
		$(".ship-add").hide();
	}else if(redirectParams && redirectParams.type && redirectParams.type == "approve"){
		//do nothing
		$(".ship-add").hide();
		$(".ship-edit").show();
	}else if(popupParams){
		//do nothing
		$(".ship-add").hide();
		$(".ship-edit").show();
	}else if(redirectParams && redirectParams._id){
		//do nothing
		$(".ship-add").hide();
		$(".ship-edit").show();
		
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
	        	model.set("applicationDepartment", dataItem.applicationDepartment);
	        	model.set("scId", "");
	            model.set("customerName", dataItem.customerName);
	            model.set("customerId", dataItem.customerId);
	            scList = dataItem.scList;
	            
	            postAjaxRequest("/service/customer/get", {_id:dataItem.customerId}, function(data){
	            	
	                model.set("deliveryContact", data.contact);
		            model.set("deliveryContactWay", data.phone);
		            model.set("deliveryUnit", data.address);
		            
	            	loadSC(scList);
	            	
	            });
	            
	            
	        	
	        	
	        }, 
	        dataBound : function(e){
	        	loadSC();
	        }
	    }).data("kendoComboBox");
	}
	
	
	$("#deliveryRequirements").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "text",
        optionLabel : "选择货运要求...",
        dataSource: deliveryRequirementsItems
    });
	
	$("#bj-ship-grid").kendoGrid({
		dataSource : bjDataSource,
	    columns: [
	       
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostUnit", title: "单位" },
	    	{ field: "eqcostBasePrice", title: "标准成本价",	
				template : function(dataItem){
					return percentToFixed(dataItem.eqcostBasePrice);
				}
			},
			{ field: "eqcostLastBasePrice",title : "最终成本价",	
				template : function(dataItem){
					return percentToFixed(dataItem.eqcostLastBasePrice);
				}
			},
	        { field: "eqcostShipAmount", title: "发货数" , attributes: { "style": "color:red"}},
	        { field: "leftAmount", title: "可发货数量" , attributes: { "style": "color:red"}},
	        { 
	        	field: "shipTypeDisplay", 
	        	title: "发货类型" ,
				groupHeaderTemplate: function(dataItem){														
					return dataItem.value;
				}
	        		
	        },{
				field : "shipType",
				title : "来源"
			},
			 {
				field : "eqcostDeliveryType",
				title : "物流类别"
			},	        
	        { field: "eqcostMemo", title: "备注" },
	        deleteCommand
	        ],
	    editable: true,
	    groupable : true,
	    resizable: true,
	    sortable : true,
	    save : function(e){
	    	if(e.values.eqcostShipAmount > e.model.leftAmount){
				alert("最多可以申请" + e.model.leftAmount);
				e.preventDefault();
			}else{
		    	var grid = $("#bj-ship-grid").data("kendoGrid");
		    	grid.refresh();
			}
	    }
	});
	
	
	$("#supplier-ship-grid").kendoGrid({
		dataSource : supplierShipDataSource,
	    columns: [
	       
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostUnit", title: "单位" },
	        { field: "eqcostLastBasePrice",title : "最终成本价",	
				template : function(dataItem){
					return percentToFixed(dataItem.eqcostLastBasePrice);
				}
			},
	        { field: "eqcostShipAmount", title: "发货数" , attributes: { "style": "color:red"}},
	        { field: "leftAmount", title: "可发货数量" , attributes: { "style": "color:red"}},
	       
			 {
				field : "eqcostDeliveryType",
				title : "物流类别"
			},	        
	        { field: "eqcostMemo", title: "备注" },
	        { 
	        	field: "purchaseOrderCode", 
	        	title: "采购订单" ,
				groupHeaderTemplate: function(dataItem){														
					return dataItem.value;
				}
	        		
	        },
	        deleteCommand
	        ],
	    editable: true,
	    sortable : true,
	    resizable: true,
	    save : function(e){
	    	if(e.values.actureAmount && model.status!="已批准"){
				alert("实际发货数只能在发货审批后填写");
				e.preventDefault();
			}else if(e.values.actureAmount  > e.model.eqcostShipAmount){
				alert("实际发货数不能大于发货数");
				e.preventDefault();
			}else if(e.values.eqcostShipAmount > e.model.leftAmount){
				alert("最多可以申请" + e.model.leftAmount);
				e.preventDefault();
			}else{
		    	var grid = $("#supplier-ship-grid").data("kendoGrid");
		    	grid.refresh();
			}
	    }
	});
	
	
	$("#sh-ship-grid").kendoGrid({
		dataSource : shDataSource,
	    columns: [
	        
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostUnit", title: "单位" },
	    	{ field: "eqcostBasePrice", title: "标准成本价",	
				template : function(dataItem){
					return percentToFixed(dataItem.eqcostBasePrice);
				}
			},
			{ field: "eqcostLastBasePrice",title : "最终成本价",	
				template : function(dataItem){
					return percentToFixed(dataItem.eqcostLastBasePrice);
				}
			},
	        { field: "eqcostShipAmount", title: "发货数", attributes: { "style": "color:red"}},
	        { field: "leftAmount", title: "可发货数量" , attributes: { "style": "color:red"}},
			{
				field : "shipTypeDisplay",
				title : "发货类型"
			},{
				field : "shipType",
				title : "来源"
			},	        
	        { field: "eqcostMemo", title: "备注" },
	        deleteCommand
	        ],
	        editable: true,
		    groupable : true,
		    sortable : true,
		    resizable: true,
	        save : function(e){
	    	if(e.values.eqcostShipAmount > e.model.leftAmount){
				alert("最多可以申请" + e.model.leftAmount);
				e.preventDefault();
			}else{
		    	var grid = $("#sh-ship-grid").data("kendoGrid");
		    	grid.refresh();
			}
	    }
	});
	

	$("#common-ship-grid").kendoGrid({
		dataSource : commonDataSource,
	    columns: [
	       
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostUnit", title: "单位" },
	        { field: "eqcostShipAmount", title: "发货数", attributes: { "style": "color:red"}},
	        { field: "leftAmount", title: "可发货数量" , attributes: { "style": "color:red"}},
			{
				field : "shipTypeDisplay",
				title : "发货类型"
			},{
				field : "shipType",
				title : "来源"
			},	        
	        { field: "eqcostMemo", title: "备注" }],
	        editable: false,
		    groupable : true,
		    resizable: true,
		    sortable : true
	    
	});

	if(popupParams){
		postAjaxRequest("/service/ship/get", popupParams, editShip);
		disableAllInPoppup();
	} else if (redirectParams && redirectParams._id) {//Edit		
		postAjaxRequest("/service/ship/get", {_id:redirectParams._id}, editShip);
	} else {//Add
		editShip();
	}
});


function loadSC(scList){
	salesContract = $("#salesContract").kendoComboBox({
		autoBind: false,
        placeholder: "销售合同编号",
        dataTextField: "contractCode",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        dataSource: new kendo.data.DataSource({
        	data:scList
        }),
        change: function(e) {
        	var dataItem = this.dataItem();
       
            model.set("contractCode", dataItem.contractCode);
            model.set("contractType", dataItem.contractType);
            model.shipType = undefined;
   
            postAjaxRequest("/service/ship/eqlist", {scId:salesContract.value(), projectId:model.projectId}, loadEqList);
		
        }
    }).data("kendoComboBox");


}
function giveUpDropDownEditor(container, options) {
	var giveUpItems = [ "是", "否" ];
	$('<input data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoDropDownList({
        dataSource: giveUpItems
    });
}

function editShip(data) {

	if(data){
		model = new ship(data);
		
		if($("#project").data("kendoComboBox")){
			$("#project").data("kendoComboBox").enable(false);
		}
		
		if($("#salesContract").data("kendoComboBox")){
			$("#salesContract").data("kendoComboBox").enable(false);
		}
		
	}
	setDate(model, "deliveryStartDate", model.deliveryStartDate);

	kendo.bind($("#addShip"), model);
	
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
    supplierShipDataSource.data(emptyList);
    shDataSource.data(emptyList);
    allShipDataSource.data(emptyList);
	commonDataSource.data(emptyList);
	bjDataSource.data(emptyList);
	$(".ship-grid").hide();
	
	if(eqList && eqList.length ==0){
		$(".ship-button").hide();
		alert("此销售合同没有可发货设备！");	
	}else{
	
		if(popupParams){
			disableAllInPoppup();
		}else{
			$(".ship-button").show();
			
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
				eqList[i].arrivalAmount = eqList[i].eqcostShipAmount;
			}
			
			if(!eqList[i].actureAmount){
				eqList[i].actureAmount = eqList[i].eqcostShipAmount;
			}
			
			
			
			if(eqList[i].shipType == "北京备货货架"){
				eqList[i].shipTypeDisplay = "上海—北京泰德库(调拨)";
				bjList.push(eqList[i]);
			}else if(eqList[i].shipType == "上海备货货架"){
				shList.push(eqList[i]);
				eqList[i].shipTypeDisplay = "上海—上海泰德库(调拨)";
			}else if(eqList[i].shipType == "直发现场"){
				eqList[i].shipTypeDisplay = "直发现场";
				supplierlist.push(eqList[i]);
			}else{									
				if(eqList[i].shipType == "上海—上海泰德库"){
					eqList[i].shipTypeDisplay = "上海—上海泰德库";
					shList.push(eqList[i]);
				}else{
					eqList[i].shipTypeDisplay = "上海—北京泰德库";
					bjList.push(eqList[i]);
				}									
			} 
		
		}
		
		var shipType = new kendo.data.DataSource({
	
		});
		
		
		if(supplierlist.length >0){
			shipType.add({ text: "直发现场" });
		}
		if(bjList.length >0){
			shipType.add({ text: "上海—北京库" });
		}
		if(shList.length >0){
			shipType.add({ text: "上海—上海库" });
		}
	
		var shipDataKendo = $("#shipType").data("kendoDropDownList");	
		
		if (shipType.data().length > 0) {
//			if(!shipDataKendo){};
			$("#shipType").kendoDropDownList({
		        dataTextField: "text",
		        dataValueField: "text",
		        dataSource: shipType,
		        optionLabel: "选择发货类型...",
		        change: function(e) {
		        	var dataItem = this.dataItem();
		        	if(dataItem.text=="选择发货类型..."){
			        	model.shipType = undefined;    	
		        	}else{		        	
		        		model.shipType = dataItem.text;   
		        	}
		        	updateShipGrid();
		        	$("#common-ship").hide();
		        }
		    });
			$("#ship-type").show();
			shipDataKendo = $("#shipType").data("kendoDropDownList");	
		}else{
			$("#ship-type").hide();
		}


		//COMMON EQ LIST
		commonDataSource.data(bjList);

		for(var item in supplierlist){
			commonDataSource.add(supplierlist[item]);
		}
	
		for(var item in shList){
			commonDataSource.add(shList[item]);
		}
		
		
		shipDataKendo = $("#shipType").data("kendoDropDownList");	
		shipDataKendo.value("");
		if(model.shipType){
			shipDataKendo.value(model.shipType);
			updateShipGrid();
		}else{
			$("#common-ship").show();
		}
	}
}

function updateShipGrid(){
	if(model.shipType == "直发现场"){
		supplierShipDataSource.data(supplierlist);
		$("#supplier-ship").show();
		$("#bj-ship").hide();
		$("#sh-ship").hide();
	}else if(model.shipType == "上海—上海库" || model.shipType == "上海—上海泰德库"){
		shDataSource.data(shList);
		$("#supplier-ship").hide();
		$("#bj-ship").hide();
		$("#sh-ship").show();
	}else if(model.shipType == "上海—北京库" || model.shipType == "上海—北京泰德库"){
		bjDataSource.data(bjList);		
		$("#supplier-ship").hide();
		$("#bj-ship").show();
		$("#sh-ship").hide();
	} 
	$("#common-ship").hide();
}

function saveShip(needCheck) {
	allShipDataSource.data([]);
	var data = new Array();
	$("#bjOutCode").attr("disabled",true);
	$("#shOutCode").attr("disabled",true);
	if(!model.shipType){
		alert("请选择发货类型");
		return;
	}
	
    if (model.shipType == "直发现场") {
		 data = supplierShipDataSource.data();
	} else if (model.shipType == "上海—上海库")  {
		if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
			 $("#shOutCode").removeAttr("disabled",true);
		}
		 data = shDataSource.data();
	}else if (model.shipType == "上海—北京库")  {
		if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
			 $("#bjOutCode").removeAttr("disabled",true);
		}
		 data = bjDataSource.data();
	}
	
	
	if (data.length == 0) {
		alert("无任何设备清单");
		return;
	}
	var validator = $("#addShip").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		alert("验证不通过，请检查表单");
	} else {


		for(i=0; i< data.length; i++){
			allShipDataSource.add(data[i]);				
			if(data[i].leftAmount <  data[i].eqcostShipAmount && needCheck){
				alert("请检查设备可发货数量");
				return;
			}
		}

		model.set("eqcostList", allShipDataSource.data());
		
		if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
			postAjaxRequest("/service/ship/record", {models:kendo.stringify(model)}, checkStatus);
		}else if(redirectParams && redirectParams.type && redirectParams.type == "submit") {
			postAjaxRequest("/service/ship/submit", {models:kendo.stringify(model)}, checkStatus);
		}else{
			postAjaxRequest("/service/ship/create", {models:kendo.stringify(model)}, checkStatus);
		}
	
		

	}
}


function approve_ship() {
	var url =crudServiceBaseUrl + "/ship/approve";
	if(model.status == "已初审"){
		 url =crudServiceBaseUrl + "/ship/finalapprove";
	}
	var param = {
			_id : model._id
		};
	postAjaxRequest(url, param, function(response) {
		alert("批准成功");
		 loadPage("execution_ship");
	});

}

function reject_ship() {
	var url =crudServiceBaseUrl + "/ship/reject";
	if(model.status == "已初审"){
		 url =crudServiceBaseUrl + "/ship/finalreject";
	}
	var param = {
		_id : model._id
	};
	postAjaxRequest(url, param, function(response) {
		alert("拒绝成功");
		 loadPage("execution_ship");
	});

}


function checkStatus(data){
    loadPage("execution_ship");
}
function submitShip(){
	model.set("status", "申请中");
	if(!redirectParams){
		redirectParams = {};
	}
	redirectParams.type = "submit";
	saveShip(true);
}

function cancle() {
	loadPage("execution_ship");
}