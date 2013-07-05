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
			pageable : true,
		    sortable : true,
			filterable : filterable,
			selectable : "row",
			width : "1000px",
			height: "400px",
			columns : [ {
				field : "repositoryCode",
				title : "申请编号"
			} , {
				field : "orderCode",
				title : "单据编号"
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


function add(){
	loadPage("html/repository/repositoryEdit.html");
}


function cancelRepo() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "已中止"){
			alert("此申请已中止，不需要再次中止");
		}else if(row.status == "已入库"){
			alert("数据已入库，不能中止");
		}else{
			process(cancelUrl);
		}
	}
}

function editRepo() {
	// 如果是从订单列表页点击edit过来的数据
	var row = getSelectedRowDataByGrid("grid");
	if(row.status == "已入库"){
		alert("已入库，不能再编辑!");
	}else{
		loadPage("html/repository/repositoryEdit.html", {
			_id : row._id
		});
	}
}

function confirmRepository(){
	
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "已入库"){
			alert("此申请已入库，不需要再次入库");
		}else{
			loadPage("html/repository/repositoryEdit.html", {
				_id : row._id
			});
		}
	}
}



