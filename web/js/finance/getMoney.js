
var requestModel = kendo.data.Model.define({
    id: "_id",
    fields: {
   	   _id: {  editable: false, nullable: true},
       getMoneyActualMoney: {type:"number",validation: {required: true } },
       getMoneyActualDate: { type:"date",validation: {required: true }},
   	   getMoneyComment:{},
       salesContractId: {},
       salesContractCode: {},
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
	//checkRoles();
	
    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable: true,
        toolbar: [{name:"create",text:"新增"}],
        columns: [
            { field: "getMoneyActualDate",title:"日期",format: "{0:yyyy/MM/dd}",width:"120px"},
            { field: "getMoneyActualMoney", title:"金额", min:0},
            { field: "salesContractCode", title: "销售合同编号",editor: pcDropDownEditor},
            { field: "customerName", title: "客户"},
            { field: "customerBankName", title: "客户开户行"},
            { field: "customerBankAccount", title: "客户银行账号"},
            { field: "getMoneyComment", title: "备注"},
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
	//loadPage("getMoney");
	location.reload();
}