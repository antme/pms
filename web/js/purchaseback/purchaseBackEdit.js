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
        pbLeftCount: {
        	editable : false
        },
        pbTotalCount: {
        	type: "number",
        	 validation: {
                 min: 0
             }
        },
        pbComment: {},
        eqcostSalesBasePrice:{
        	editable : false
        },
        eqcostDiscountRate:{
        	editable : false
        },
        eqcostLastBasePrice:{
        	editable : false
        }
	}
});	
var myModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		pbCode:{},
		applicationDepartment:{},
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
			group: {
				field:"eqcostCategory"
			},
			schema: {
				model: subModel
			},
			change: dataBound
		},
		save : function(e){
			if(e.values.pbTotalCount && e.values.pbTotalCount > e.model.eqcostLeftAmount){
				alert("最多可以申请" + e.model.eqcostLeftAmount);
				flag = false;
				e.preventDefault();
			}
		},
	    columns: [
			
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号"},
			{ field: "eqcostUnit", title: "单位" },
			{ field: "pbTotalCount", title: "本次申请数量", attributes: { "style": "color:red"}},
			{ field: "eqcostLeftAmount", title: "合同下剩余可备货数量"},
			{ field: "eqcostRealAmount", title: "成本中总数"},
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
			{ field: "eqcostCategory", hidden: true, title: "类别",groupHeaderTemplate: kendo.template($("#headerTemplate").html())},
			{ field: "pbComment", title: "备注" }
	  	],
	  	sortable : true,
	  	resizable: true,
	  	editable:true
	  	
	});

	$("#searchfor").kendoDropDownList({
		dataTextField : "contractCode",
		dataValueField : "_id",
		template:  '${ data.projectName }:<strong>${ data.contractCode }</strong>',
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : baseUrl+"/sc/purchaseback/listforselect"
				}
			},
			schema : {
				total: "total",
				data: "data"
			}
		}
	});	

	$("#form-container-button button").click(function(){
		if(this.id == "cancel") {
			loadPage("purchaseback_purchaseBack");
		} else if(validateModel()){
			if(confirm("提交表单，确认？")){
				currentObj.pbPlanDate = kendo.toString(currentObj.pbPlanDate,"yyyy-MM-dd");
				
				if(this.id=="approve" || this.id =="reject"){
					if(currentObj.pbStatus && currentObj.pbStatus =="已提交"){
						postAjaxRequest("/service/purchase/back/"+this.id, {models:kendo.stringify(currentObj)} , saveSuccess);
					}else{
						alert("非提交状态不允许审核");					
					}
				}else{
					postAjaxRequest("/service/purchase/back/"+this.id, {models:kendo.stringify(currentObj)} , saveSuccess);
				}
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
		postAjaxRequest(baseUrl+"/purchase/back/load", {_id: redirectParams._id}, editSuccess);
		
		//合同签订日期控件
		var ddd = $("#pbPlanDate").kendoDatePicker({
			min: new Date()
		});

		if(redirectParams && redirectParams.pageId && redirectParams.pageId=="approve") {
			   $(".button-submit").hide();
			   $(".button-approve").show();
		}  else{
			   $(".button-submit").show();
			   $(".button-approve").hide();
		}
	
	}else{
		
	   $(".button-submit").show();
	   $(".button-approve").hide();
	   
		//合同签订日期控件
		var ddd = $("#pbPlanDate").kendoDatePicker({
			min: new Date()
		});

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
//		if(item.pbTotalCount > item.eqcostLeftAmount){
//			item.pbTotalCount=item.eqcostLeftAmount;
//		}
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
	
	totalPercent = percentToFixed(totalPercent);
	requestActureMoneyPercent = percentToFixed(requestActureMoneyPercent);
	sumDataSource.data({});
	sumDataSource
			.add({
				requestedNumbers : totalRequestCount,
				requestedTotalMoney : totalRequestMoney.toFixed(2),
				numbersPercentOfContract : totalPercent,
				moneyPercentOfContract : requestActureMoneyPercent
			});
	kendoGrid = $("#purchase-request-sum-grid").data("kendoGrid");
	kendoGrid.setDataSource(sumDataSource);
}


function saveSuccess(){
	loadPage("purchaseback_purchaseBack");
}

function editSuccess(e){
	if(!e) return;
	if(e.pbStatus =="已提交" && redirectParams && redirectParams.pageId && redirectParams.pageId=="approve") {
		//审核的时候禁止掉页面一些元素
		$(":input").attr("disabled",true);
		var datepicker = $("#pbPlanDate").data("kendoDatePicker");
		datepicker.enable(false);
		$("#tempComment").removeAttr("disabled");
		$(":button").removeAttr("disabled");		
	}
	currentObj = new myModel(e);
	currentObj.set("pbPlanDate", kendo.toString(currentObj.pbPlanDate, 'd'));
	kendo.bind($("#form-container"), currentObj);			
}

function validateModel(){
	if(!currentObj.scId){
		alert("请确认销售合同！");
		return false;
	}
	var validator = $("#form-container").kendoValidator().data("kendoValidator");
	if(!validator.validate()){
		alert("请检查必填字段！");
		return false;
	}
	var eqList = currentObj.eqcostList;
	var eqTotalCount = 0;
	
	var category;
	for(var i=0;i<eqList.length;i++){
		if(!category){
			category = eqList[i].eqcostCategory;
		} else if(category != eqList[i].eqcostCategory){
			alert("请审核设备清单, 只可为同一类别！");
			return false;
		}
		eqTotalCount+=eqList[i].pbTotalCount;
	}
	if(eqTotalCount== 0){
		alert("无可备货设备清单");
		return false;
	}
	return true;
}
function delGridItem(value){
	var temp = new Array();
	var dataSource = $("#subGrid").data("kendoGrid").dataSource;
	for(var i=0;;i++){
		var item = dataSource.at(i);
		if(item){
			if(item.eqcostCategory == value){
				temp[temp.length++] = item;
			}
		}else{
			break;
		}
	}
	for(var i=0;i<temp.length;i++){
		dataSource.remove(temp[i]);
	}
}