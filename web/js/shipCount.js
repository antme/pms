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
        detailTemplate: kendo.template($("#template").html()),
        detailInit: detailInit,
        columns: [
            { field: "shipCountDate", title:"统计日期" },
            { field: "contractExecuteCate", title:"虚拟采购类型" },
            { field: "shipTotalAmount", title:"总数量" },
            { field: "shipTotalMoney", title:"总金额" }
        ]
    });
    
    postAjaxRequest(crudServiceBaseUrl + "/count/date", null, getDate);
});

function detailInit(e) {
    var detailRow = e.detailRow;

    detailRow.find(".orders").kendoGrid({
        dataSource: {
            transport: {
            	read: {
                    url: crudServiceBaseUrl + "/count/eqlist",
                    dataType: "jsonp",
    	            data: {
    	            	_id: e.data._id
    	            }
                }
            },
            schema: {
            	data: "data"
            }
        },
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
}

function getDate(data) {
	model = new date(data);
	kendo.bind($("#countDate"), model);
}

function count(contractExecuteCate) {
	postAjaxRequest(crudServiceBaseUrl + "/count", {contractExecuteCate:contractExecuteCate}, countReturn);
}

function countReturn(data) {
	if (isEmpty(data)) {
		alert("没有数据");
	} else {
		alert("统计完成");
	}
	loadPage("shipCount");
}

function isEmpty(obj)
{
    for (var name in obj) 
    {
        return false;
    }
    return true;
};
