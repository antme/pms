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
			dataType : "jsonp",
			method: "post"
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
	pageSize : 10,
	schema : {
		model : model,
		total: "total", // total is returned in the "total" field of the response
		data: "data"

	}
});
var dm = new model();
var validator;
$(document).ready(function() {
	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		resizable: true,
		selectable : "row",
		toolbar : [ {
			template : kendo.template($("#template").html())
		} ],
		columns : [
		    { field : "supplierCode", title : "供应商编号",width:"150px" },
	        { field : "supplierName", title : "供应商名称",width:"250px" },
	        { field : "supplierContact", title : "供应商联系人",width:"120px" },
	        { field : "supplierContactPhone", title : "联系人电话",width:"120px" },
	        { field : "supplierEmail", title : "联系人邮箱",width:"200px" },
	        { command : [{name:"edit",text:"编辑"},{name:"destroy",text:"删除"}], title : "&nbsp;",width:"160px" }
        ],
		editable : "popup"
	});
	
	validator = $("#supplier-form-validate").kendoValidator().data("kendoValidator");
	
});

function addNewSupplier() {
	kendo.bind($("#supplier-edit"), dm);
	var options = {id:"supplier-edit", width:"500px", height: "200px", title:"新增供应商"};
	openWindow(options);
}

function saveData() {
	if(!validator.validate()){
		return false;
	}
	console.log(11111);
	dataSource.add(dm);
	dataSource.sync();
	var window = $("#supplier-edit");

	if (window.data("kendoWindow")) {
		window.data("kendoWindow").close();
	}

	var grid = $("#grid");
	if (window.data("kendoGrid")) {
		window.data("kendoGrid").refresh();
	}console.log(222);
	loadPage("supplier");
	console.log(333);
}
function myreflush(){
	loadPage("supplier");
}