var requestModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		pbCode:{},
		pbDepartment:{},
		pbSubmitDate:{},
		pbPlanDate:{},
		pbType:{},
		pbStatus:{},
		pbComment:{},
		pbMoney:{},
		eqcostList:{},
		projectCode : {},
		projectName : {},
		projectManager : {},
		customer : {},
		contractCode : {},
		contractAmount:{},
		backRequestCount:{},
		poCode: {},
		pcCode: {}
	}
});

var listDatasource = new kendo.data.DataSource({
    transport: {
        read:  {
            url: baseUrl + "/purchase/back/list",
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
	    pageable: true,
	    selectable : "row",
	    sortable : true,
	    columns: [
	        { 
	        	field: "pbCode", 
	        	title: "备货编号" ,
	        	width:"125px",
	        	template : function(dataItem) {
					return '<a  onclick="openBackRequestViewWindow(\'' + dataItem._id + '\');">' + dataItem.pbCode + '</a>';
				}
	        },
	        { field:"projectName",title:"项目名"},
	        { field:"projectManager", title:"PM" },
	        { 
	        	field:"contractCode", 
	        	title:"销售合同编号" ,
	        	template : function(dataItem) {
					return '<a  onclick="openSCViewWindow(\'' + dataItem.scId + '\');">' + dataItem.contractCode + '</a>';
				}
	        },
	        { field: "customer", title:"客户名"},
	        { field: "pbStatus", title:"申请状态" },
	        { field: "pbSubmitDate", title:"提交时间" },
	        { field: "pbMoney", title:"金额" }
	    ]
	});
	
});

function addPB(){
	loadPage("purchaseBackEdit");
}
function editPB(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.pbStatus == "草稿" || row.pbStatus == "已拒绝"){	
		loadPage("purchaseBackEdit", { _id : row._id });	
	}
}
function processPB(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.pbStatus == "已提交"){	
		loadPage("purchaseBackEdit", { _id : row._id });	
	}
}
function pendingPB() {//TODO:什么状态可以中止
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.pbStatus == "已提交"){
		if(confirm("中止表单，确认？"))
		postAjaxRequest("service/purchase/back/pending", {_id:row._id}, function(){listDatasource.read();});
	}
}

function destroyPB() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.pbStatus == "草稿" || row.pbStatus == "已拒绝" || row.pbStatus == "已中止"){	
		if(confirm("删除表单，确认？"))
		postAjaxRequest("service/purchase/back/destroy", {_id:row._id}, function(){listDatasource.read();});
	}
}
