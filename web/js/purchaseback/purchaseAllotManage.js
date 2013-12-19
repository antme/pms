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
	    dataSource: listDatasource,
	    pageable: true, resizable: true,
	    selectable : "row",
	    height: "400px",
	    sortable : true,
	    filterable : filterable,
	    columns: [
	        { 
	        	field: "paCode", 
	        	title: "调拨编号" ,	        	
	        	template : function(dataItem) {
					return '<a  onclick="openPurchaseAllotViewWindow(\'' + dataItem._id + '\');">' + dataItem.paCode + '</a>';
				}
	        },
	        { field: "pbCode", title:"备货编号", filterable : false,
	        	template : function(dataItem) {
					return '<a  onclick="openBackRequestViewWindow(\'' + dataItem.pbId + '\');">' + dataItem.pbCode + '</a>';
				}
	        
	        },
	        { 
	        	field: "contractCode", 
	        	title:"销售合同编号",filterable : false,
	        	template : function(dataItem) {
					return '<a  onclick="openSCViewWindow(\'' + dataItem.scId + '\');">' + dataItem.contractCode + '</a>';
				}
	        },
	        { field: "customer", title:"客户名" , filterable : false},
	        { field: "projectManager", title:"PM" , filterable : false},
	        { field: "paStatus", title:"调拨状态" ,
	        	filterable : {
					ui: function(e){
						e.kendoDropDownList({
							dataSource : paStatus,
							optionLabel : "...",
							dataTextField : "text",
							dataValueField : "text"
						});
					}
				}	
	       },
	        { field: "paSubmitDate", title:"提交时间" },
	        { field: "paApproveDate", title:"批准时间" }
	    ]
	});
	
});

function editPA(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.paStatus == "已提交"){	
		loadPage("purchaseback_purchaseAllotEdit", { _id : row._id });
	}else{
		alert("请选择‘已提交’的数据");
	}
}

function processPA(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.paStatus == "已提交"){	
		loadPage("purchaseback_purchaseAllotManageEdit", { _id : row._id });
	}else{
		alert("请选择‘已提交’的数据");
	}
}

function finalProcessPA(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.paStatus == "已初审"){	
		loadPage("purchaseback_purchaseAllotManageEdit", { _id : row._id });
	}else{
		alert("请选择‘已批准’的数据");
	}
}
function donePA(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.paStatus == "已终审"){	
		loadPage("purchaseback_purchaseAllotManageEdit", { _id : row._id });	
	}else{
		alert("请选择‘已终审’的数据");
	}
}