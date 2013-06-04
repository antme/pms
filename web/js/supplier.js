var crudServiceBaseUrl = "../service";

var model = kendo.data.Model.define({
	id : "_id",
	dataSource : dataSource,
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		supplierName : {
			validation : {
				required : true
			}
		},
		supplierAddress : {
			validation : {
				required : true,
				min : 1
			}
		},
		supplierContact : {},
		supplierContactPhone : {
			validation : {
				min : 0,
				required : true
			}
		}
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
			dataType : "jsonp"
		},
		destroy : {
			url : crudServiceBaseUrl + "/suppliers/destroy",
			dataType : "jsonp"
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
		model : model
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
		columns : [ {
			field : "supplierName",
			title : "供应商名字"
		}, {
			field : "supplierAddress",
			title : "供应商地址",
			width : "100px"
		}, {
			field : "supplierContact",
			title : "供应商联系人",
			width : "100px"
		}, {
			field : "supplierContactPhone",
			title : "供应商联系人电话",
			width : "100px"
		}, {
			command : [ "edit", "destroy" ],
			title : "&nbsp;",
			width : "160px"
		} ],
		editable : "popup"
	});
});

function addNewSupplier() {

	kendo.bind($("#supplier-edit"), dm);
	$("#supplier-edit").show();
	var window = $("#supplier-edit");
	if (!window.data("kendoWindow")) {
		window.kendoWindow({
			width : "900px",
			height : "500px",
			title : "新建供应商",
			modal : true,
		});
		window.data("kendoWindow").center();
	} else {
		window.data("kendoWindow").open();
		window.data("kendoWindow").center();
	}

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