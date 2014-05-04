var eqrepdataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "/service/sc/eqrep/list",
			dataType : "jsonp",
			type : "post"
		}
	},
	schema : {
		total : "total", 
		data : "data",
		model : {
			fields : {
				eqcostAmount : {
					type : "number"
				}
			}
		}
	},

	pageSize: 10,
	serverPaging: true,
	serverSorting: true,
	serverFiltering : true,
	batch : true
});

$(document).ready(function () {

    $("#repimport").kendoUpload({
        async: {
        	saveUrl: "/service/sc/importrep",
            autoUpload: true
        },
        success:function(e){
        	if (!e.response.msg){//import success
        		$("#importStatus").html("数据导入成功！");
        	}else{
        		alert(e.response.msg);
        	}
        }
    });	
    
    $("#repQueryGrid").kendoGrid({
		dataSource : eqrepdataSource,

		selectable: "row",
		height: "600px",
	    sortable : true,
	    resizable: true,
		filterable : filterable,
		pageable : {
			buttonCount:5
		},
		columns : [ 
		{
			field : "eqcostMaterialCode",
			title : "物料代码"
		}, {
			field : "eqcostProductName",
			title : "产品名称"
		}, {
			field : "eqcostProductType1",
			title : "型号1"

		}, {
			field : "eqcostProductType2",
			title : "型号2"

		}, {
			field : "eqcostProductType3",
			title : "型号3"

		}, {
			field : "eqcostAmount",
			title : "期末|数量"
		}, {
			field : "eqcostUnit",
			title : "单位"
		}, 
		{
			field : "eqcostSalesBasePrice",
			title : "单价"
		},  {
			field : "eqcostTotalAmount",
			title : "期末|金额"
		}]
		
	});
    
});