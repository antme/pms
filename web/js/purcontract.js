var model = kendo.data.Model.define({
	id : "_id",
	dataSource : dataSource,
	fields : {
		orderId : {
			editable : false
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
		model : {
			id : "_id",
			fields : {
				_id : {
					editable : false,
					nullable : true
				}
			}
		}

	}
});
$(document).ready(function() {

	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		editable : "popup",
		toolbar : [ {
			template : kendo.template($("#template").html())
		} ],
		columns : [ {
			field : "contractId",
			title : "采购合同编号"
		}, {
			field : "customerContractId",
			title : "客户合同编号"
		}, {
			field : "contractRequestId",
			title : "采购申请编号"
		}, {
			field : "conractOrderId",
			title : "采购订单编号"

		}, {
			field : "customerName",
			title : "客户名"
		}, {
			field : "projectManager",
			title : "PM"
		}, {
			field : "status",
			title : "采购合同状态"
		}, {
			field : "contractDate",
			title : "合同签署时间"
		}, {
			field : "contractDate",
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
			command : [ "edit", {
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
		dataTextField : "ProductName",
		dataValueField : "ProductID",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "http://demos.kendoui.com/service/Products",
				}
			}
		}
	});

}

var reoptions = {
	id : "purchasecontract-select",
	width : "400px",
	height : "300px",
	title : "选择采购订单",
	activate : onRequestSelectWindowActive
};

function add() {
	openWindow(reoptions);

}

function cancelSelectRequest() {
	var window = $("#" + reoptions.id);
	if (window.data("kendoWindow")) {
		window.data("kendoWindow").close();
	}
}

function showOrderWindow() {
	edit(null);
	cancelSelectRequest();
}

function edit(e) {

	var dataItem = new model();
	if (e) {
		e.preventDefault();
		dataItem = this.dataItem($(e.currentTarget).closest("tr"));
	}
	kendo.bind($("#purchasecontract-edit"), dataItem);
	$("#orderId").html(dataItem.orderId);

	var options = {
		id : "purchasecontract-edit",
		width : "900px",
		height : "500px",
		title : "编辑采购订单"
	};
	openWindow(options);

	$("#purchasecontract-edit-grid").kendoGrid({
		columns : [ {
			field : "orderId",
			title : "货品编号",
			width : 150
		}, {
			field : "customerContractId",
			title : "货品名",
			width : 150
		}, {
			field : "contractRequestId",
			title : "货品类别",
			width : 150
		}, {
			field : "purchaseConractId",
			title : "货品型号",
			width : 150

		}, {
			field : "customerName",
			title : "合同中总数",
			width : 150
		}, {
			field : "projectManager",
			title : "可申请数量",
			width : 150
		}, {
			field : "status",
			title : "本次申请数量",
			width : 150
		}, {
			field : "approveDate",
			title : "参考单价",
			width : 150
		}, {
			field : "money",
			title : "申请小计金额",
			width : 150
		}, {
			field : "number",
			title : "订单货品编号",
			width : 150
		}, {
			field : "numberExists",
			title : "订单货品名%",
			width : 150
		}, {
			field : "numberExistsRequest",
			title : "订单货品型号%",
			width : 150
		}, {
			field : "numberExistsRequest",
			title : "订单货品单价",
			width : 150
		}, {
			field : "numberExistsRequest",
			title : "订单实际小计金额",
			width : 150
		}, {
			field : "numberExistsRequest",
			title : "金额差值",
			width : 150
		} ],
		scrollable : true,
		width : "800px"

	});

}
