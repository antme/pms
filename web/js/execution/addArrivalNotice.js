var editUrl = "/service/arrivalNotice/order/eqlist";
var saveUrl =  "/service/arrivalNotice/create/byorder";
var selectOrderUrl = "/service/purcontract/order/selectforarrival";

// 声明一个总的对象用来传递数据
var requestDataItem = undefined;
var selectedRequestId = undefined;

$(document).ready(function() {
	
	if(popupParams){
		disableAllInPoppup();
		postAjaxRequest("/service/arrivalNotice/get", popupParams, editArrivalNotice);
	} else {
		$("#purchase-order-select").show();
		$("#purchaseOrderRequest").kendoDropDownList({
			dataTextField : "purchaseOrderCode",
			dataValueField : "_id",
			dataSource : {
				transport : {
					read : {
						dataType : "jsonp",
						url : selectOrderUrl
					}
				},
				schema : {
					total: "total", // total is returned in the "total" field of the response
					data: "data"
				}
			},

			dataBound : function(e) {
				if (this.dataSource.at(0)) {
					selectedRequestId = this.dataSource.at(0)._id;
				}else{
					alert("暂时没有需要可到货的采购订单");
				}
			},
			// 当用户选择不同的采购申请时候赋值给requestDataItem对象
			select : function(e) {
				selectedRequestId = this.dataSource.at(e.item.index())._id;
			}
		});
		

	}
	
});

function selectPurchaseOrderRequest(){
	if(selectedRequestId){
		postAjaxRequest(editUrl, {_id:selectedRequestId}, editArrivalNotice);
	}else{
		alert("请选择采购订单");
	}
}

var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		eqcostAvailableAmount : {
			type : "number"
		},
		pbPlanDate:{type:"date"},
		applicationDepartment:{
			
		},
		eqcostArrivalAmount : {
			validation : {
				min : 0
			},
			type : "number"
		},
		eqcostApplyAmount : {
			editable : false,
			type : "number"
		},
		eqcostBasePrice : {
			type : "number",
			editable : false
		},
		eqcostRealAmount : {
			editable : false,
			type : "number"
		},
		eqcostProductUnitPrice : {
			editable : false,
			type : "number"
		},
		requestedTotalMoney : {
			editable : false
		},
		eqcostContractTotalMoney : {
			type : "number",
			editable : false
		},
		differenceAmount : {
			type : "number",
			editable : false
		},
		eqcostProductName : {
			editable : false
		},
		eqcostNo : {
			editable : false
		},
		eqcostMaterialCode : {
			editable : false
		},
		eqcostProductType : {
			editable : false
		},
		eqcostAvailableAmount : {
			editable : false
		},
		eqcostUnit : {
			editable : false
		},
		pbTotalCount :{
			editable : false
		},
		pbLeftCount : {
			editable : false
		},
		arrivedRequestCount:{
			editable : false
		},
		orderEqcostName : {

		},
		eqcostDeliveryType: {
			defaultValue : "入公司库"
		},
		
		orderEqcostModel : {

		},
		comment : {

		},
		eqcostList: {}
	}
});

//编辑页面数据同步对象
var itemDataSource = new kendo.data.DataSource({
	transport : {
		update : {
			url : saveUrl,
			dataType : "jsonp",
			type : "post"
		},
		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {
					// 解析成json_p模式
					json_p : kendo.stringify(requestDataItem),
					mycallback : "checkArrivalNotice"
				}
			}
		}
	},
	batch : true,
	schema : {
		model : model
	}
});



function editArrivalNotice(data) {

	// 初始化空对象
	if (data) {
		requestDataItem = data;
	}

	requestDataItem = new model(requestDataItem);

	if(requestDataItem.eqcostList.length >0 ){
		// 渲染成本编辑列表
		itemDataSource.data(requestDataItem.eqcostList);


	requestDataItem.set("pbPlanDate", kendo.toString(requestDataItem.pbPlanDate, 'd'));
	kendo.bind($("#purchaseorder-edit-item"), requestDataItem);
	$("#purchaseorder-edit-item").show();


	//FIXME: 无数据时候JS错误
	$("#purchaseorder-edit-grid").kendoGrid(
						{
							dataSource : itemDataSource,
							columns : [
									{
										field : "eqcostNo",
										title : "序号"
									},
									{
										field : "eqcostMaterialCode",
										title : "物料代码"
									},
									{
										field : "eqcostProductName",
										title : "产品名"
									},
									{
										field : "eqcostProductType",
										title : "规格型号"

									},
									{
										field : "eqcostUnit",
										title : "单位"
									},
									{
										field : "eqcostRealAmount",
										title : "合同中总数"
									},
									{
										field : "eqcostBasePrice",
										title : "成本单价"
									},
									{
										field : "eqcostContractTotalMoney",
										title : "合同总价"
									},
									{
										field : "eqcostApplyAmount",
										title : "本次采购数量"
									},
									{
										field : "arrivedRequestCount",
										title : "已到货"
									},
									{
										field : "eqcostProductUnitPrice",
										title : "采购单价"
									},
									{
										field : "requestedTotalMoney",
										title : "采购总价"
									},
									{
										field : "eqcostArrivalAmount",
										title : "本次到货",
										template : function(dataItem) {
											return '<span class="edit-tip">' + dataItem.eqcostArrivalAmount + '</span>';
										}
									} ],

							editable : true,
							scrollable : true,
							sortable : true,
							width : "950px",
							save : function(e) {
								if (e.values.eqcostArrivalAmount > e.model.orderRequestCount) {
									alert("最多可以到货" + e.model.orderRequestCount);
									e.preventDefault();
								}
							}
					});
	
	}else{
		alert("无设备清单");
		cancelArrivalNoticeWindow();
	}
}

function checkArrivalNotice() {
	alert("到货通知已经产生");
	cancelArrivalNoticeWindow();
}

function cancelArrivalNoticeWindow(){

	loadPage("purchasecontract_purchaseOrder");
}
function submitArrivalNotice() {
	if(itemDataSource.at(0)){		
		//force set haschanges = true
		itemDataSource.at(0).set("uid", kendo.guid());
		// 同步数据
		itemDataSource.sync();

	}else{
		alert("无设备清单");
	}

}
