
var subModel = kendo.data.Model.define({
	id : "itemNo",
	fields : {
		itemNo: {nullable: true},
		itemMonth: {nullable: true},
		itemContent: {nullable:true},
		itemComment: {},
		itemMoney: {type: "number",validation: {min: 0}}
	}
});
var subMoneyModel = kendo.data.Model.define({
    id: "_id",
    fields: {
   	   _id: {  editable: false, nullable: true},
       getMoneyActualMoney: {type:"number",validation: {required: true } },
       getMoneyActualDate: { type:"date",validation: {required: true }},
   	   getMoneyComment:{},
   	   creatorName:{editable : false},
       salesContractId: {},
       salesContractCode: {},
       customerBankName:{},
       customerBankAccount:{}
    }
});
var myModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		payInvoiceDepartment: {},
		payInvoiceStatus:{},
		payInvoicePlanDate: {type:"date"},
		payInvoiceReceivedMoneyStatus:{},
		payInvoiceSubmitDate: {},
		payInvoiceMoney: {},
		payInvoiceItemList: {},
		payInvoiceActualMoney:{},
		payInvoiceActualDate:{type:"date"},
		payInvoiceActualInvoiceNum:{},
		payInvoiceActualSheetCount:{},
		invoiceType:{},
		salesContractId:{},
		contractCode:{},
		projectId:{},
		operateType:{}
	}
});
var currentObj = new myModel();

$(document).ready(function () {
	checkRoles();
	$("#invoiceGrid").kendoGrid({
		dataSource: {
			schema: {
				model: myModel
			},
		    batch: true,
		    pageSize: 5,
			aggregate: [ 
			        { field: "creatorName", aggregate: "count" },
			        { field: "payInvoiceMoney", aggregate: "sum" },
			        { field: "payInvoiceActualMoney", aggregate: "sum"}
			]
		},
	    pageable: true,
	    sortable : true,
		selectable : "row",
        detailTemplate: kendo.template($("#template").html()),
        detailInit: detailInit,
	    columns: [
			{ field: "_id", hidden: true},
			{ field: "creatorName", title: "申请人" ,footerTemplate: "总条数: #=count#"},
			{ field: "payInvoiceStatus", title: "状态" },
			{ field: "payInvoicePlanDate", title: "要求日期",format: "{0: yyyy-MM-dd HH:mm:ss}"},
			{ field: "payInvoiceMoney", title: "金额" ,footerTemplate: "总额: #=sum#"},
			{ field: "payInvoiceReceivedMoneyStatus", title: "收款情况"},
			{ field: "payInvoiceActualMoney", title: "实际金额" ,footerTemplate: "实际总额: #=sum#"},
			{ field: "payInvoiceActualDate", title: "实际开票日期",format: "{0:yyyy/MM/dd}" },
			{ field: "payInvoiceActualInvoiceNum", title: "发票号" },
			{ field: "payInvoiceActualSheetCount", title: "开票张数"},
			{ hidden: true, field: "payInvoiceItemList" },
	  	]
	});

	$("#moneyGrid").kendoGrid({
		dataSource: {		
			schema: {
				model: subMoneyModel
			},		    
			batch: true,
		    pageSize: 5,
			aggregate: [ 
			        { field: "creatorName", aggregate: "count" },
			        { field: "getMoneyActualMoney", aggregate: "sum" }
			]
		},
	    pageable: true,
	    sortable : true,
	    columns: [
			{ field: "_id", hidden: true},
			{ field: "creatorName", title: "申请人" ,footerTemplate: "总条数: #=count#"},
			{ field: "getMoneyActualMoney", title: "收款金额",footerTemplate: "总额: #=sum#" },
			{ field: "getMoneyActualDate", title: "收款日期",format: "{0:yyyy/MM/dd}"},
			{ field: "customerBankName", title: "客户开户行"},
			{ field: "customerBankAccount", title: "客户开户行号"},
			{ field: "getMoneyComment", title: "备注"}
	  	]
	});

	if(redirectParams && redirectParams.salesContractId){
		postAjaxRequest(baseUrl+"/sc/invoice/view", redirectParams, editSucess);
	}
	kendo.bind($("#form-container"), currentObj);
});

function detailPI(){
	var row = getSelectedRowDataByGrid("invoiceGrid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {	
		loadPage("finance_payInvoiceEdit", { _id : row._id});
	}
}
function editSucess(e){
	currentObj = new myModel(e);
	kendo.bind($("#form-container"), currentObj);
}
function detailInit(e) {
    var detailRow = e.detailRow;
    console.log(e);
    detailRow.find(".tabstrip").kendoTabStrip({
        animation: {
            open: { effects: "fadeIn" }
        }
    });

    detailRow.find(".orders").kendoGrid({
    	dataSource: e.data.payInvoiceItemList,
        scrollable: false,
        sortable: true,
        columns: [
            { field: "itemNo", title:"编号", width: "56px" },
            { field: "itemMonth", title:"月份", width: "110px" },
            { field: "itemContent", title:"内容" },
            { field: "itemComment", title:"备注" },
            { field: "itemMoney", title: "金额", width: "190px" }
        ]
    });
}
