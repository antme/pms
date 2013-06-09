var requestDataItem;

var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		orderCode : {
			editable : false
		},
		goodsDeliveryArrivedTime : {
			type : "date"
		},
		purchaseContractCode : {

		},
		signDate : {
			type : "date"
		}
	}
});


$(document).ready(function() {
	$("#tabstrip").kendoTabStrip({
		animation : {
			open : {
				effects : "fadeIn"
			}
		}
	});
	
	if (!$("#purchasecontractin").data("kendoDropDownList")) {
		$("#purchasecontractin").kendoDropDownList({
			dataTextField : "orderCode",
			dataValueField : "_id",
			dataSource : {
				transport : {
					read : {
						dataType : "jsonp",
						url : "/service/purcontract/order/list",
					}
				}
			}
		});
	}
	if (redirectParams) {
		postAjaxRequest("/service/purcontract/get", redirectParams, edit);
	} else {
		edit();
	}
});



var itemDataSource = new kendo.data.DataSource({
	transport : {
		update : {
			url : "/service/purcontract/update",
			dataType : "jsonp",
			type : "post"
		},
		create : {
			url : "/service/purcontract/add",
			dataType : "jsonp",
			type : "post"
		},
		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {

					// 解析成json_p模式
					json_p : kendo.stringify(requestDataItem),
					mycallback : "checkStatus"
				};
			}
		},
		requestEnd : function(e) {
			var response = e.response;
		}
	},
	schema : {
		model : model
	},
	batch : true
});



function save() {
	// 同步数据
	itemDataSource.sync();
	
	
}

function checkStatus() {
	loadPage("purchasecontract", null);
}
// 计算成

function showOrderWindow() {
	// 如果用户用默认的采购申请，select event不会触发， 需要初始化数据
	var kendoGrid = $("#purchasecontractin").data("kendoDropDownList");
	if (!requestDataItem) {
		requestDataItem = kendoGrid.dataSource.at(0);
	}
	// 新增，所以设置_id为空
	requestDataItem.set("_id", "");
	edit();
}

function edit(data) {

	// 初始化空对象
	var dataItem = new model();
	if(data){
		requestDataItem = data;
	}

	if (requestDataItem) {
		// 如果是从采购申请选择过来的
		dataItem = new model(requestDataItem);
	}

	kendo.bind($("#purchasecontract-edit"), dataItem);

	
	var eqcostList = dataItem.eqcostList;
	
	if(eqcostList){
		for (i = 0; i < eqcostList.length; i++) {
			if (!eqcostList[i].goodsDeliveryType) {
				eqcostList[i].goodsDeliveryType = "";
			}
		}
	}
	// 渲染成本编辑列表
	itemDataSource.data(dataItem.eqcostList);


	$("#purchasecontract-edit-item").show();
	$("#purchasecontract-select").hide();

	$("#orderCode").html(dataItem.orderCode);
	$("#projectName").html(dataItem.projectName);
	$("#projectCode").html(dataItem.projectCode);
	$("#customerContractCode").html(dataItem.customerContractCode);
	$("#customerRequestContractId").html(dataItem.customerRequestContractId);

	$("#signDate").kendoDatePicker();

	if (!$("#purchasecontract-edit-grid").data("kendoGrid")) {
		$("#purchasecontract-edit-grid").kendoGrid({
			dataSource : itemDataSource,
			columns : [ {
				field : "eqcostNo",
				title : "货品编号",
				width : 80
			}, {
				field : "eqcostProductName",
				title : "货品名",
				width : 80
			}, {
				field : "goodsType",
				title : "货品类别",
				width : 80
			}, {
				field : "eqcostProductType",
				title : "货品型号",
				width : 80

			}, {
				field : "orderGoodsUnitPrice",
				title : "单价",
				width : 50
			}, {
				field : "totalMoney",
				title : "小计金额",
				width : 80
			}, {
				field : "goodsDeliveryStatus",
				title : "货品物流状态",
				width : 100
			}, {
				field : "goodsDeliveryType",
				title : "物流类型",
				width : "160px",
				editor : categoryDropDownEditor,
				template : "#=goodsDeliveryType#"
			}, {
				field : "goodsDeliveryArrivedTime",
				title : "货品预计到达时间"
			} ],
			scrollable : true,
			editable : true,
			width : "800px"

		});
	}
}

function categoryDropDownEditor(container, options) {
	var data = [ {
		name : "直发"
	}, {
		name : "上海仓库"
	} ];

	$('<input required data-text-field="name" data-value-field="name" data-bind="value:'
					+ options.field + '"/>').appendTo(container)
			.kendoDropDownList({
				autoBind : false,
				dataSource : data
			});
}
