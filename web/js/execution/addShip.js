var eqDataSource, crudServiceBaseUrl = "../service";

var ship = kendo.data.Model.define( {
    id: "_id",
    fields: {
    	shipCode: {},
    	applicationDepartment: {},
    	salesContractId: {},
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
    	eqcostShipAmount: { type: "number", validation: { min: 1} },
    	arrivalAmount: { type: "number", validation: {  min: 0} },
    	giveUp: { editable: false },
    	leftAmount: { editable: false  },
    	eqcostDeliveryType : {editable: false},
    	eqcostMemo: {}
    }
});


var project ;
var salesContract;
eqDataSource = new kendo.data.DataSource({
    group: [
    	{field:"shipType"}
    ],
	schema : {
		model : eqModel
	}
});

var supplierShipDataSource = new kendo.data.DataSource({
	schema : {
		model : eqModel
	}
});


var commonDataSource = new kendo.data.DataSource({
	  group: [
		      	{field:"shipType"}
		      ],
	schema : {
		model : eqModel
	}
});

var allocatDataSource = new kendo.data.DataSource({
	  group: [
	      	{field:"shipType"}
	      ],
	 schema : {
		model : eqModel
	 }
});

var allShipDataSource = new kendo.data.DataSource({

});

$(document).ready(function() {
	
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
        	model.set("customer", dataItem.customer);
        	model.set("applicationDepartment", dataItem.department);
        	model.set("salesContractId", "");
        	
        	loadSC();
        	
        }, 
        dataBound : function(e){
        	loadSC();
        }
    }).data("kendoComboBox");

	
	
	$("#deliveryRequirements").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "text",
        optionLabel : "选择货运要求...",
        dataSource: deliveryRequirementsItems
    });
	
	$("#equipments-grid").kendoGrid({
		dataSource : eqDataSource,
	    columns: [
	        { field: "eqcostNo", title: "序号" },
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostUnit", title: "单位" },
	        { field: "eqcostShipAmount", title: "发货数" , attributes: { "style": "color:red"}},
	        { field: "leftAmount", title: "可发货数量" , attributes: { "style": "color:red"}},
	        { 
	        	field: "shipType", 
	        	title: "采购仓库" ,
				groupHeaderTemplate: function(dataItem){														
					return dataItem.value;
				}
	        		
	        },
			 {
				field : "eqcostDeliveryType",
				title : "物流类别"
			},	        
	        { field: "eqcostMemo", title: "备注" },
	        { command: "destroy", title: "&nbsp;", width: 90 }],
	    editable: true,
	    groupable : true,
	    sortable : true,
	    save : function(e){
	    	if(e.values.eqcostShipAmount > e.model.leftAmount){
				alert("最多可以申请" + e.model.leftAmount);
				e.preventDefault();
			}else{
		    	var grid = $("#equipments-grid").data("kendoGrid");
		    	grid.refresh();
			}
	    }
	});
	
	
	$("#supplier-ship-grid").kendoGrid({
		dataSource : supplierShipDataSource,
	    columns: [
	        { field: "eqcostNo", title: "序号" },
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostUnit", title: "单位" },
	        { field: "eqcostShipAmount", title: "发货数" , attributes: { "style": "color:red"}},
	        { field: "leftAmount", title: "可发货数量" , attributes: { "style": "color:red"}},
	        { field: "actureAmount", title: "实际发货数" , attributes: { "style": "color:red"}},
	       
			 {
				field : "eqcostDeliveryType",
				title : "物流类别"
			},	        
	        { field: "eqcostMemo", title: "备注" },
	        { command: "destroy", title: "&nbsp;", width: 90 }],
	    editable: true,
	    sortable : true,
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
	
	
	$("#allocat-ship-grid").kendoGrid({
		dataSource : allocatDataSource,
	    columns: [
	        { field: "eqcostNo", title: "序号" },
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostUnit", title: "单位" },
	        { field: "eqcostShipAmount", title: "发货数", attributes: { "style": "color:red"}},
	        { field: "leftAmount", title: "可发货数量" , attributes: { "style": "color:red"}},
			{
				field : "shipType",
				title : "调拨货架"
			},	        
	        { field: "eqcostMemo", title: "备注" },
	        { command: "destroy", title: "&nbsp;", width: 90 }],
	        editable: true,
		    groupable : true,
		    sortable : true,

	        save : function(e){
	    	if(e.values.eqcostShipAmount > e.model.leftAmount){
				alert("最多可以申请" + e.model.leftAmount);
				e.preventDefault();
			}else{
		    	var grid = $("#allocat-ship-grid").data("kendoGrid");
		    	grid.refresh();
			}
	    }
	});
	
	$("#common-ship-grid").kendoGrid({
		dataSource : commonDataSource,
	    columns: [
	        { field: "eqcostNo", title: "序号" },
	        { field: "eqcostMaterialCode", title: "物料代码" },
	        { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostUnit", title: "单位" },
	        { field: "eqcostShipAmount", title: "发货数", attributes: { "style": "color:red"}},
	        { field: "leftAmount", title: "可发货数量" , attributes: { "style": "color:red"}},
			{
				field : "shipType",
				title : "发货类型"
			},	        
	        { field: "eqcostMemo", title: "备注" }],
	        editable: false,
		    groupable : true,
		    sortable : true
	    
	});
	
	if(popupParams){
		postAjaxRequest("/service/ship/get", popupParams, edit);
		disableAllInPoppup();
	} else if (redirectParams && redirectParams._id) {//Edit		
		postAjaxRequest("/service/ship/get", {_id:redirectParams._id}, edit);
	} else {//Add
		edit();
	}
});


function loadSC(){
	salesContract = $("#salesContract").kendoComboBox({
		autoBind: false,
        placeholder: "销售合同编号",
        dataTextField: "contractCode",
        dataValueField: "_id",
        filter: "contains",
        suggest: true,
        dataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: crudServiceBaseUrl + "/sc/listbyproject",
                    dataType: "jsonp",
    	            data: {
    	            	projectId: function() {
                            return project.value();
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
       
            model.set("contractCode", dataItem.contractCode);
            model.set("contractType", dataItem.contractType);
            model.shipType ="";
 
            postAjaxRequest("/service/ship/eqlist", {salesContractId:salesContract.value()}, loadEqList);
		
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

function edit(data) {

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
var rKlistBJ = new Array();
var rKlistSH = new Array();
var alloListBJ = new Array();
var alloListSH = new Array();

function loadEqList(data){
	var eqList = data;
	if(data.data){
		 eqList = data.data;
	}
	supplierlist = new Array();
	rKlistBJ = new Array();
	rKlistSH = new Array();
	alloListBJ = new Array();
	alloListSH = new Array();
    supplierShipDataSource.data(supplierlist);
    allocatDataSource.data(rKlistBJ);
    allShipDataSource.data(alloListBJ);
	commonDataSource.data(alloListSH);
	eqDataSource.data(alloListSH);
	$(".ship-grid").hide();
	
	if(eqList && eqList.length ==0){
		$(".ship-button").hide();
		alert("此销售合同没有可发货设备！");	
	}else{
		$(".ship-button").show();
		
		if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
			$("#save-button").hide();
			$("#submit-button").hide();
		}else{
			$("#confirm-button").hide();
		}
		

		for(i=0; i<eqList.length; i++){
			if(!eqList[i].arrivalAmount || eqList[i].arrivalAmount==0){
				eqList[i].arrivalAmount = eqList[i].eqcostShipAmount;
			}
			
			if(eqList[i].shipType == "北京备货货架"){
				alloListBJ.push(eqList[i]);
			}else if(eqList[i].shipType == "上海备货货架"){
				alloListSH.push(eqList[i]);
			}else if(eqList[i].shipType == "直发现场"){
				supplierlist.push(eqList[i]);
			}else{									
				if(eqList[i].shipType == "上海—上海泰德库"){
					rKlistSH.push(eqList[i]);
				}else{
					rKlistBJ.push(eqList[i]);
				}									
			} 
		
		}
		
		var shipType = new kendo.data.DataSource({
	
		});
		
		
		if(supplierlist.length >0){
			shipType.add({ text: "直发" });
		}
		if(rKlistBJ.length >0){
			shipType.add({ text: "上海—北京泰德库" });
		}
		if(rKlistSH.length >0){
			shipType.add({ text: "上海—上海泰德库" });
		}
		if(alloListSH.length >0){
			shipType.add({ text: "上海备货货架" });
		}
		if(alloListBJ.length >0){
			shipType.add({ text: "北京备货货架" });
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
		        	model.shipType = dataItem.text;    	
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
		commonDataSource.data(alloListBJ);
		for(var item in alloListSH){
			commonDataSource.add(alloListSH[item]);
		}
		for(var item in supplierlist){
			commonDataSource.add(supplierlist[item]);
		}
		for(var item in rKlistBJ){
			commonDataSource.add(rKlistBJ[item]);
		}
		for(var item in rKlistSH){
			commonDataSource.add(rKlistSH[item]);
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
	if(model.shipType == "北京备货货架"){
		allocatDataSource.data(alloListBJ);	
		$("#supplier-ship").hide();
		$("#repo-ship").hide();
		$("#allocat-ship").show();
	}else if(model.shipType == "上海备货货架"){
		allocatDataSource.data(alloListSH);
		$("#supplier-ship").hide();
		$("#repo-ship").hide();
		$("#allocat-ship").show();
	}else if(model.shipType == "直发"){
		supplierShipDataSource.data(supplierlist);
		$("#supplier-ship").show();
		$("#repo-ship").hide();
		$("#allocat-ship").hide();
	}else if(model.shipType == "上海—上海泰德库"){
		eqDataSource.data(rKlistSH);
		$("#supplier-ship").hide();
		$("#repo-ship").show();
		$("#allocat-ship").hide();
	}else if(model.shipType == "上海—北京泰德库"){
		eqDataSource.data(rKlistBJ);		
		$("#supplier-ship").hide();
		$("#repo-ship").show();
		$("#allocat-ship").hide();
	} 
	$("#common-ship").hide();
}

function saveShip(needCheck) {
	allShipDataSource.data([]);
	var data = new Array();
	$("#outCode").attr("disabled",true);
	$("#allocateOutCode").attr("disabled",true);
	
	if(!model.shipType){
		alert("请选择发货类型");
		return;
	}

	
	if (model.shipType == "上海备货货架") {
		if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
			 $("#allocateOutCode").removeAttr("disabled",true);
		}
		 data = allocatDataSource.data();
	} else if (model.shipType == "直发") {
		 data = supplierShipDataSource.data();
	} else if (model.shipType == "北京备货货架")  {
		if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
			 $("#allocateOutCode").removeAttr("disabled",true);
		}
		 data = allocatDataSource.data();
	}else if (model.shipType == "上海—上海泰德库")  {
		if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
			 $("#outCode").removeAttr("disabled",true);
		}
		 data = eqDataSource.data();
	}else if (model.shipType == "上海—北京泰德库")  {
		if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
			 $("#outCode").removeAttr("disabled",true);
		}
		 data = eqDataSource.data();
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