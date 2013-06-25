var requestModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		invoiceType:{
			nullable : true
		},
		getInvoiceActualMoney:{
			type: "number",
			nullable : true
		},
		getInvoiceActualDate:{
			type:"date",
			nullable : true
		}
	}
});

var listDatasource = new kendo.data.DataSource({
    transport: {
        read:  {
            url: baseUrl + "/purcontract/invoice/list",
            dataType: "jsonp",
            type : "post"
        },
        destroy: {
            url: baseUrl + "/purcontract/invoice/destroy",
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
        total: "total",
        data:"data"
    }
});

$(document).ready(function () {
	checkRoles();
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    selectable : "row",
	    sortable : true,
		filterable : filterable,
	    columns: [
	        {
	        	field:"getInvoiceActualMoney", 
	        	title:"收票金额",
	        	template : function(dataItem) {
					return '<a  onclick="openGetInvoiceViewWindow(\'' + dataItem._id + '\');">' + dataItem.getInvoiceActualMoney + '</a>';
				}	        	
	        },
	        {field:"getInvoiceActualDate", title:"收票日期",format: "{0:yyyy/MM/dd}"},
	        {field:"getInvoiceReceivedMoneyStatus", title:"付款情况"},
	        {field:"invoiceType", title:"票据类型"},
	        {field:"purchaseContractCode", title:"采购合同编号"}
	    ]
	});
	
});

function addGI(){
	loadPage("getInvoiceEdit",{operateType:"add"});
}
function editGI(){
	var row = getSelectedRowDataByGrid("grid");
	if(!row) {
		alert("点击列表可以选中数据");
	} else {
		loadPage("getInvoiceEdit", {_id:row._id});		
	}
}
function destroyGI(){
	var row = getSelectedRowDataByGrid("grid");
	if(!row) {
		alert("点击列表可以选中数据");
	} else {
		postAjaxRequest(baseUrl+"/purcontract/invoice/destroy", {_id:row._id}, function(){listDatasource.read();});
	}	
}