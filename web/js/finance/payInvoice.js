var invoiceModel = kendo.data.Model.define({
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
		payInvoiceActualDate:{type:"date"},
		payInvoiceActualInvoiceNum:{},
		payInvoiceActualSheetCount:{},
		invoiceType:{},
		scId:{},
		contractCode:{},
		projectId:{},
		operateType:{}
	}
});
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
var moneyModel = kendo.data.Model.define({
    id: "_id",
    fields: {
   	   _id: {  editable: false, nullable: true},
       getMoneyActualMoney: {type:"number",validation: {required: true } },
       getMoneyActualDate: { type:"date",validation: {required: true }},
   	   getMoneyComment:{},
       scId: {},
       salesContractCode: {},
       customerBankName:{},
       customerBankAccount:{}
    }
});


$(document).ready(function () {	
	checkRoles();

	$("#searchfor").kendoDropDownList({
		dataTextField : "contractCode",
		dataValueField : "_id",
		//template:  '${ data.projectName }:<strong>${ data.contractCode }</strong>',
		autoBind: false,
        optionLabel: "全部",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/sc/listforselect"
				}
			},
			schema : {
				total: "total",
				data: "data"
			}
		},
        change: function() {
            var value = this.value();
            if (value) {
            	postAjaxRequest("/service/sc/invoice/viewsc", {scId:value} , changeSuccess);
            	$("#scbaseinfo").show();
            	$("#invoiceGrid").data("kendoGrid").dataSource.filter({ field: "scId", operator: "eq", value: value });
            	$("#moneyGrid").data("kendoGrid").dataSource.filter({ field: "scId", operator: "eq", value: value });
            } else {
            	$("#scbaseinfo").hide();
            	$("#invoiceGrid").data("kendoGrid").dataSource.filter({});
            	$("#moneyGrid").data("kendoGrid").dataSource.filter({});
            }
        }

	});
	
	$("#invoiceGrid").kendoGrid({
		dataSource: {
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
		        model: invoiceModel,
		        total: "total",
		        data:"data"
		    },
			aggregate: [ 
			    { field: "payInvoiceMoney", aggregate: "sum"},
			    { field: "payInvoiceActualMoney", aggregate: "sum"}
			]
		},
	    pageable: true,
	    sortable : true,
	    resizable: true,
		selectable : "row",
        detailTemplate: kendo.template($("#template").html()),
        detailInit: detailInit,
	    columns: [
			{ field: "_id", hidden: true},
			{ field: "contractCode", title: "销售合同编号", width:"160px"},
			{ field: "creatorName", title: "申请人" , width:"100px"},
			{ field: "payInvoiceStatus", title: "状态", width: "100px"},
			{ field: "payInvoicePlanDate", title: "要求日期",format: "{0:yyyy-MM-dd}",width:"100px"},
			{ field: "payInvoiceMoney", title: "金额" ,footerTemplate: "总额: #=sum#", width:"120px"},
			{ field: "payInvoiceReceivedMoneyStatus", title: "收款情况", width:"100px"},
			{ field: "payInvoiceActualMoney", title: "实际金额" ,footerTemplate: "总额: #=sum#", width:"120px"},
			{ field: "payInvoiceActualDate", title: "实际开票日期",format: "{0:yyyy-MM-dd}",width:"100px" },
			{ field: "payInvoiceActualInvoiceNum", title: "发票号" , width:"200px"},
			{ field: "payInvoiceActualSheetCount", title: "开票张数", width:"80px"},
			{ hidden: true, field: "payInvoiceItemList" },
	  	]
	});
	
    $("#moneyGrid").kendoGrid({
        dataSource: {
            transport: {
                read:  {
                    url: "/service/sc/getmoney/list",
                    dataType: "jsonp",
                    type : "post"
                },
                update: {
                    url:  "/service/sc/getmoney/save",
                    dataType: "jsonp",
                    type : "post"
                },
                destroy: {
                    url: "/service/sc/getmoney/destroy",
                    dataType: "jsonp",
                    type : "post"
                },
                create: {
                    url: "/service/sc/getmoney/save",
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
                model: moneyModel,
                total: "total",
                data:"data"
            },
			aggregate: [ 
			    { field: "getMoneyActualMoney", aggregate: "sum"}
			]
        },
        pageable: true,
	    sortable : true,
	    resizable: true,
        detailTemplate: kendo.template($("#template1").html()),
        columns: [
            { field: "contractCode", title: "销售合同编号", width:"160px" },
            { field: "creatorName", title: "申请人", width:"100px" },
            { field: "getMoneyActualDate",title:"日期",format: "{0:yyyy-MM-dd}",width:"100px"},
            { field: "getMoneyActualMoney", title:"金额", min:0 ,footerTemplate: "总额: #=sum#", width:"120px"},
            { field: "customerName", title: "客户", width:"200px"},
            { field: "customerBankName", title: "客户开户行", width:"100px"},
            { field: "customerBankAccount", title: "客户银行账号", width:"200px"}
        ],
        editable:"popup"
    });
	
	
});

function addPI(){
	if($("#searchfor").val() == "") {
		alert("请选择合同");
	}else{
		loadPage("finance_payInvoiceEdit",{scId: $("#searchfor").val()});
	}	
}
function editManagerPI(){
	var row = getSelectedRowDataByGrid("invoiceGrid");
	if(!row) {
		alert("点击列表可以选中数据");
	} else if(row.payInvoiceStatus == "待部门经理审核"){
		loadPage("finance_payInvoiceEdit", {_id:row._id});		
	} else {	
		alert("请选择‘待部门经理审核’的数据");
	}
}
function editFinPI(){
	var row = getSelectedRowDataByGrid("invoiceGrid");
	if(!row) {
		alert("点击列表可以选中数据");
	} else if(row.payInvoiceStatus == "待财务经理审核"){
		loadPage("finance_payInvoiceEdit", {_id:row._id});		
	} else {	
		alert("请选择‘待财务经理审核’的数据");
	}
}
function donePI(){
	var row = getSelectedRowDataByGrid("invoiceGrid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.payInvoiceStatus == "开票中"){
		loadPage("finance_payInvoiceEdit", {_id:row._id});	
	} else {	
		alert("请选择‘开票中’的数据");
	}
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
function changeSuccess(e){
	kendo.bind($("#scbaseinfo"), e);	
}