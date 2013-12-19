var crudServiceBaseUrl = "../service";
var listUrl = "/service/suppliers/list";

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
			url : listUrl,
			dataType : "jsonp",
			type : "post"
		},
		update : {
			url : crudServiceBaseUrl + "/suppliers/update",
			dataType : "jsonp",
			method: "post"
		},		
		create : {
			url : crudServiceBaseUrl + "/suppliers/create",
			dataType : "jsonp",
			method: "post"
		}
	},
	parameterMap : function(options, operation) {
		if (operation !== "read" && options.models) {
			return {
				models : kendo.stringify(options.models)
			};
		}
	},
	pageSize: 10,
	serverPaging: true,
	serverSorting: true,
	serverFiltering : true,
	batch : true,
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
		pageable : true, resizable: true,
		sortable : true,
		filterable : filterable,
		selectable : "row",
		toolbar : [ {
			template : kendo.template($("#template").html())
		} ],
		columns : [
		    { field : "supplierCode", title : "供应商编号",width:"100px" },
	        { field : "supplierName", title : "公司名称",width:"200px" },
	        { field : "supplierContact", title : "联系人",width:"100px" },
	        { field : "supplierContactPhone", title : "电话",width:"100px" },
	        { field : "supplierContactMobile", title : "手机",width:"100px" },
	        { field : "supplierAddress", title : "地址",width:"250px" }
        ]
	});
	
	validator = $("#supplier-form-validate").kendoValidator().data("kendoValidator");
	
	
    $("#files").kendoUpload({
        async: {
            saveUrl: "/service/suppliers/upload",
            autoUpload: true
        },
        success:function(e){
        	loadPage("supplier_supplier");
        }
    });	
	
	
});


function editSupplier(){
	var rowData = getSelectedRowDataByGrid("grid");
	dm = rowData;
	kendo.bind($("#supplier-edit"), dm);
	var options = {id:"supplier-edit", width:"700px", height: "400px", title:"编辑供应商"};
	openWindow(options);
}
function addNewSupplier() {
	kendo.bind($("#supplier-edit"), dm);
	var options = {id:"supplier-edit", width:"700px", height: "400px", title:"新增供应商"};
	openWindow(options);
}

function saveData() {
	if(!validator.validate()){
		return false;
	}
	

	
	postAjaxRequest(crudServiceBaseUrl + "/suppliers/create", {json_p: kendo.stringify(dm)}, function(data){
		var window = $("#supplier-edit");

		if (window.data("kendoWindow")) {
			window.data("kendoWindow").close();
		}

		var grid = $("#grid");
		if (window.data("kendoGrid")) {
			window.data("kendoGrid").refresh();
		};
		loadPage("supplier_supplier");
	});
	
	
}
function myreflush(){
	loadPage("supplier_supplier");
}