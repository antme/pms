var crudServiceBaseUrl = "../service";

var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		supplierCode: { validation: { required: true } },
		supplierName: { validation: { required: true } },
		supplierDescription: { validation: { required: true } },
		supplierBankName: { validation: { required: true } },
		supplierBankAccount: { validation: { required: true } },
		supplierTaxAccount: { validation: { required: true } },
		supplierContact: { validation: { required: true } },
		supplierLocation: {},
		supplierAddress: {},
		supplierContactPhone: { validation: { required: true } },
		supplierEmail: {},
		supplierFax: {},
		supplierRemark: {}
	}

});
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : crudServiceBaseUrl + "/suppliers/list",
			dataType : "jsonp"
		},
		update : {
			url : crudServiceBaseUrl + "/suppliers/update",
			dataType : "jsonp",
			method: "post"
		},
		destroy : {
			url : crudServiceBaseUrl + "/suppliers/destroy",
			dataType : "jsonp",
			method: "post"
		},
		create : {
			url : crudServiceBaseUrl + "/suppliers/create",
			dataType : "jsonp"
		},
		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {
					models : kendo.stringify(options.models)
				};
			}
		}
	},
	batch : true,
	pageSize : 20,
	schema : {
		model : model,
		total: "total", // total is returned in the "total" field of the response
		data: "data"

	}
});
var dm = new model();

$(document).ready(function() {
	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		height : 430,
		toolbar : [ {
			template : kendo.template($("#template").html())
		} ],
		columns : [
		    { field : "supplierCode", title : "供应商编号" },
	        { field : "supplierName", title : "供应商名称" },
	        { field : "supplierDescription", title : "供应商描述" },
	        { field : "supplierBankName", title : "开户行" },
	        { field : "supplierBankAccount", title : "银行账号" },
	        { field : "supplierTaxAccount", title : "税号" },
	        { field : "supplierContact", title : "供应商联系人" },
	        { field : "supplierLocation", title : "供应商所在地" },
	        { field : "supplierAddress", title : "地址" },
	        { field : "supplierContactPhone", title : "联系人电话" },
	        { field : "supplierEmail", title : "联系人邮箱" },
	        { field : "supplierFax", title : "传真" },
	        { field : "supplierRemark", title : "备注" },
	        { command : [ "edit", "destroy" ], title : "&nbsp;" }
        ],
		editable : "popup"
	});
});

function addNewSupplier() {
	kendo.bind($("#supplier-edit"), dm);
	var options = {id:"supplier-edit", width:"900px", height: "500px", title:"新建供应商"};
	openWindow(options);
}

function saveData() {
	dataSource.add(dm);
	dataSource.sync();
	var window = $("#supplier-edit");

	if (window.data("kendoWindow")) {
		window.data("kendoWindow").close();
	}

	var grid = $("#grid");
	if (window.data("kendoGrid")) {
		window.data("kendoGrid").refresh();
	}

}