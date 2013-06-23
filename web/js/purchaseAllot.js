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
	        model: requestModel,
	        data:"data"
	    }
	});	
	
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    selectable : "row",
	    toolbar: kendo.template($("#template").html()),
	    columns: [
	        { field: "pbCode", title: "备货编号" ,width:"125px"},
	        { field: "pbType", title:"采购类别" ,width:"120px"},
	        { field: "contractCode", title:"销售合同编号" },
	        { field: "customer", title:"客户名" },
	        { field: "projectManager", title:"PM" },
	        { field: "pbStatus", title:"申请状态" },
	        { field: "pbSubmitDate", title:"提交时间" },
	        { field: "pbMoney", title:"金额" },
	        { field: "backRequestCount", title:"合同下备货单数量" }
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

function generateRequest(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		loadPage("html/purchasecontract/purchaseRequestEdit.html",{backId:row._id});
	}
}


