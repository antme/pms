var model, crudServiceBaseUrl = "../service/ship";


$(document).ready(function () {
	checkRoles();

	
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
		selectable : "row",
		sortable : true,
		resizable: true,
        columns: [
            { field: "shipCountDate", title:"统计月份" },
            { field: "shipType", title:"虚拟采购类型" },
            { field: "status", title:"状态" },
            { field: "shipTotalAmount", title:"总数量" },
            { field: "shipTotalMoney", title:"总金额", 
            	width:100,
				template: function(dataItem){
					return "<span style='float:right'>" + kendo.toString(dataItem.shipTotalMoney, "c") + "</span>";
				}
            }
        ]
    });
    
});

function confirmShipCount(){
	
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		 if(row.status == "已结算"){
			alert("不需要结算");
		} else {
			loadPage("execution_shipCountEdit", {
				_id : row._id
			});
		}
	}
}
