//销售合同主要列表页 dataSource
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/sc/list",
			dataType : "jsonp"
		},
		update : {
			url : "../service/sc/update",
			dataType : "jsonp",
			method : "post"
		},
		create : {
			url : "../service/sc/add",
			dataType : "jsonp",
			method : "post"
		},
		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {
					models : kendo.stringify(options.models)
				};
			}
		}
	},
	pageSize: 10,
	batch : true//,
	
//	schema : {
//		model : salesContractFormModel
//	}
});

$(document).ready(function() {
	
	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : {
			buttonCount:5,
			//input:true,
			//pageSizes:true
		},
		editable : "popup",
		toolbar : [ { template: kendo.template($("#template").html()) } ],
		selectable: "row",
        sortable: {
            mode: "multiple",
            allowUnsort: true
        },
		columns : [ {
			field : "contractCode",
			title : "合同编号"
		},{
			field : "projectCode",
			title : "项目编号"
		}, {
			field : "projectName",
			title : "项目名"
		}, {
			field : "projectManager",
			title : "PM"
		}, {
			field : "customer",
			title : "客户名"
		}, {
			field : "contractAmount",
			title : "合同金额"
		}, {
			field : "contractDate",
			title : "签订日期"
		}]
	});
});//end dom ready	

function toolbar_deleteSalesContract() {
	var rowData = getSelectedRowDataByGrid("grid");
	alert("Delete the row _id: " + rowData._id);
  	return false;
};//end toolbar_delete
	
function toolbar_addSalesContract(){
	loadPage("addsc");
}

function toolbar_modifySalesContract() {
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条合同记录！");
		return;
	}
	loadPage("editsc",{_id:rowData._id});
};

function toolbar_viewSalesContract() {
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请点击选择一条合同记录！");
		return;
	}
	loadPage("viewsc",{_id:rowData._id});
};


	
	
	
	
	