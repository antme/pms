var dataSource, crudServiceBaseUrl = "../service/ship";

$(document).ready(function () {
	checkRoles();
	
	$("#sdatepicker").kendoDatePicker();
	var sdatepicker = $("#sdatepicker").data("kendoDatePicker");
	
	$("#edatepicker").kendoDatePicker();
	var edatepicker = $("#edatepicker").data("kendoDatePicker");
	
	$("#count").click(function() {
		if (sdatepicker.value() && edatepicker.value()) {
			dataSource.read();
		}
	});
	
    dataSource = new kendo.data.DataSource({
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
});
