var listUrl = "/service/purcontract/repository/list?type=in";
var approveUrl = "/service/purcontract/repository/approve?type=in";
var deleteUrl = "/service/purcontract/repository/delete?type=in";
var cancelUrl = "/service/purcontract/repository/cancel?type=in";


var gridOptions = {
		transport : {
			read : {
				url : listUrl,
				dataType : "jsonp",
				type : "post"
			},		
			//必须放在transport内，mytasks参数来至于点击我的任务
			parameterMap : myTaskQueryParam			
		}
}
gridOptions =  $.extend( gridOptions, commonListOptions);

// 外面列表页的datasource对象
var listDataSource = new kendo.data.DataSource(gridOptions);

$(document).ready(function() {
	checkRoles();

	if ($("#grid").length > 0) {
		// 初始化采购订单列表页
		$("#grid").kendoGrid({
			dataSource : listDataSource,
			pageable : true, resizable: true,
		    sortable : true,
			filterable : filterable,
			selectable : "row",
			width : "1000px",
			height: "400px",
			columns : [ {
				field : "repositoryCode",
				title : "申请编号",
				template : function(dataItem) {
					return '<a  onclick="openRepositoryViewWindow(\'' + dataItem._id + '\');">' + dataItem.repositoryCode + '</a>';
				}
			} , {
				field : "offlineRepositoryCode",
				title : "单据编号"
			},{
				field : "projectName",
				title : "项目名"
			},{
				field : "contractCode",
				title : "销售合同编号"
			},{
				field : "supplierName",
				title : "供应商"
			}, {
				field : "status",
				title : "入库状态"
			}, {
				field : "inDate",
				title : "入库时间"
			}, {
				field : "totalIn",
				title : "入库总数"
			}  ]

		});

	}

});


function deleteRepoData(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.status == "草稿"){	
		if(confirm("删除表单，确认？")){
			postAjaxRequest("service/purchase/back/destroy", {_id:row._id}, function(){listDatasource.read();});
		}
	}else{
		alert("只能删除草稿的入库申请数据");
	}
}

function openAddRepositoryWindow(){
	loadPage("repository_repositoryEdit");
}


function cancelRepo() {

	
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "已提交" || row.status == "草稿"){
			if(confirm("确认退回？")){
				postAjaxRequest(cancelUrl, {
					_id : row._id
				}, function(data) {
					listDataSource.read();
				});
			}
			
		}else {
			alert("只能废除未发采购订单的数据或则已提交的数据");
		}
	}
	
}

function openEditRepoWindow() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");
	if(row.status == "草稿"){
		loadPage("repository_repositoryEdit", {
			_id : row._id
		});

	}else{
		alert("只能编辑草稿数据!");
	}
}

function openConfirmRepositoryPage(){
	
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "已提交"){			
			loadPage("repository_repositoryEdit", {
				_id : row._id,
				page: "confirm"
			});
		}else{
			alert("只能确认已提交的数据");
		}
	}
}



