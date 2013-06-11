var baseUrl = "../../service/back";
$(document).ready(function () {	
	
	var requestModel = kendo.data.Model.define({
		id : "_id",
		fields : {
			_id : {
				editable : false,
				nullable : true
			},
			code:{},
			department:{},
			submitDate:{},
			planDate:{},
			type:{},
			status:{},
			specialRequire:{},
			comment:{},
			money:{},
			eqcostList:{},
			costUsedGoods: {},
			countUsedRquest: {},
			percentUsedGoods: {},
			costUsedGoods: {},		
			project_code : {},
			project_name : {},
			project_managerName : {},
			customer_name : {},
			salesContract_code : {},
			purchaseOrder_code: {},
			purchaseContract_code: {}
		}
	});

	var listDatasource = new kendo.data.DataSource({
	    transport: {
	        read:  {
	            url: baseUrl + "/list",
	            dataType: "jsonp",
	            type : "post"
	        },
	        parameterMap: function(options, operation) {
	            if (operation !== "read" && options.models) {
	                return {models: kendo.stringify(options.models)};
	            }
	        }
	    },
	    batch: true,
	    pageSize: 10,
	    schema: {
	        model: requestModel
	    }
	});	
	
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    selectable : "row",
	    toolbar: kendo.template($("#template").html()),
	    columns: [
	        { field: "code", title: "申请编号" },
	        { field: "type", title:"采购类别" ,width:"120px"},
	        { field: "salesContract_code", title:"销售合同编号" },
	        { field: "purchaseOrder_code", title:"采购订单编号" },
	        { field: "purchaseContract_code", title:"采购合同编号" },
	        { field: "customer_name", title:"客户名" },
	        { field: "project_managerName", title:"PM" },
	        { field: "status", title:"申请状态" },
	        { field: "approvedDate", title:"批准时间" },
	        { field: "money", title:"金额" },
	        { field: "countUsedRquest", title:"合同下申请单数量" }/*,
	        { field: "percentUsedGoods", title:"合同下已成功申请请货物%" },
	        { field: "costUsedGoods", title:"合同下已成功申请货物金额%" }*/
	    ]
	});
	
	
	
});

function add(){
	loadPage("backedit");
}
function edit(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {	
		loadPage("backedit", { _id : row._id });	
	}

}

function approve() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		$.ajax({
			url : baseUrl+"/approve",
			success : function(responsetxt) {
				var res;
				eval("res=" + responsetxt);
				if (res.status == "0") {
					alert(res.msg);
				} else {
					alert("审核成功");
					listDatasource.read();
				}
			}, error : function() {
				alert("连接Service失败");
			}, data : {
				_id : row._id
			},method : "post"
		});
	}
}

function reject() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		$.ajax({
			url : baseUrl+"/reject",
			success : function(responsetxt) {
				var res;
				eval("res=" + responsetxt);
				if (res.status == "0") {
					alert(res.msg);
				} else {
					alert("拒绝成功");
					listDatasource.read();
				}
			}, error : function() {
				alert("连接Service失败");
			}, data : {
				_id : row._id
			}, method : "post"
		});
	}
}
