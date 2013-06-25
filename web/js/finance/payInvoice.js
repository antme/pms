var requestModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		payInvoiceDepartment: {nullable: true},
		payInvoiceProposerId: {},
		payInvoiceProposerName: {},
		payInvoiceStatus:{},
		payInvoicePlanDate: {type:"date",nullable: true},
		payInvoiceReceivedMoneyStatus:{},
		payInvoiceSubmitDate: {type:"date"},
		payInvoiceApproveDate: {type:"date"},
		payInvoiceCheckDate: {type:"date"},
		payInvoiceSignDate: {type:"date"},
		payInvoiceMoney: {},
		payInvoiceItemList: {nullable: true},
		payInvoiceActualMoney:{},
		payInvoiceActualDate:{},
		payInvoiceActualInvoiceNum:{},
		payInvoiceActualSheetCount:{},
		invoiceType:{},
		salesContractId:{},
		contractCode:{},
		projectId:{},
		operateType:{}
	}
});

var listDatasource = new kendo.data.DataSource({
    transport: {
        read:  {
            url: baseUrl + "/sc/invoice/list",
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
	
$(document).ready(function () {	
	checkRoles();
	
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    selectable : "row",
	    sortable : true,
		filterable : filterable,
	    columns: [
	        {field:"payInvoiceMoney", title:"合计开票金额"},
	        {field:"payInvoicePlanDate", title:"建议出票日期",format: "{0:yyyy/MM/dd}"},
	        {field:"payInvoiceActualDate", title:"出票日期",format: "{0:yyyy/MM/dd hh:mm}"},
	        {field:"payInvoiceReceivedMoneyStatus", title:"收款情况"},
	        {field:"invoiceType", title:"开票类型"},
	        {field:"contractCode", title:"销售合同编号"},
	        {field:"payInvoiceStatus", title:"状态"}
	    ]
	});
});

function add(){
	loadPage("payInvoiceEdit",{actionType:"add"});
}
function edit(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.payInvoiceStatus === "已出票" || row.payInvoiceStatus === "财务已审核"){
		alert("请选择‘经理已审核’的数据");		
	} else {	
		loadPage("payInvoiceEdit", { _id : row._id ,actionType:"approve"});	
	}
}
function done(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.payInvoiceStatus !== "财务已审核"){
		alert("请选择‘财务已审核’的数据");
	} else {	
		loadPage("payInvoiceEdit", { _id : row._id ,actionType:"approve"});	
	}
}