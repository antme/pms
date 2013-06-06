var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		orderCode : {
			editable : false
		},
		goodsDeliveryArrivedTime : {
			type : "date"
		},
		purchaseContractCode: {
			
		},
		signDate : {
			type: "date"
		}
	}
});

var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/purcontract/list",
			dataType : "jsonp"
		},
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

		destroy : {
			url : "/service/purcontract/delete",
			dataType : "jsonp",
			type : "post"
		},

		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {
					models : kendo.stringify(options.models)
				};
			}
		},
	},
	pageSize : 10,
	batch : true,
	schema : {
		model : model

	}
});
$(document).ready(function() {
	$("#tabstrip").kendoTabStrip({
        animation:  {
            open: {
                effects: "fadeIn"
            }
        }
    });
	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		editable : "popup",
		selectable : "row",
		toolbar : [ {
			template : kendo.template($("#template").html())
		} ],
		columns : [ {
			field : "purchaseContractCode",
			title : "采购合同编号"
		}, {
			field : "customerContractCode",
			title : "客户合同编号"
		}, {
			field : "purchaseRequestCode",
			title : "采购申请编号"
		}, {
			field : "orderCode",
			title : "采购订单编号"

		}, {
			field : "customerName",
			title : "客户名"
		}, {
			field : "projectManager",
			title : "PM"
		}, {
			field : "stauts",
			title : "采购合同状态"
		}, {
			field : "signDate",
			title : "合同签署时间"
		}, {
			field : "contractMoney",
			title : "金额"
		}, {
			field : "type",
			title : "物流类型"
		}, {
			field : "supplierName",
			title : "供应商名"
		}, {
			field : "supplierId",
			title : "供应商编号"
		},

		{
			command : [ {
				text : "编辑",
				click : edit
			}, {
				name : "destroy",
				title : "删除",
				text : "删除"
			} ],
			title : "&nbsp;",
			width : "160px"
		} ]

	});
});

function onRequestSelectWindowActive(e) {
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
var requestDataItem;

var reoptions = {
	id : "purchasecontract-edit",
	width : "950px",
	height : "600px",
	title : "采购合同",
	activate : onRequestSelectWindowActive
};

function onWindowClose(){
	
	dataSource.read();
}

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
			console.log(e.type);
		}
	},
	schema : {
		model : model
	},
	batch : true
});

function add() {
	$("#purchasecontract-select").show();
	$("#purchasecontract-edit-item").hide();
	openWindow(reoptions);

}

function save() {

	// 同步数据
	itemDataSource.sync();
}


function approve() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		$.ajax({
			url : "/service/purcontract/approve",
			success : function(responsetxt) {
				var res;
				eval("res=" + responsetxt);
				if (res.status == "0") {
					alert(res.msg);
				} else {
					alert("审核成功");
					dataSource.read();
				}
			},

			error : function() {
				alert("连接Service失败");
			},

			data : {
				_id : row._id
			},
			method : "post"
		});
	}

}

function reject() {
	var row = getSelectedRowDataByGrid("grid");

	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		$.ajax({
			url : "/service/purcontract/reject",
			success : function(responsetxt) {
				var res;
				eval("res=" + responsetxt);
				if (res.status == "0") {
					alert(res.msg);
				} else {
					alert("拒绝成功");
					dataSource.read();
				}
			},

			error : function() {
				alert("连接Service失败");
			},

			data : {
				_id : row._id
			},
			method : "post"
		});
	}
}

function checkStatus(data) {

	if (data._id !== "") {
		requestDataItem.set("_id", data._id);
	}
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

function edit(e) {

	// 初始化空对象
	var dataItem = new model();

	if (requestDataItem) {
		// 如果是从采购申请选择过来的
		dataItem = requestDataItem;
	}

	if (e) {
		// 如果是从订单列表页点击edit过来的数据
		e.preventDefault();
		openWindow(reoptions);
		dataItem = this.dataItem($(e.currentTarget).closest("tr"));
		requestDataItem = dataItem;
	}

	
	
	var orderList = dataItem.orderList;
	for (i = 0; i < orderList.length; i++) {
		if (!orderList[i].goodsDeliveryType) {
			orderList[i].goodsDeliveryType = "";
		}
	}
	console.log(dataItem.orderList);
	// 渲染成本编辑列表
	itemDataSource.data(dataItem.orderList);

	kendo.bind($("#purchasecontract-edit"), dataItem);

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
				field : "goodsCode",
				title : "货品编号",
				width : 80
			}, {
				field : "goodsName",
				title : "货品名",
				width : 80
			}, {
				field : "goodsType",
				title : "货品类别",
				width : 80
			}, {
				field : "goodsModel",
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

	$(
			'<input required data-text-field="name" data-value-field="name" data-bind="value:'
					+ options.field + '"/>').appendTo(container)
			.kendoDropDownList({
				autoBind : false,
				dataSource : data
			});
}
