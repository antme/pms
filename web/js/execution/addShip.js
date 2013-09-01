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
    	repositoryName: { editable: false  },
    	eqcostDeliveryType : {editable: false},
    	eqcostMemo: {}
    }
});


var project ;
var salesContract;
eqDataSource = new kendo.data.DataSource({
    group: [
    	{field:"repositoryName"}
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

var allocatDataSource = new kendo.data.DataSource({
	  group: [
	      	{field:"repositoryName"}
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
	        { field: "eqcostShipAmount", title: "发货数" },
	        { field: "leftAmount", title: "可发货数量" },
	        { 
	        	field: "repositoryName", 
	        	title: "仓库" ,
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
	        { field: "eqcostShipAmount", title: "发货数" },
	        { field: "leftAmount", title: "可发货数量" },
	        { field: "actureAmount", title: "实际发货数" },
	       
			 {
				field : "eqcostDeliveryType",
				title : "物流类别"
			},	        
	        { field: "eqcostMemo", title: "备注" },
	        { command: "destroy", title: "&nbsp;", width: 90 }],
	    editable: true,
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
	        { field: "eqcostShipAmount", title: "发货数" },
	        { field: "leftAmount", title: "可发货数量" },
			{
				field : "repositoryName",
				title : "货架"
			},	        
	        { field: "eqcostMemo", title: "备注" },
	        { command: "destroy", title: "&nbsp;", width: 90 }],
	        editable: true,
		    groupable : true,

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
	
    
	if(popupParams){
		postAjaxRequest("/service/ship/get", popupParams, edit);
		disableAllInPoppup();
	} else if (redirectParams) {//Edit		
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
	
	if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
		$("#save-button").hide();
		$("#submit-button").hide();
	}else{
		$("#confirm-button").hide();
	}
	

	if(data){
		model = new ship(data);
		
		if($("#project").data("kendoComboBox")){
			$("#project").data("kendoComboBox").enable(false);
		}
		
		if($("#salesContract").data("kendoComboBox")){
			$("#salesContract").data("kendoComboBox").enable(false);
		}
		
	}
	console.log(model.deliveryStartDate);
	setDate(model, "deliveryStartDate", model.deliveryStartDate);
	console.log(model.deliveryStartDate);

	kendo.bind($("#addShip"), model);
	
	if(model.eqcostList){
		loadEqList(model.eqcostList);
	}
}

var supplierlist = new Array();
var rKlist = new Array();
var alloList = new Array();

function loadEqList(data){
	var eqList = data;
	if(data.data){
		 eqList = data.data;
	}
	supplierlist = new Array();
	rKlist = new Array();
	alloList = new Array();
	
	if(eqList && eqList.length ==0){
		alert("此销售合同没有可发货设备！");
	}
	
	for(i=0; i<eqList.length; i++){
		
		if(!eqList[i].arrivalAmount || eqList[i].arrivalAmount==0){
			eqList[i].arrivalAmount = eqList[i].eqcostShipAmount;
		}
		if(!eqList[i].eqcostDeliveryType){
			//调拨，仓库取自货架
//			eqList[i].repositoryName="";
			alloList.push(eqList[i]);
		}else{
			if(eqList[i].eqcostDeliveryType == "直发现场"){
				eqList[i].repositoryName="";
				supplierlist.push(eqList[i]);
			}else if(eqList[i].purchaseContractType == "同方采购"){
				eqList[i].repositoryName="上海—北京泰德库";
				rKlist.push(eqList[i]);
			}else{
				eqList[i].repositoryName="上海—上海泰德库";
				rKlist.push(eqList[i]);
			}
		}
		
	}
	
	var shipType = new kendo.data.DataSource({

	});
	
	if(supplierlist.length >0){
		shipType.add({ text: "直发" });
		$("#supplier-ship").show();
	}else{
		$("#supplier-ship").hide();
	}
	if(rKlist.length >0){
		shipType.add({ text: "采购" });
		$("#repo-ship").show();
	}else{
		$("#repo-ship").hide();
	}
	if(alloList.length >0){
		shipType.add({ text: "库存" });
		$("#allocat-ship").show();
	}else{
		$("#allocat-ship").hide();
	}
	
	if (shipType.data().length > 0) {
		$("#shipType").kendoDropDownList({
	        dataTextField: "text",
	        dataValueField: "text",
	        dataSource: shipType,
	        change: function(e) {
	        	var dataItem = this.dataItem();
	        	if (dataItem.text == "库存") {
	        		$("#supplier-ship").hide();
					$("#repo-ship").hide();
					$("#allocat-ship").show();
				} else if (dataItem.text == "直发") {
					$("#supplier-ship").show();
					$("#repo-ship").hide();
					$("#allocat-ship").hide();
				} else if (dataItem.text == "采购") {
					$("#supplier-ship").hide();
					$("#repo-ship").show();
					$("#allocat-ship").hide();
				}
	        }
	    });
		$("#ship-type").show();
	}else{
		$("#ship-type").hide();
	}

	allocatDataSource.data(alloList);
	supplierShipDataSource.data(supplierlist);
	eqDataSource.data(rKlist);
}

function saveShip() {
	var validator = $("#addShip").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		alert("验证不通过，请检查表单");
	} else {
		allShipDataSource.data([]);
		var data = new Array();
		if (model.shipType == "库存") {
			 data = allocatDataSource.data();
		} else if (model.shipType == "采购") {
			 data = eqDataSource.data();
		} else if (model.shipType == "直发") {
			 data = supplierShipDataSource.data();
		}
		
		for(i=0; i< data.length; i++){
			allShipDataSource.add(data[i]);
		}

		if (allShipDataSource.data() && allShipDataSource.data().length > 0) {
			model.set("eqcostList", allShipDataSource.data());

			if(redirectParams && redirectParams.type && redirectParams.type == "confirm"){
				postAjaxRequest("/service/ship/record", {models:kendo.stringify(model)}, checkStatus);
			}else if(redirectParams && redirectParams.type && redirectParams.type == "submit") {
				postAjaxRequest("/service/ship/submit", {models:kendo.stringify(model)}, checkStatus);
			}else{
				postAjaxRequest("/service/ship/create", {models:kendo.stringify(model)}, checkStatus);
			}

		} else {
			alert("无任何设备清单");
		}

	}
}


function checkStatus(data){
    loadPage("execution_ship");
}
function submitShip(){
	model.set("status", "申请中");
	model.status = "申请中";
	if(!redirectParams){
		redirectParams = {};
	}
	redirectParams.type = "submit";
	saveShip();
}

function cancle() {
	loadPage("execution_ship");
}