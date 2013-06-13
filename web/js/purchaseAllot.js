var baseUrl = "../../service/purchase";
var requestModel;
var listDatasource;
$(document).ready(function () {	
	
	requestModel = kendo.data.Model.define({
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
			comment:{},
			money:{},
			eqcostList:{},
			projectCode : {},
			projectName : {},
			projectManager : {},
			customer : {},
			contractCode : {},
			contractAmount:{},
			backRequestCount:{},
			purchaseOrderCode: {},
			purchaseContractCode: {}
		}
	});

	listDatasource = new kendo.data.DataSource({
	    transport: {
	        read:  {
	            url: baseUrl + "/back/listchecked",
	            dataType: "jsonp",
	            type : "post"
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
	        { field: "code", title: "备货编号" },
	        { field: "type", title:"采购类别" ,width:"120px"},
	        { field: "contractCode", title:"销售合同编号" },
	        /*{ field: "purchaseOrderCode", title:"采购订单编号" },
	        { field: "purchaseContractCode", title:"采购合同编号" },*/
	        { field: "customer", title:"客户名" },
	        { field: "projectManager", title:"PM" },
	        { field: "status", title:"申请状态" },
	        { field: "approveDate", title:"批准时间" },
	        { field: "money", title:"金额" },
	        { field: "backRequestCount", title:"备货单数量" }
	    ]
	});
	
});

function generateAllot() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		loadPage("purchaseAllotEdit",{backId:row._id});
	}
}
/*function editAllot(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else if(row.status == "调拨中"){
		loadPage("purchaseAllotEdit",{_id:row._id});
	}else{
		alert("请选择‘调拨中’的数据");
	}
}*/

function generateRequest(){}


