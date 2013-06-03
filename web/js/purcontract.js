$(document).ready(function() {

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

	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		editable : "popup",
		toolbar : [ {
			name : "create",
			text : "添加"
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
