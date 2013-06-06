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
		id : "purchasecontract-edit",
		width : "950px",
		height : "600px",
		title : "添加采购申请",
		activate : onRequestSelectWindowActive
	};

	function add() {
		openWindow(reoptions);
	}

	


function showOrderWindow() {
	edit(null);
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
			width : 80
		}, {
			field : "customerContractId",
			title : "货品名",
			width : 80
		}, {
			field : "contractRequestId",
			title : "货品类别",
			width : 80
		}, {
			field : "purchaseConractId",
			title : "货品型号",
			width : 80

		}, {
			field : "customerName",
			title : "单价",
			width : 50
		}, {
			field : "projectManager",
			title : "小计金额",
			width : 80
		}, {
			field : "status",
			title : "物流目的地类型",
			width : 100
		}, {
			field : "approveDate",
			title : "货品物流状态",
			width : 100
		}, {
			field : "money",
			title : "货品预计到达时间"
		}],
		scrollable : true,
		width : "800px"

	});

}
