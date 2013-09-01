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
            url: baseUrl + "/purchase/back/listchecked",
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
	    height: "400px",
	    filterable : filterable,
	    columns: [
	        { 
	        	field: "pbCode", 
	        	title: "备货编号" ,
	        	width:"125px",
	        	template : function(dataItem) {
					return '<a  onclick="openBackRequestViewWindow(\'' + dataItem._id + '\');">' + dataItem.pbCode + '</a>';
				}
	        },
	        { field:"projectName",title:"项目名",filterable : false,
	        	template : function(dataItem) {
					if(dataItem.projectName){
						return '<a  onclick="openProjectViewWindow(\'' + dataItem.projectId + '\');">' + dataItem.projectName + '</a>';
					}else{
						return '';
					}
				}	
	        },
	        { field: "projectManager", title:"PM", filterable : false},
	        { 
	        	field: "contractCode", 
	        	title:"销售合同编号",filterable : false,
	        	template : function(dataItem) {
					return '<a  onclick="openSCViewWindow(\'' + dataItem.scId + '\');">' + dataItem.contractCode + '</a>';
				}
	        },
	        { field: "customer", title:"客户名", filterable : false},
	        { field: "pbStatus", title:"申请状态", filterable : false},
	        { field: "pbSubmitDate", title:"提交时间" },
	        { field: "pbMoney", title:"金额" }
	    ]
	});
	
});

function generateAllot() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		postAjaxRequest("/service/purcontract/back/load", { _id : row._id }, function(data){
			if(!data.eqcostList || (data.eqcostList　&& data.eqcostList.length==0)){
				alert("此备货申请已无可备货货品");
			}else{
				loadPage("purchaseback_purchaseAllotEdit",{pbId:row._id});
			}
		});
	}
}

function generateRequest(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		
		postAjaxRequest("/service/purcontract/back/load", { _id : row._id }, function(data){
			if(!data.eqcostList || (data.eqcostList　&& data.eqcostList.length==0)){
				alert("此备货申请已无可备货货品");
			}else{
				loadPage("purchasecontract_purchaseRequestEdit",{backId:row._id});		
			}
		});
	}
}


