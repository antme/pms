
var requestModel = kendo.data.Model.define({
    id: "_id",
    fields: {
   	   _id: { 
   		   editable: false,
   		   nullable: true
   	   },
       payMoneyActualMoney: {
    	   type:"number",
    	   validation: {
    		   required: true
    	   }
   	   },
       payMoneyActualData: {
    	   type:"date",
    	   validation: {
    		   required: true
    	   }
   	   },
       purchaseContractId: {
    	   defaultValue: { _id: 1, purchaseContractCode: "test"},
    	   validation: {
    		   required: true
    	   }
   	   }
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
            url:  "/service/purcontract/payMoney/update",
            dataType: "jsonp",
            type : "post"
        },
        destroy: {
            url: "/service/purcontract/payMoney/destroy",
            dataType: "jsonp",
            type : "post"
        },
        create: {
            url: "/service/purcontract/paymoney/add",
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
        dataSource: dataSource,
        pageable: true,
        toolbar: [{name:"create",text:"新增"},{name:"save",text:"保存"}],
        columns: [
            { field: "payMoneyActualData",title:"日期",format: "{0:yyyy/MM/dd}"},
            { field: "payMoneyActualMoney", title:"金额", min:0, width: "120px" },
            { field: "purchaseContractId", title: "采购合同编号", width: "200px", editor: pcDropDownEditor, template: "#=purchaseContractId.purchaseContractCode#" },
            { command: "destroy", title: " ", width: "90px" }],
        editable: true
    });
    
    
    
});

function pcDropDownEditor(container, options) {
    $('<input required data-text-field="purchaseContractCode" data-value-field="_id" data-bind="value:' + options.field + '"/>')
        .appendTo(container).kendoDropDownList({
            autoBind: false,
            template:  '${ data.supplierName }:<strong>${ data.purchaseContractCode }</strong>',
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
    		}
        });
}
