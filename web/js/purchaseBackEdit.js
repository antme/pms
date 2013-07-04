intSelectInput();
var subModel = kendo.data.Model.define({
	id : "eqcostNo",
	fields : {
        eqcostNo: {
			editable : false,
			nullable : true	
        },
        eqcostMaterialCode: {
        	editable : false
        },
        eqcostProductName: {
        	editable : false
        },
        eqcostProductType: {
        	editable : false
        },
        eqcostUnit: {
        	editable : false
        },
        eqcostBasePrice: {
        	editable : false
        },
        eqcostMemo: {
        	editable : false
        },
        eqcostLeftAmount: {
        	editable : false
        },
        eqcostRealAmount: {
        	editable : false
        },
        eqcostLeftAmount: {
        	editable : false
        },
        eqcostCategory: {
        	editable : false
        },
        pbTotalCount: {
        	type: "number",
        	 validation: {
                 min: 0
             }
        },
        pbComment: {}
	}
});	
var myModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		pbCode:{},
		pbDepartment:{},
		pbSubmitDate:{type:"date"},
		pbPlanDate:{type:"date"},
		pbType:{},
		pbStatus:{},
		pbComment:{},
		pbMoney:{},
		projectName: {},
		projectCode: {},
		projectManager: {},
		customer: {},
		scId:{},
		contractCode: {},
		contractAmount: {}
	}
});
//计算成本数据的datasouce
var sumDataSource = new kendo.data.DataSource({});

var currentObj = new myModel();

$(document).ready(function () {
	checkRoles();

	$("#purchase-request-sum-grid").kendoGrid({
		dataSource:sumDataSource,
		columns : [ {
			field : "requestedTotalMoney",
			title : "申请金额"
		}, {
			field : "requestedNumbers",
			title : "货品数量"
		}, {
			field : "numbersPercentOfContract",
			title : "货品占合同%"
		}, {
			field : "moneyPercentOfContract",
			title : "货品金额占合同%"
		} ],
		width : "200px"
	});
	
	$("#subGrid").kendoGrid({
		dataSource: {
			schema: {
				model: subModel
			},
			change: dataBound
		},
	    columns: [
			{ field: "eqcostNo", title: "序号"},
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号" },
			{ field: "eqcostUnit", title: "单位" },
			{ field: "pbTotalCount", title: "本次申请数量", attributes: { "style": "color:red"}},
			{ field: "eqcostLeftAmount", title: "可申请数量"},
			{ field: "eqcostRealAmount", title: "成本中总数"},
			{ field: "eqcostBasePrice", title: "预估单价" },
			{ field: "eqcostCategory", title: "类别" },
			{ field: "eqcostMemo", title: "备注1" },
			{ field: "pbComment", title: "备注2" }
	  	],
	  	editable:true,
	  	
	});

	$("#searchfor").kendoDropDownList({
		dataTextField : "contractCode",
		dataValueField : "_id",
		template:  '${ data.projectName }:<strong>${ data.contractCode }</strong>',
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : baseUrl+"/purchase/sc/listforselect",
				}
			},
			schema : {
				total: "total",
				data: "data"
			}
		}
	});	

	$("#form-container-button button").click(function(){
		if(this.value == "cancel") {
			loadPage("purchaseBack");
		} else if(validateModel()){
			if(confirm("提交表单，确认？")){
				postAjaxRequest("/service/purchase/back/"+this.value, {models:kendo.stringify(currentObj)} , saveSuccess);
			}
		}
	});

	$("#searchbt").click(function(){
		var vv = $("#searchfor").val();
		if(vv != ""){
			postAjaxRequest(baseUrl+"/purchase/back/prepare", {scId:vv}, editSuccess);
		}else{
			alert("请选择合同编号");
		}
	});	
	
	if(popupParams){
		$("#searchDiv").hide();
		postAjaxRequest(baseUrl+"/purchase/back/load", popupParams, editSuccess);
		disableAllInPoppup();
	}else if(redirectParams){
		$("#searchDiv").hide();
		postAjaxRequest(baseUrl+"/purchase/back/load", redirectParams, editSuccess);
	}
	kendo.bind($("#form-container"), currentObj);
});

function dataBound(e) {
	var data = $("#subGrid").data("kendoGrid").dataSource.data();
	var totalRequestCount=0;
	var totalRequestMoney=0;
	var totalCount = 0;
	var totalMoney=0;
	for (i = 0; i < data.length; i++) {
		var item = data[i];
		if (!item.pbTotalCount) {item.pbTotalCount = 0;}
		if (!item.eqcostLeftAmount) {item.eqcostLeftAmount = 0;}
		if (!item.eqcostRealAmount) {item.eqcostRealAmount = 0;}
		if (!item.eqcostBasePrice) {item.eqcostBasePrice = 0;}
		// 检测总的申请数量
		if(item.pbTotalCount > item.eqcostLeftAmount){
			item.pbTotalCount=item.eqcostLeftAmount;
		}
		//统计%
		totalCount +=item.eqcostRealAmount;
		totalMoney+=item.eqcostRealAmount*item.eqcostBasePrice;
		totalRequestCount +=item.pbTotalCount;
		totalRequestMoney+=item.pbTotalCount*item.eqcostBasePrice;
	}
	var totalPercent = 0;
	if (totalCount != 0) {
		totalPercent = (totalRequestCount / totalCount) * 100;
	}
	var requestActureMoneyPercent = 0;
	if (totalMoney != 0) {
		requestActureMoneyPercent = (totalRequestMoney / totalMoney) * 100;
	}
	sumDataSource.data({});
	sumDataSource
			.add({
				requestedNumbers : totalRequestCount,
				requestedTotalMoney : totalRequestMoney,
				numbersPercentOfContract : totalPercent,
				moneyPercentOfContract : requestActureMoneyPercent
			});
	kendoGrid = $("#purchase-request-sum-grid").data("kendoGrid");
	kendoGrid.setDataSource(sumDataSource);
}


function saveSuccess(){
	loadPage("purchaseBack");
}

function editSuccess(e){
	if(!e) return;
	if(e.pbStatus =="已提交") {
		$("#form-container :input").attr("disabled","disabled");
		$("#form-container-button button").hide();
	}else if(e.pbStatus =="已批准") {
		$("#form-container :input").attr("disabled","disabled");
		$("#form-container-button button").hide();
	}else if(e.pbStatus =="已拒绝") {
		$("#form-container :input").attr("disabled","disabled");
	}
	currentObj = new myModel(e);
	currentObj.set("pbPlanDate", kendo.toString(currentObj.pbPlanDate, 'd'));
	kendo.bind($("#form-container"), currentObj);			
}

function validateModel(){
	if(!currentObj.scId){
		return false;
	}
	var validator = $("#form-container").kendoValidator().data("kendoValidator");
	if(!validator.validate()){
		return false;
	}
	var eqList = currentObj.eqcostList;
	var eqTotalCount = 0;
	for(var i=0;i<eqList.length;i++){
		eqTotalCount+=eqList[i].pbTotalCount;
	}
	if(eqTotalCount== 0){
		alert("请选择设备清单");
		return false;
	}
	return true;
}