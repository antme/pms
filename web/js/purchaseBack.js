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
        }
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
		filterable : filterable,
		height: "400px",
	    columns: [
	        { 
	        	field: "pbCode", 
	        	title: "备货编号" ,
	        	width:"125px",
	        	template : function(dataItem) {
					return '<a  onclick="openBackRequestViewWindow(\'' + dataItem._id + '\');">' + dataItem.pbCode + '</a>';
				}
	        },
	        { 	field: "pbType", 
	        	title:"采购类别" ,
	        	width:"120px",
	        	filterable : {
					ui: function(e){
						e.kendoDropDownList({
							dataSource : pbTypeItems,
							optionLabel : "...",
							dataTextField : "text",
							dataValueField : "text"
						});
					}
				}
	        	
	        },
	        { 
	        	field:
	        	"contractCode", 
	        	title:"销售合同编号" ,
	        	template : function(dataItem) {
					return '<a  onclick="openSCViewWindow(\'' + dataItem.scId + '\');">' + dataItem.contractCode + '</a>';
				}
	        		
	        },
	        { field: "poCode", title:"采购订单编号" },
	        { field: "prCode", title:"采购申请编号" },
	        { 
	        	field: "customer", 
	        	title:"客户名" 
	        },
	        { field: "projectManager", title:"PM" },
	        { field: "pbStatus", title:"申请状态" },
	        { field: "pbSubmitDate", title:"提交时间" },
	        { field: "pbMoney", title:"金额" }
	    ]
	});
	
});

function add(){
	loadPage("purchaseBackEdit");
}
function editPB(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {	
		loadPage("purchaseBackEdit", { _id : row._id });	
	}

}

function pending() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.pbStatus == "已提交"){
		$.ajax({
			url : baseUrl+"/purchase/back/pending",
			success : function(responsetxt) {
				var res;
				eval("res=" + responsetxt);
				if (res.status == "0") {
					alert(res.msg);
				} else {
					alert("中止成功");
					listDatasource.read();
				}
			}, error : function() {
				alert("连接Service失败");
			}, data : {
				_id : row._id
			},method : "post"
		});
	}else{
		alert("点击列表选择已提交的数据");
	}
}

function destroy() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.pbStatus == "草稿") {
		$.ajax({
			url : baseUrl+"/purchase/back/destroy",
			success : function(responsetxt) {
				var res;
				eval("res=" + responsetxt);
				if (res.status == "0") {
					alert(res.msg);
				} else {
					listDatasource.read();
				}
			}, error : function() {
				alert("连接Service失败");
			}, data : {
				_id : row._id
			},method : "post"
		});
	}else{
		alert("数据不能删除");
	}
}
