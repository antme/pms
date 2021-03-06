var invoiceModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		getInvoiceDepartment: {},
		getInvoiceProposerId: {},
		getInvoiceReceivedMoneyStatus:{},
		getInvoiceItemList: {},
		getInvoiceActualMoney:{},
		getInvoiceActualDate:{type:"date"},
		getInvoiceActualInvoiceNum:{},
		getInvoiceActualSheetCount:{},
		requestedTotalMoney:{type:"number"},
		getInvoiceItemList:{}
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
   	   _id: {editable: false, nullable: true},
       payMoneyActualMoney: {type:"number",validation: {required: true } },
       payMoneyActualData: { type:"date",validation: {required: true }},
       purchaseContractId: {},
       purchaseContractCode: {validation: {required: true }},
       creatorName:{editable: false},
       supplierName: {},
       supplierBankName: {},
       supplierBankAccount: {},
   	   payMoneyComment:{}
    }
});


$(document).ready(function () {	
	checkRoles();

	$("#searchfor").kendoDropDownList({
		dataTextField : "purchaseContractCode",
		dataValueField : "_id",
		autoBind: false,
        optionLabel: "全部",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/purcontract/listforselect"
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
            	postAjaxRequest("/service/purcontract/invoice/viewpc", {purchaseContractId:value} , changeSuccess);//??????
            	$("#baseinfo").show();
            	$("#invoiceGrid").data("kendoGrid").dataSource.filter({ field: "purchaseContractId", operator: "eq", value: value });
            	$("#moneyGrid").data("kendoGrid").dataSource.filter({ field: "purchaseContractId", operator: "eq", value: value });
            } else {
            	$("#baseinfo").hide();
            	$("#invoiceGrid").data("kendoGrid").dataSource.filter({});
            	$("#moneyGrid").data("kendoGrid").dataSource.filter({});
            }
        }

	});
	
	$("#invoiceGrid").kendoGrid({
		dataSource: {
		    transport: {
		        read:  {
		            url: "/service/purcontract/invoice/list",
		            dataType: "jsonp",
		            type : "post"
		        }
		    },
		    batch: true,
		    pageSize: 5,
			serverPaging: true,
			serverSorting: true,
			serverFiltering : true,
		    schema: {
		        model: invoiceModel,
		        total: "total",
		        data:"data"
		    },
			aggregate: [ 
			    { field: "getInvoiceActualMoney", aggregate: "sum"}
			]
		},
	    pageable: true, resizable: true,
	    sortable : true,
	    resizable: true,
		selectable : "row",
        detailTemplate: kendo.template($("#template").html()),
        detailInit: detailInit,
	    columns: [
			{ field: "_id", hidden: true},
			{ field: "purchaseContractCode", title: "采购合同编号" },
			{ field: "creatorName", title: "申请人" },
			{ field: "getInvoiceActualMoney", title: "金额",footerTemplate: "总额: #=sum.toFixed(2)#" },
			{ field: "getInvoiceActualDate", title: "日期",format: "{0:yyyy-MM-dd}" },
			{ field: "getInvoiceReceivedMoneyStatus", title: "付款情况"},
			{ field: "getInvoiceActualInvoiceNum", title: "发票号" },
			{ field: "getInvoiceActualSheetCount", title: "开票张数"},
			{ hidden: true, field: "getInvoiceItemList" }
	  	],
	  	editable:"inline"
	});
	
   
	
});
function addGI() {
	if($("#searchfor").val() == "") {
		alert("请选择合同");
	}else{
		loadPage("finance_getInvoiceEdit",{purchaseContractId: $("#searchfor").val()});
	}
}
function editGI() {
	var row = getSelectedRowDataByGrid("invoiceGrid");
	if(!row) {
		alert("点击列表可以选中数据");
	} else {
		loadPage("finance_getInvoiceEdit", {_id:row._id});		
	}
}

function detailInit(e) {
    var detailRow = e.detailRow;
    detailRow.find(".tabstrip").kendoTabStrip({
        animation: {
            open: { effects: "fadeIn" }
        }
    });

    detailRow.find(".orders").kendoGrid({
    	dataSource: e.data.getInvoiceItemList,
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
function pcDropDownEditor(container, options) {
	var input = $("<input required data-required-msg='请选择采购合同'/>");
	input.attr("name", options.field);
	input.appendTo(container);
	input.kendoComboBox({
		dataTextField: "purchaseContractCode",
		dataValueField : "purchaseContractCode",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/purcontract/listforselect"
				}
			},
			schema : {
				total: "total",
				data: "data"
			}
		},
		change: function(e) {
			if(this.dataItem()) {
				options.model.set("supplierName",this.dataItem().supplierName);
				options.model.set("supplierBankName",this.dataItem().supplierBankName);
				options.model.set("supplierBankAccount",this.dataItem().supplierBankAccount);
			}
		}
    });
}
function changeSuccess(e){
	kendo.bind($("#baseinfo"), e);	
}
function myreflush(){
	loadPage("finance_getInvoice");
}

