var baseUrl = "../../service/purchase";
var requestModel;
var listDatasource;
$(document).ready(function () {	
	checkRoles();
	requestModel = kendo.data.Model.define({
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

	listDatasource = new kendo.data.DataSource({
	    transport: {
	        read:  {
	            url: baseUrl + "/allot/list",
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
	        model: requestModel,
	        data:"data"
	    }
	});	
	
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    selectable : "row",
	    columns: [
	        { field: "paCode", title: "调拨编号" },
	        { field: "contractCode", title:"销售合同编号" },
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
