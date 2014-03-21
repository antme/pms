
var requestModel = kendo.data.Model.define({
    id: "_id",
    fields: {
        _id: { editable: false, nullable: true },
        code: { editable: false},
        name: { validation: { required: true } },
        description: { },
        bankName: { validation: { required: true } },
        bankAccount: { validation: { required: true } },
        taxAccount: { validation: { required: true } },
        contact: {},
        location: {},
        address: {},
        phone: {},
        email: {},
        fax: {},
        remark: {}
    }
});

var datasource = new kendo.data.DataSource({
    transport: {
        read:  {
            url: "/service/customer/list",
            dataType: "jsonp",
            type : "post"
        },
        update: {
            url: "/service/customer/update",
            dataType: "jsonp",
            type : "post"
        },
        destroy: {
            url:"/service/customer/destroy",
            dataType: "jsonp",
            type : "post"
        },
        create: {
            url: "/service/customer/create",
            dataType: "jsonp",
            type : "post"
        },
        parameterMap: function(options, operation) {
            if (operation !== "read" && options.models) {
                return {
                	models: kendo.stringify(options.models),
    				mycallback : "myreflush"    	
                };
            } else if(operation === "read"){
            	return {
            		page : options.page,
            		pageSize : options.pageSize,
            		skip : options.skip,
            		take : options.take
            	}
             }
        }
    },
    batch: true,
    pageSize: 10,
	serverPaging: true,
	serverSorting: true,
	serverFiltering : true,
    schema: {
        model: requestModel,
        total: "total",
        data:"data"
    }
});

function editCustomer(){
	
	var rowData = getSelectedRowDataByGridWithMsg("grid");
	if(rowData){

		var grid = $("#grid").data("kendoGrid");
		var row = grid.select();
		grid.editRow(row);
		
	}
}

$(document).ready(function () {
    $("#grid").kendoGrid({
        dataSource: datasource,
        pageable: true, resizable: true,
        resizable: true,
        filterable : filterable,
        sortable : true,
        selectable : "row",
        toolbar: [
            { template: kendo.template($("#t-template-add").html()) }
        ],
        
        columns: [
            { field: "code", title: "客户编号",width:"150px"},
            { field: "name", title: "客户名称",width:"250px" },
            { field: "contact", title: "客户联系人",width:"80px" },
            { field: "phone", title: "联系人电话",width:"120px" },
            { field: "email", title: "联系人邮箱",width:"200px" }
        ],
        editable: "popup"
    });
    
    checkRoles();
    
});

function myreflush(){
	loadPage("customer_customer");
}