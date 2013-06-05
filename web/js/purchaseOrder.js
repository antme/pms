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
			url : "/service/purcontract/order/list",
			dataType : "jsonp"
		},
		update : {
			url : "/service/purcontract/order/update",
			dataType : "jsonp",
			type : "post"
		},
		create : {
			url : "/service/purcontract/order/add",
			dataType : "jsonp",
			type : "post"
		},

		destroy : {
			url : "/service/purcontract/order/delete",
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
	pageSize : 20,
	batch : true,
	schema : {
		model : model
	}
});

$(document).ready(function() {

	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		editable : "popup",
		toolbar : [ {
			name : "create",
			text : "添加"
		} ],
		columns : [ {
			field : "orderId",
			title : "采购订单编号"
		}, {
			field : "customerContractId",
			title : "客户合同编号"
		}, {
			field : "contractRequestId",
			title : "采购申请编号"
		}, {
			field : "purchaseConractId",
			title : "采购合同编号"

		}, {
			field : "customerName",
			title : "客户名"
		}, {
			field : "projectManager",
			title : "PM"
		}, {
			field : "status",
			title : "采购订单状态"
		}, {
			field : "approveDate",
			title : "订单批准时间"
		}, {
			field : "money",
			title : "金额"
		}, {
			field : "number",
			title : "合同下采购申请单数量",
			width : 150
		}, {
			field : "numberExists",
			title : "合同下已申请采购货品%",
			width : 150
		}, {
			field : "numberExistsRequest",
			title : "合同下已申请采购金额%",
			width : 150
		},

		{
			command : [ {
				text : "Edit",
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

function edit(e) {
	e.preventDefault();
	var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
	kendo.bind($("#purchaseorder-edit"), dataItem);
	$("#orderId").html(dataItem.orderId);
	

	
	$("#purchaseorder-edit-grid").kendoGrid({
		dataSource : dataSource,
		columns : [ {
			field : "orderId",
			title : "采购订单编号"
		}, {
			field : "customerContractId",
			title : "客户合同编号"
		}, {
			field : "contractRequestId",
			title : "采购申请编号"
		}, {
			field : "purchaseConractId",
			title : "采购合同编号"

		}, {
			field : "customerName",
			title : "客户名"
		}, {
			field : "projectManager",
			title : "PM"
		}, {
			field : "status",
			title : "采购订单状态"
		}, {
			field : "approveDate",
			title : "订单批准时间"
		}, {
			field : "money",
			title : "金额"
		}, {
			field : "number",
			title : "合同下采购申请单数量",
			width : 150
		}, {
			field : "numberExists",
			title : "合同下已申请采购货品%",
			width : 150
		}, {
			field : "numberExistsRequest",
			title : "合同下已申请采购金额%",
			width : 150
		} ]

	});
	
	$("#purchaseorder-sum-grid").kendoGrid({
		dataSource : dataSource,
		columns : [ {
			field : "orderId",
			title : "采购订单编号"
		}, {
			field : "customerContractId",
			title : "客户合同编号"
		}, {
			field : "contractRequestId",
			title : "采购申请编号"
		}, {
			field : "purchaseConractId",
			title : "采购合同编号"

		} ],
		width:300

	});
	
}
