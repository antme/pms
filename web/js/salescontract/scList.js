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
			field : "customerName",
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

function toolbar_delete() {
	var rowData = getSelectedRowDataByGrid("grid");
	alert(kendo.stringify(rowData));
	alert("Delete the row _id: " + rowData._id);
  	console.log("Toolbar command is clicked!");
  	return false;
};//end toolbar_delete
	
function toolbar_addSalesContract(){
	loadPage("addsc");
}
	
function toolbar_addNewProject() {
	pfm = new addProjectFormModel();
	console.log("add new project##############" + kendo.stringify(pfm));
	$("#addNewProject").show();
	
	var window = $("#addNewProject");
	if (!window.data("kendoWindow")) {
		window.kendoWindow({
			width : "900px",
			height : "500px",
			title : "新建项目",
			modal : true,
			close : onWindowClose
		});
		window.data("kendoWindow").center();
	} else {
		window.data("kendoWindow").open();
		window.data("kendoWindow").center();
	}
	
	//clear the grid data
	eqCostListDataSource.data(pfm.eqcostList);
	
	kendo.bind($("#addNewProject"), pfm);
	console.log("bind ok!!!!!!!!!!!!!!!!!!!!!");
	
	//add new project : click Save
//		$("#saveButton").click(function(){
//			console.log("add new project save ********************************");
//			var data = eqCostListDataSource.data();
//			
//			//console.log("start save : *******"+pfm);
//			//pfm.set("eqcostList",eqCostListDataSource.data());
//			pfm.set("eqcostList",data);
//			pfm.set("totalAmount", 0);
//			pfm.set("invoiceAmount", 0);
//			pfm.set("getAmount", 0);
//			pfm.set("purchaseAmount", 0);
//			
//			//console.log("set over will add ****"+kendo.stringify(pfm));
//			
//			//console.log(dataSource);
//			dataSource.add(pfm);
////			console.log(dataSource);
//			console.log("add new project sync ********************************");
//			dataSource.sync();
//			
//			var window = $("#addNewProject");
//			if (window.data("kendoWindow")) {
//				window.data("kendoWindow").close();
//			}
//
//			var grid = $("#grid");
//			if (grid.data("kendoGrid")) {
//				grid.data("kendoGrid").refresh();
//			}
//		});
};//end toolbar_addNewProject

function toolbar_modifyProject() {
	
	var rowData = getSelectedRowDataByGrid("grid");
	if (rowData == null){
		alert("请选择一条项目记录！");
		return;
	}
	
	pfm = rowData;
	console.log("########rowData:" + kendo.stringify(pfm));
	
	$("#addNewProject").show();
	var window = $("#addNewProject");
	var kendoWindow = window.data("kendoWindow");
	if (!kendoWindow) {
		window.kendoWindow({
			width : "900px",
			height : "500px",
			title : "项目变更",
			modal : true,
			close : onWindowClose
		});
		kendoWindow = window.data("kendoWindow");
		kendoWindow.center();
	} else {
		kendoWindow.open();
		kendoWindow.center();
	}

	//成本设备清单
	eqCostListDataSource.data(pfm.eqcostList);
	
	kendo.bind($("#addNewProject"), pfm);
	console.log("bind ok!!!!!!!!!!!!!!!!!!!!!");
	
	//modify click Save
//		$("#saveButton").click(function(){
//			var data = eqCostListDataSource.data();
//			
//			//console.log("start save : *******"+pfm);
//			//pfm.set("eqcostList",eqCostListDataSource.data());
//			pfm.set("eqcostList",data);
//			pfm.set("totalAmount", 0);
//			pfm.set("invoiceAmount", 0);
//			pfm.set("getAmount", 0);
//			pfm.set("purchaseAmount", 0);
//			
//			//console.log("set over will add ****"+kendo.stringify(pfm));
//			
//			console.log(dataSource);
////			dataSource.add(pfm);
////			console.log(dataSource);
//			dataSource.sync();
//			var window = $("#addNewProject");
//
//			if (window.data("kendoWindow")) {
//				window.data("kendoWindow").close();
//			}
//
//			var grid = $("#grid");
//			if (grid.data("kendoGrid")) {
//				grid.data("kendoGrid").refresh();
//			}
//		});
};

function saveProject(){
		console.log("saveProject *****************************");
		var _id = pfm.get("_id");
		console.log(_id);
		console.log("save pfm &&&&&&&&&&&&"+kendo.stringify(pfm));
		var data = eqCostListDataSource.data();
		
		//console.log("start save : *******"+pfm);
		//pfm.set("eqcostList",eqCostListDataSource.data());
		pfm.set("eqcostList",data);
		pfm.set("totalAmount", 0);
		pfm.set("invoiceAmount", 0);
		pfm.set("getAmount", 0);
		pfm.set("purchaseAmount", 0);
		
		//console.log("set over will add ****"+kendo.stringify(pfm));
		
		console.log(dataSource);
		if (_id == null){
			dataSource.add(pfm);
		}
		
//		console.log(dataSource);
		dataSource.sync();
		var window = $("#addNewProject");

		if (window.data("kendoWindow")) {
			window.data("kendoWindow").close();
		}

		var grid = $("#grid");
		if (window.data("kendoGrid")) {
			window.data("kendoGrid").refresh();
		}
	};

	
	
	
	
	