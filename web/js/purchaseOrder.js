// 外面列表页的datasource对象
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
	batch : true
});

$(document).ready(function() {

	if ($("#grid").length > 0) {
		// 初始化采购订单列表页
		$("#grid").kendoGrid({
			dataSource : dataSource,
			pageable : true,
			editable : "popup",
			selectable : "row",
			width : "1000px",
			dataBound : function(e) {
				kendo.ui.progress($("#grid"), false);
			},
			// 自定义toolbar，参见html中模板代码
			toolbar : [ {
				template : kendo.template($("#template").html())
			} ],
			columns : [ {
				field : "orderCode",
				title : "订单编号"
			}, {
				field : "customerContractCode",
				title : "客户合同编号"
			}, {
				field : "purchaseRequestCode",
				title : "采购申请编号"
			}, {
				field : "purchaseContractCode",
				title : "采购合同编号"

			}, {
				field : "customerName",
				title : "客户名"
			}, {
				field : "projectManager",
				title : "PM"
			}, {
				field : "stauts",
				title : "订单状态"
			}, {
				field : "approvedDate",
				title : "批准时间"
			}, {
				field : "orderGoodsTotalMoney",
				title : "金额"
			}, {
				field : "requestedNumbers",
				title : "合同下采购申请单数量"
			}, {
				field : "numbersExists",
				title : "合同下已申请采购货品%"
			}, {
				field : "moneyOfContract",
				title : "合同下已申请采购金额%"
			},

			{
				command : [ {
					text : "Edit",
					// 自定义点击事件
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

	}

});

function checkStatus(data) {

	if (data._id !== "") {
		requestDataItem.set("_id", data._id);
	}
}

function approve() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		$.ajax({
			url : "/service/purcontract/order/approve",
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
			url : "/service/purcontract/order/reject",
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

function edit() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");
	
	refreshPage("purchaseOrderEdit", "_id="+row._id);
}
