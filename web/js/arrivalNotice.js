var dataSource, crudServiceBaseUrl = "../service/arrivalNotice";

$(document).ready(function () {
	checkRoles();
    dataSource = new kendo.data.DataSource({
        transport: {
            read:  {
                url: crudServiceBaseUrl + "/list",
                dataType: "jsonp"
            },
            destroy: {
                url: crudServiceBaseUrl + "/destroy",
                dataType: "jsonp"
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
        	total: "total",
        	data: "data"
        }
    });

    $("#grid").kendoGrid({
        dataSource: dataSource,
        pageable : true,
		sortable : true,
		filterable : filterable,
        selectable: "row",
        columns: [
            {
            	field: "shipType", title:"发货类型",
            	template:function(dataItem) {
					var name = "";
					if (dataItem.shipType == 0){
						name = "供应商直发";
					} else if (dataItem.shipType == 1){
						name = "仓库直发";
					} else {
						name = "未知";
					}
					return name;
				}
            },
            { field: "arrivalDate", title:"到货日期" },
            {
            	field: "purchaseOrderCode",
            	title:"采购订单编号",
				template : function(dataItem) {
					if (dataItem.purchaseOrderCode) {
						return '<a  onclick="openPurchaseOrderViewWindow(\'' + dataItem.purchaseOrderId + '\');">' + dataItem.purchaseOrderCode + '</a>';
					} else {
						return '';
					}
				}
            },
            {
            	field: "salesContractCode",
            	title:"销售合同编号",
				template : function(dataItem) {
					if (dataItem.salesContractCode) {
						return '<a  onclick="openSCViewWindow(\'' + dataItem.salesContractId + '\');">' + dataItem.salesContractCode + '</a>';
					} else {
						return '';
					}
				}
            }
        ],
        editable: "popup"
    });
});
