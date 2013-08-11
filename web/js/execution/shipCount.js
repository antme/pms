var model, crudServiceBaseUrl = "../service/ship";

var date = kendo.data.Model.define({
    fields: {
    	bjdc: {},
    	bjkc: {},
    	bjsc: {}
    }
});

$(document).ready(function () {
	checkRoles();
	
	$("#bjdc").click(function() {
		count("北京代采");
	});
	
	$("#bjkc").click(function() {
		count("北京库存");
	});
	
	$("#bjsc").click(function() {
		count("北京生产");
	});
	
    var dataSource = new kendo.data.DataSource({
        transport: {
            read:  {
                url: crudServiceBaseUrl + "/count/list",
                dataType: "jsonp"
            }
        },
        schema: {
        	data: "data"
        }
    });

    $("#grid").kendoGrid({
        dataSource: dataSource,
        height: "450px",
        columns: [
            { field: "shipCountDate", title:"统计月份" },
            { field: "purchaseContractType", title:"虚拟采购类型" },
            { field: "status", title:"状态" },
            { field: "shipTotalAmount", title:"总数量" },
            { field: "shipTotalMoney", title:"总金额" }
        ]
    });
    
});



function getDate(data) {
	model = new date(data);
	kendo.bind($("#countDate"), model);
}

function count(purchaseContractType) {
	postAjaxRequest(crudServiceBaseUrl + "/count", {purchaseContractType:purchaseContractType}, countReturn);
}

function countReturn(data) {
	if (isEmpty(data)) {
		alert("没有数据");
	} else {
		alert("统计完成");
	}
	loadPage("execution_shipCount");
}

function isEmpty(obj)
{
    for (var name in obj) 
    {
        return false;
    }
    return true;
};
