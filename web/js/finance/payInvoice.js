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
	
$(document).ready(function () {	
	checkRoles();
	
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    selectable : "row",
	    sortable : true,
	    columns: [
	        {hidden: true, field: "contractId" },
	        {field:"contractCode", title:"销售合同编号"},
	        {field:"invoiceType", title:"发票类型"},
	        {field:"contractAmount", title:"合同总额"},
	        {field:"totalPayInvoiceActualMoney", title:"已开票总额" },
	        {field:"countDone", title:"已开票数"},
	        {field:"totalPayInvoiceMoney", title:"开票申请总额" },
	        {field:"count", title:"开票申请数"}
	    ]
	});
});
function viewPI(){
	var row = getSelectedRowDataByGrid("grid");
	if(!row) {
		alert("点击列表可以选中数据");
	}else{
		loadPage("payInvoiceView", {salesContractId:row._id});		
	}	
}
function addPI(){
	var row = getSelectedRowDataByGrid("grid");
	if(!row) {
		alert("点击列表可以选中数据");
	}else{
		loadPage("payInvoiceEdit",{salesContractId: row._id});
	}	
}
function editManagerPI(){
	var row = getSelectedRowDataByGrid("grid");
	if(!row) {
		alert("点击列表可以选中数据");
	} else if(row.payInvoiceStatus == "待审核"){
		loadPage("payInvoiceEdit", {_id:row._id});		
	} else {	
		alert("请选择‘待审核’的数据");
	}
}
function editFinPI(){
	var row = getSelectedRowDataByGrid("grid");
	if(!row) {
		alert("点击列表可以选中数据");
	} else if(row.payInvoiceStatus == "经理已审核"){
		loadPage("payInvoiceEdit", {_id:row._id});		
	} else {	
		alert("请选择‘经理已审核’的数据");
	}
}
function donePI(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.payInvoiceStatus == "财务已审核"){
		loadPage("payInvoiceEdit", {_id:row._id});	
	} else {	
		alert("请选择‘财务已审核’的数据");
	}
}