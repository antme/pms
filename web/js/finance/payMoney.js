
var requestModel = kendo.data.Model.define({
    id: "_id",
    fields: {
   	   _id: {  editable: false, nullable: true},
       payMoneyActualMoney: {type:"number",validation: {required: true } },
       payMoneyActualData: { type:"date",validation: {required: true }},
       purchaseContractId: {},
       purchaseContractCode: {},
       supplierName: {},
       supplierBankName: {},
       supplierBankAccount: {},
   	   payMoneyComment:{}
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
            }
        }            
    },
    batch: true,
    pageSize: 2,
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
	//checkRoles();
	
    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable: true,
        toolbar: [{name:"create",text:"新增"}],
        columns: [
            { field: "payMoneyActualData",title:"日期",format: "{0:yyyy/MM/dd}",width:"120px"},
            { field: "payMoneyActualMoney", title:"金额", min:0},
            { field: "purchaseContractCode", title: "采购合同编号",editor:pcDropDownEditor},
            { field: "supplierName", title: "供应商"},
            { field: "supplierBankName", title: "开户行"},
            { field: "supplierBankAccount", title: "银行账号"},
            { field: "payMoneyComment", title: "备注"},
            { command: [{name:"edit",text:"编辑"},{name:"destroy",text:"删除"}], title: "&nbsp;", width: "170px"}
        ],
        editable:"popup"
    });
});

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
}