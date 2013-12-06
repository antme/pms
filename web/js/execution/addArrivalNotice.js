var editUrl = "/service/arrivalNotice/order/eqlist";
var saveUrl =  "/service/arrivalNotice/create/byorder";

// 声明一个总的对象用来传递数据
var requestDataItem = undefined;

$(document).ready(function() {
	if(!popupParams.type){
		postAjaxRequest(editUrl, popupParams, edit);
	}else{
		disableAllInPoppup();
		postAjaxRequest("/service/arrivalNotice/get", popupParams, edit);
	}
	
});

var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		eqcostAvailableAmount : {
			type : "number"
		},
		pbPlanDate:{type:"date"},
		pbDepartment:{
			
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
					mycallback : "closeWindow"
				}
			}
		}
	},
	batch : true,
	schema : {
		model : model
	}
});



function edit(data) {

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
		cancelNotice();
	}
}

function closeWindow() {
	alert("到货通知已生产");
	var window = $("#popup");
	window.data("kendoWindow").close();
	
	loadPage("purchasecontract_purchaseOrder");
}

function cancelNotice(){
	var window = $("#popup");
	window.data("kendoWindow").close();
	
	loadPage("purchasecontract_purchaseOrder");
}
function submitNotice() {
	if(itemDataSource.at(0)){		
		//force set haschanges = true
		itemDataSource.at(0).set("uid", kendo.guid());
		// 同步数据
		itemDataSource.sync();

	}else{
		alert("无设备清单");
	}

}
