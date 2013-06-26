var requestModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		paCode:{},
		paStatus:{},
		paSubmitDate:{},
		paApproveDate:{},
		pbCode:{},
		eqcostList:{},
		projectCode : {},
		projectName : {},
		projectManager : {},
		customer : {},
		contractCode : {},
		contractAmount:{}
	}
});

var listDatasource = new kendo.data.DataSource({
    transport: {
        read:  {
            url: baseUrl + "/purchase/allot/list",
            dataType: "jsonp",
            type : "post"
        },
		//必须放在transport内，mytasks参数来至于点击我的任务
		parameterMap : myTaskQueryParam
    },
    batch: true,
    pageSize: 10,
    schema: {
        model: requestModel,
        data:"data"
    }
});	

$(document).ready(function () {	
	checkRoles();

	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    selectable : "row",
	    height: "400px",
	    columns: [
	        { 
	        	field: "paCode", 
	        	title: "调拨编号" ,
	        	template : function(dataItem) {
					return '<a  onclick="openPurchaseAllotViewWindow(\'' + dataItem._id + '\');">' + dataItem.paCode + '</a>';
				}
	        },
	        { 
	        	field: "contractCode", 
	        	title:"销售合同编号",
	        	template : function(dataItem) {
					return '<a  onclick="openSCViewWindow(\'' + dataItem.scId + '\');">' + dataItem.contractCode + '</a>';
				}
	        },
	        { field: "customer", title:"客户名" },
	        { field: "projectManager", title:"PM" },
	        { field: "paStatus", title:"调拨状态" },
	        { field: "paSubmitDate", title:"提交时间" },
	        { field: "paApproveDate", title:"批准时间" }
	    ]
	});
	
});


function edit(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {	
		loadPage("purchaseAllotManageEdit", { _id : row._id });	
	}

}
