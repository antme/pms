//添加采购申请的时候先选择备货申请
var selectBackUrl = "/service/purcontract/back/select/list";
editUrl = "/service/purcontract/request/get";
saveUrl =  "/service/purcontract/request/update";
addUrl =  "/service/purcontract/request/add";
var getSelectUrl = "/service/purcontract/back/load";
var approveUrl =  "/service/purcontract/request/approve";
var rejectUrl =  "/service/purcontract/request/reject";

//申明选择备货申请的id
var selectBackId = undefined;



//编辑页面数据同步对象
var itemDataSource = new kendo.data.DataSource({
	transport : {
		update : {
			url : saveUrl,
			dataType : "jsonp",
			type : "post"
		},
		create : {
			url : addUrl,
			dataType : "jsonp",
			type : "post"
		},
		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {
					// 解析成json_p模式
					models: kendo.stringify(requestDataItem),
					mycallback : "checkStatus"
				}
			}
		}
	},
	group: { field: "总数", aggregates: [{ field: "总数", aggregate: "count" }]},
	aggregate: [ { field: "eqcostMaterialCode", aggregate: "count" }],
	batch : true,
	schema : {
		model : model
	}
});


//计算成本数据的datasouce
var sumDataSource = new kendo.data.DataSource({

});


$(document).ready(function() {
	checkRoles();
	
	if(redirectParams && redirectParams.pageId && redirectParams.pageId=="approve"){
		$("#save-button").hide();
		$("#submit-button").hide();
		$("#approve-button").show();
		$("#reject-button").show();
		$("#approve-comment").show();
		$("#pbPlanDate").attr("disabled", true);
		$("#purchaseContractType").attr("disabled", true);
		
	}else{
		$("#approve-comment").hide();
		$("#save-button").show();
		$("#submit-button").show();
		$("#approve-button").hide();
		$("#reject-button").hide();
	}
	
	if(popupParams){
		$("#approve-comment").show();
	}

	$("#purchaseContractType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "text",
		dataSource : purchaseRequestTypeItems
	});
	
	// 如果是编辑
	if (redirectParams || popupParams) {
		$("#purchase-back-select").hide();
		$("#purchase-request-edit-item").show();
		
		if(popupParams){
			postAjaxRequest(editUrl, popupParams, edit);
			disableAllInPoppup();
		}else{
			if(redirectParams.backId){
				selectBackId = redirectParams.backId;
				selectBackRequest();
			}else{
				postAjaxRequest(editUrl, {_id : redirectParams._id}, edit);
			}
		}
	} else {
		$("#purchase-back-select").show();
		$("#purchase-request-edit-item").hide();
		//如果是新增
		$("#purchaseBackSelect").kendoDropDownList({
			dataTextField : "pbCode",
			dataValueField : "_id",
			dataSource : {
				transport : {
					read : {
						dataType : "jsonp",
						url : selectBackUrl
					}
				},
				schema : {
					total: "total", // total is returned in the "total" field of the response
					data: "data"
				}
			},
			dataBound : function(e) {
				if (this.dataSource.at(0)) {
					selectBackId = this.dataSource.at(0)._id;
				}
			},
			// 当用户选择不同的采购申请时候赋值给requestDataItem对象
			select : function(e) {
				selectBackId = this.dataSource.at(e.item.index())._id;
			}
		});
	}

	
});

function checkStatus(data) {
	loadPage("purchasecontract_purchaseRequest", null);
}


function sumOrders(e) {

	var data = itemDataSource.data();
	requestDataItem.eqcostList = data;

	var eqcostBasePrice = e.model.eqcostBasePrice;
	var eqcostApplyAmount = e.model.eqcostApplyAmount;

	if (e.values.eqcostBasePrice) {
		eqcostBasePrice = e.values.eqcostBasePrice
	}

    var flag = true;
	if (e.values.eqcostApplyAmount) {
		
		if(e.values.eqcostApplyAmount > e.model.pbLeftCount){
			alert("最多可以申请" + e.model.pbLeftCount);
			flag = false;
			e.preventDefault();
		}
	}

	if(flag){
		var grid1 = $("#purchase-request-edit-grid").data("kendoGrid");
		// will trigger dataBound event
		e.model.set("eqcostContractTotalMoney", eqcostBasePrice * eqcostApplyAmount);
		e.model.set("requestedTotalMoney", eqcostBasePrice * eqcostApplyAmount);
	
		grid1.refresh();
	}

}


function selectBackRequest() {
	if (selectBackId) {
		// 服务器查询数据并回调loadBackRequest
		postAjaxRequest(getSelectUrl, { _id : selectBackId }, loadBackRequest);
	} else {
		alert("暂时没有可选的备货申请")
	}
}

function loadBackRequest(data) {
	
	// 把完整的采购申请赋值给requestDataItem
	requestDataItem = data;

	if(requestDataItem.eqcostList　&& requestDataItem.eqcostList.length==0){
		alert("此备货申请已无可备货货品");
	}else{
		
		$("#purchase-request-edit-item").show();
	
		// 新增时候初始化数据
		for (i in requestDataItem.eqcostList) {
			requestDataItem.eqcostList[i].eqcostApplyAmount = requestDataItem.eqcostList[i].pbLeftCount;
		}
		
		requestDataItem.backRequestId = requestDataItem._id;
		requestDataItem.backRequestCode = requestDataItem.pbCode;
		requestDataItem.salesContractId = requestDataItem.scId;
		requestDataItem.salesContractCode = requestDataItem.scCode;
		requestDataItem.comment = "";
		
		// // 新增，所以设置_id为空
		requestDataItem._id = "";	
		requestDataItem.status="草稿";
		edit();
	}
}

function edit(data) {

	// 初始化空对象
	if (data) {
		requestDataItem = data;	    		    
	}

	requestDataItem = new model(requestDataItem);

	if(!requestDataItem.requestedDate){
		requestDataItem.requestedDate = new Date();
	}
	
	
	setDate(requestDataItem, "pbPlanDate", requestDataItem.pbPlanDate);
	setDate(requestDataItem, "requestedDate", requestDataItem.requestedDate);
	// 渲染成本编辑列表
	itemDataSource.data(requestDataItem.eqcostList);
	kendo.bind($("#purchase-request-edit-item"), requestDataItem);


	var editKendoGrid = $("#purchase-request-edit-grid").data("kendoGrid");
	if (!editKendoGrid) {
		$("#purchase-request-edit-grid")
				.kendoGrid(
						{
							dataSource : itemDataSource,
							columns : [ {
								field : "总数",
								title : "总数",
								hidden: true,
								groupHeaderTemplate: "(总数: #= count#)", 
							}, {
								field : "eqcostMaterialCode",
								title : "物料代码",								
								footerTemplate: "Total Count: #=count#"
							}, {
								field : "eqcostProductName",
								title : "产品名称"
							}, {
								field : "eqcostProductType",
								title : "规格型号"

							}, {
								field : "eqcostUnit",
								title : "单位"

							}, {
								field : "eqcostBasePrice",
								title : "标准成本单价",	
								template : function(dataItem){
									return percentToFixed(dataItem.eqcostBasePrice);
								}
							}, 
							{ field: "eqcostDiscountRate",title : "折扣率"},
							{ field: "eqcostLastBasePrice",title : "最终成本价",	
								template : function(dataItem){
									return percentToFixed(dataItem.eqcostLastBasePrice);
								}
							}, {
								field : "eqcostApplyAmount",
								title : "本次申请数量",
								template : function(dataItem){
									return '<span class="edit-tip">' + dataItem.eqcostApplyAmount + '</span>';
								}
							},
							{ field: "pbLeftCount", title: "备货申请下可申请数量"},

							{
								field : "pbComment",
								title : "备注"
							} ],
							schemal :{
								model: model
							},

							editable : true,
							scrollable : true,
							sortable : true,
							resizable: true,
							width : "950px",
							save : sumOrders,
							dataBound : function(e) {
								var kendoGrid = $("#purchase-request-sum-grid")
										.data("kendoGrid");
								if (!kendoGrid) {
									$("#purchase-request-sum-grid").kendoGrid({
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
								}
								var data = itemDataSource.data();
								var total = 0;
								// 采购申请总价格
								var eqcostContractTotalMoney = 0;

								// 合同中总数
								var eqcostRealAmount = 0;
								// 订单实际总价格
								var requestActureMoney = 0;
								var refresh = false;

								for (i = 0; i < data.length; i++) {
									var item = data[i];

									if (!item.eqcostContractTotalMoney) {
										item.eqcostContractTotalMoney = 0;
									}
									if (!item.requestedTotalMoney) {
										item.requestedTotalMoney = 0;
									}
									
									if (!item.eqcostRealAmount) {
										item.eqcostRealAmount = 0;
									}

									if (!item.eqcostApplyAmount) {
										item.eqcostApplyAmount = 0;
									}


									if (!item.eqcostBasePrice) {
										item.eqcostBasePrice = 0;
									}
									
									var requestedTotalMoney = item.requestedTotalMoney;

									// 计算总的申请数量
									total = total + item.eqcostApplyAmount;
									eqcostRealAmount = eqcostRealAmount
											+ item.eqcostRealAmount;

									requestActureMoney = requestActureMoney
											+ item.eqcostApplyAmount
											* item.eqcostBasePrice;
									item.requestedTotalMoney = item.eqcostApplyAmount
											* item.eqcostBasePrice;

									eqcostContractTotalMoney = eqcostContractTotalMoney
											+ item.eqcostRealAmount
											* item.eqcostBasePrice;
									item.eqcostContractTotalMoney = item.eqcostRealAmount
											* item.eqcostBasePrice;



									if ( requestedTotalMoney != item.requestedTotalMoney) {
										refresh = true;
									}

								}

								if (refresh) {
									var grid1 = $("#purchase-request-edit-grid").data("kendoGrid");
									grid1.refresh();
								}

								requestDataItem.requestedNumbers = total;
								requestDataItem.requestedTotalMoney = requestActureMoney;

								var totalPercent = 0;

								if (eqcostRealAmount != 0) {
									totalPercent = (total / eqcostRealAmount) * 100;
								}

								var requestActureMoneyPercent = 0;

								if (eqcostContractTotalMoney != 0) {
									requestActureMoneyPercent = (requestActureMoney / eqcostContractTotalMoney) * 100;
								}

								totalPercent = percentToFixed(totalPercent);
								requestActureMoneyPercent = percentToFixed(requestActureMoneyPercent);
								requestDataItem.numbersPercentOfContract = totalPercent;
								requestDataItem.moneyPercentOfContract = requestActureMoneyPercent;

								sumDataSource.data({});
								sumDataSource
										.add({
											requestedNumbers : total,
											requestedTotalMoney : requestActureMoney,
											numbersPercentOfContract : totalPercent,
											moneyPercentOfContract : requestActureMoneyPercent
										});
								kendoGrid = $("#purchase-request-sum-grid").data(
										"kendoGrid");
								kendoGrid.setDataSource(sumDataSource);

							}

						});
	}
	
	if(redirectParams && redirectParams.pageId && redirectParams.pageId=="approve"){
		disableAllInPoppup();
	}
	

	

}




//保存操作
function saveRequest(status) {
	
	if(requestDataItem.eqcostList　&& requestDataItem.eqcostList.length==0){
		alert("此申请无任何货品");
		return;
	}
	
	if(!requestDataItem.status){
		requestDataItem.status = "草稿";
	}
	
	if(status){
		requestDataItem.status = status;
	}
	
	if(itemDataSource.at(0)){		
		//force set haschanges = true
		itemDataSource.at(0).set("uid", kendo.guid());
	}
	
	var data = itemDataSource.data();
	for (i = 0; i < data.length; i++) {
		if(data[i].pbLeftCount <  data[i].eqcostApplyAmount){
			alert("请检查设备可申请数量");
			return;
		}
	}
	
	if(requestDataItem.applicationDepartment && requestDataItem.applicationDepartment instanceof Object){
		requestDataItem.applicationDepartment = requestDataItem.applicationDepartment.join(",");
	}
	

	if(requestDataItem.purchaseContractType && requestDataItem.purchaseContractType.text){
		requestDataItem.purchaseContractType = requestDataItem.purchaseContractType.text;
	}
	
	if(!requestDataItem.purchaseContractType){
		var purchaseContractType= $("#purchaseContractType").data("kendoDropDownList");
		requestDataItem.purchaseContractType = purchaseContractType.value();
	}

	
	// 同步数据
	itemDataSource.sync();
}


function approve(){
	var param = {
			"_id" : requestDataItem._id,
			"approveComment" : $("#approve-comment").val()
		};
	postAjaxRequest(approveUrl, param, function(data){
		loadPage("purchasecontract_purchaseRequest");
	});
}

function reject(){
	var param = {
			"_id" : requestDataItem._id,
			"approveComment" : $("#approve-comment").val()
		};
	postAjaxRequest(rejectUrl, param, function(data){
		loadPage("purchasecontract_purchaseRequest");
	});
}

function cancel(){
	if(redirectParams && redirectParams.pageId && redirectParams.pageId=="approve"){
		loadPage("purchasecontract_purchaseRequestApprove");
	}else{
		loadPage("purchasecontract_purchaseRequest");
	}
}

