
var requestModel = kendo.data.Model.define({
    id: "_id",
    fields: {
   	   _id: {  editable: false, nullable: true},
       payMoneyActualMoney: {type:"number",validation: {required: true } },
       payMoneyActualData: { type:"date",validation: {required: true }},
       purchaseContractId: {},
       purchaseContractCode: {validation: {required: true }},
       supplierName: {},
       supplierBankName: {},
       supplierBankAccount: {},
   	   payMoneyComment:{},
   	   creatorName:{editable: false}
    }
});

var dataSource = new kendo.data.DataSource({
    transport: {
        read:  {
            url: "/service/purcontract/paymoney/list",
            dataType: "jsonp",
            type : "post"
        },
        update: {
            url:  "/service/purcontract/paymoney/save",
            dataType: "jsonp",
            type : "post"
        },
        destroy: {
            url: "/service/purcontract/paymoney/destroy",
            dataType: "jsonp",
            type : "post"
        },
        create: {
            url: "/service/purcontract/paymoney/save",
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
            	};
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


$(document).ready(function () {
	checkRoles();
	
    $("#moneyGrid").kendoGrid({
        dataSource: dataSource,
	    pageable: true,
	    resizable: true,
        sortable : true,
	    detailTemplate: kendo.template($("#template2").html()),
        columns: [
            { field: "purchaseContractCode", title: "采购合同编号",editor:pcDropDownEditor,width:"200px"},
            { field: "creatorName", title: "申请人" },
            { field: "payMoneyActualMoney", title:"金额", min:0},
            { field: "payMoneyActualData",title:"日期",format: "{0:yyyy-MM-dd}",width:"120px"},
            { field: "supplierName", title: "供应商"},
            { field: "supplierBankName", title: "开户行"},
            { field: "supplierBankAccount", title: "银行账号"},
            { field: "tempComment", title: "备注"}
        ],
        selectable: "row",
        editable:"inline"
    });
});

function addPM() {
	$("#moneyGrid").data("kendoGrid").addRow();
}
function savePM() {
	$("#moneyGrid").data("kendoGrid").saveRow();
}
function editPM() {
	var row = getSelectedRowDataByGrid("moneyGrid");
	if (!row) {
		alert("点击列表可以选中数据");
	}else{
		var grid = $("#moneyGrid").data("kendoGrid");
		grid.editRow(grid.select());
	}
}
function destroyPM() {
	var row = getSelectedRowDataByGrid("moneyGrid");
	if (!row) {
		alert("点击列表可以选中数据");
	}else{
		var grid = $("#moneyGrid").data("kendoGrid");
		grid.removeRow(grid.select());
	}
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
function myreflush(){
	loadPage("payMoney");
	//location.reload();//临时解决方案
}