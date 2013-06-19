var baseUrl = "../../service/purcontract";
var requestModel;
var listDatasource;
$(document).ready(function () {	
	requestModel = kendo.data.Model.define({
		id : "_id",
		fields : {
			_id : {
				editable : false,
				nullable : true
			},
			getInvoiceCode:{
				nullable : true
			},
			getInvoiceType:{
				type: "number",
				nullable : true
			},
			getInvoiceDate:{
				type:"date",
				nullable : true
			}
		}
	});

	listDatasource = new kendo.data.DataSource({
	    transport: {
            read:  {
	            url: baseUrl + "/invoice/list",
	            dataType: "jsonp",
	            type : "post"
            },
            update: {
	            url: baseUrl + "/invoice/update",
	            dataType: "jsonp",
	            type : "post"
            },
            destroy: {
	            url: baseUrl + "/invoice/destroy",
	            dataType: "jsonp",
	            type : "post"
            },
            create: {
	            url: baseUrl + "/invoice/add",
	            dataType: "jsonp",
	            type : "post"
            },
            parameterMap: function(options, operation) {
                if (operation !== "read" && options.models) {
                    return {models: kendo.stringify(options.models)};
                }
            }
	        
	    },
	    batch: true,
	    pageSize: 10,
	    schema: {
	        model: requestModel,
	        data:"data"
	    }
	});
    
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    toolbar: [{name:"create",text:"新增"}],
	    columns: [
	        {field:"getInvoiceCode", title:"收票编号"},
	        {field:"getInvoiceDate", title:"收票日期",format: "{0:yyyy/MM/dd hh:mm}"},
	        {field:"getInvoiceType", title:"类型"},
	        {command: [{name:"edit",text:"编辑"},{name:"destroy",text:"删除"}] }
	    ],
	    editable: "popup"
	});
});

