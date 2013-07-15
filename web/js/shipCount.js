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
                url: crudServiceBaseUrl + "/count",
                dataType: "jsonp",
                data: {
                	startDate: function() {
                		return kendo.toString(sdatepicker.value(), 'yyyy-MM-dd');
                	},
                	endDate: function() {
                		return kendo.toString(edatepicker.value(), 'yyyy-MM-dd');
                	}
                }
            }
        },
        schema: {
        	data: "data"
        }
    });

    $("#grid").kendoGrid({
    	autoBind: false,
        dataSource: dataSource,
        columns: [
            { field: "eqcostNo", title:"序号" },
            { field: "eqcostMaterialCode", title:"物料代码" },
            { field: "eqcostProductName", title: "产品名称" },
	        { field: "eqcostProductType", title: "规格型号" },
	        { field: "eqcostBrand", title: "品牌" },
	        { field: "eqcostUnit", title: "单位" },
            { field: "vcShipAmount", title:"数量" },
            { field: "vcShipMoney", title:"金额" }
        ]
    });
});
