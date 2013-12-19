
var requestModel = kendo.data.Model.define({
    id: "_id",
    fields: {
   	   _id: {  editable: false, nullable: true},
       getMoneyActualMoney: {type:"number",validation: {required: true } },
       getMoneyActualDate: { type:"date",validation: {required: true }},
   	   getMoneyComment:{},
       scId: {},
       contractCode: {},
       customerBankName:{},
       customerBankAccount:{}
    }
});

var dataSource = new kendo.data.DataSource({
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
        },
        parameterMap: function(options, operation) {
            if (operation !== "read" && options.models) {
                return {
                	models: kendo.stringify(options.models),
    				mycallback : "myreflush"
                };
            }else if(operation === "read"){
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


$(document).ready(function () {
	checkRoles();
	
    $("#getMoneyGrid").kendoGrid({
        dataSource: dataSource,
	    pageable: true, resizable: true,
	    resizable: true,
        sortable : true,
        detailTemplate: kendo.template($("#template1").html()),
        columns: [
            { field: "contractCode", title: "销售合同编号",editor: pcDropDownEditor,width:"200px"},
            { field: "creatorName", title:"申请人"},
            { field: "getMoneyActualDate",title:"日期",format: "{0:yyyy-MM-dd}",width:"120px"},
            { field: "getMoneyActualMoney", title:"金额", min:0},
            { field: "customerName", title: "客户"},
            { field: "customerBankName", title: "客户开户行"},
            { field: "customerBankAccount", title: "客户银行账号"},
            { field: "tempComment", title: "备注"}
        ],
        selectable: "row",
        editable:"inline"
    });
});
function addGM() {
	$("#getMoneyGrid").data("kendoGrid").addRow();
}
function saveGM() {
	$("#getMoneyGrid").data("kendoGrid").saveRow();
}
function editGM() {
	var row = getSelectedRowDataByGrid("getMoneyGrid");
	if (!row) {
		alert("点击列表可以选中数据");
	}else{
		var grid = $("#getMoneyGrid").data("kendoGrid");
		grid.editRow(grid.select());
	}
}
function destroyGM() {
	var row = getSelectedRowDataByGrid("getMoneyGrid");
	if (!row) {
		alert("点击列表可以选中数据");
	}else{
		var grid = $("#getMoneyGrid").data("kendoGrid");
		grid.removeRow(grid.select());
	}
}
function pcDropDownEditor(container, options) {
	var input = $("<input required data-required-msg='请选择采购合同'/>");
	input.attr("name", options.field);
	input.appendTo(container);
	input.kendoComboBox({
		dataTextField: "contractCode",
		dataValueField : "contractCode",
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
		 change: function(e) {
			 if(this.dataItem()){
				 options.model.set("customerName",this.dataItem().customerName);
				 options.model.set("customerBankName",this.dataItem().customerBankName);
				 options.model.set("customerBankAccount",this.dataItem().customerBankAccount);
			 }
		}
    });
}

function myreflush(){
	loadPage("finance_gotMoneyList");
	//location.reload();
}