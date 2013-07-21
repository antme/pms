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
        columns: [
            { field: "shipCountDate", title:"统计日期" },
            { field: "contractExecuteCate", title:"虚拟采购类型" },
            { field: "shipTotalAmount", title:"总数量" },
            { field: "shipTotalMoney", title:"总金额" }
        ]
    });
    
    postAjaxRequest(crudServiceBaseUrl + "/count/date", null, getDate);
});

function getDate(data) {
	model = new date(data);
	kendo.bind($("#countDate"), model);
}

function count(contractExecuteCate) {
	postAjaxRequest(crudServiceBaseUrl + "/count", {contractExecuteCate:contractExecuteCate}, countReturn);
}

function countReturn() {
	alert("统计完成");
	loadPage("shipCount");
}
