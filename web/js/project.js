
var addProjectFormModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		projectCode : {
			validation : {
				required : true
			}
		},
		projectName : {
			validation : {
				required : true
			}
		},
		projectManager : {
			validation : {
				required : true
			}
		},
		customerName : {
			validation : {
				required : true
			}
		},
		projectStatus : {
			validation : {
				required : true
			}
		},
		projectType : {
			validation : {
				required : true
			}
		},
		projectAddress : {
			validation : {
				required : true
			}
		},
		projectMemo : {
			validation : {
				required : true
			}
		},
		contractAmount : {
			
		},
		invoiceType : {
			
		},
		estimateEqCost0 : {
			
		},
		estimateEqCost1 : {
			
		},
		estimateSubCost : {},
		estimatePMCost : {},
		estimateDeepDesignCost:{},
		estimateDebugCost:{},
		estimateOtherCost:{},
		debugCostType:{},
		taxType:{},
		contractCode : {
			
		},
		contractPerson : {
			
		},
		contractType : {
			
		},
		contractDate : {
			
		},
		contractDownPayment : {
			
		},
		progressPayment : {
			
		},
		qualityMoney : {
			
		},
		contractMemo : {
			
		},
		eqcostList : {
			
		}
	}

});
var eqCostListDataSource = new kendo.data.DataSource({
//	data:[],
	schema : {
		model : {
            fields: {
            	eqcostNo: { type: "string" },
            	eqcostMaterialCode: { type: "string" },
            	eqcostProductName: { type: "string" },
            	eqcostProductType: { type: "string" },
            	eqcostAmount: { type: "number" },
            	eqcostUnit: { type: "string" },
            	eqcostBrand: { type: "string" },
            	eqcostBasePrice: { type: "number" },
            	eqcostMemo: { type: "string" }
            }
        }
	}
});
var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/project/list",
			dataType : "jsonp"
		},
		update : {
			url : "../service/project/update",
			dataType : "jsonp",
			method : "post"
		},
		create : {
			url : "../service/project/add",
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
	batch : true,
	pageSize: 10,
    //serverPaging: true,
    //serverSorting: true,
    //serverFiltering: true,
	//batch : true,
	
	schema : {
		model : addProjectFormModel
	},
});

$(document).ready(function() {
	
	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : {
			pageSize: 5,
			buttonCount:5,
			//input:true,
			//pageSizes:true
		},
		editable : "popup",
		toolbar : [ { template: kendo.template($("#template").html()) } ],
		selectable: "multiple, row",
        sortable: {
            mode: "multiple",
            allowUnsort: true
        },
		columns : [ {
			field : "projectCode",
			title : "项目编号"
		}, {
			field : "projectName",
			title : "项目名"
		}, {
			field : "projectStatus",
			title : "项目状态",
			template:function(dataItem) {
				var name = "";
				if (dataItem.projectType == 1){
					name = "正式立项";
				} else if (dataItem.projectType == 2){
					name = "预立项";
				} else {
					name = "内部立项";
				}
				return name;
			}
		}, {
			field : "projectType",
			title : "项目类型",
			template:function(dataItem) {
				var name = "";
				if (dataItem.projectType == 1){
					name = "产品";
				} else if (dataItem.projectType == 2){
					name = "工程";
				} else {
					name = "服务";
				}
				return name;
			}
		}, {
			field : "projectManager",
			title : "PM"
		}, {
			field : "customerName",
			title : "客户名"
		}, {
			field : "totalAmount",
			title : "项目总金额"
		}, {
			field : "invoiceAmount",
			title : "开票金额"
		}, {
			field : "getAmount",
			title : "到款金额"
		}, {
			field : "purchaseAmount",
			title : "采购金额"
		}]

	});
	
	$("#addNewProject").hide();
	
	
});//end dom ready	

	function toolbar_delete() {
		var rowData = getSelectedRowDataByGrid("grid");
		alert(kendo.stringify(rowData));
		alert("Delete the row _id: " + rowData._id);
	  	console.log("Toolbar command is clicked!");
	  	return false;
	};//end toolbar_delete
	
	function toolbar_projectApprove() {
		var rowData = getSelectedRowDataByGrid("grid");
		alert("Approved prject _id: " + rowData._id);
		console.log("Toolbar command is clicked!");
		return false;
	};

	var pfm;
	
	function toolbar_addNewProject() {
		pfm = new addProjectFormModel();
		console.log("add new project##############" + kendo.stringify(pfm));
		$("#addNewProject").show();
		kendo.bind($("#addNewProject"), pfm);
		console.log("bind ok!!!!!!!!!!!!!!!!!!!!!");
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
		
		//click Save
		$("#saveButton").click(function(){
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
			dataSource.add(pfm);
//			console.log(dataSource);
			dataSource.sync();
			var window = $("#addNewProject");

			if (window.data("kendoWindow")) {
				window.data("kendoWindow").close();
			}

			var grid = $("#grid");
			if (window.data("kendoGrid")) {
				window.data("kendoGrid").refresh();
			}
		});
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
		kendo.bind($("#addNewProject"), pfm);
		console.log("bind ok!!!!!!!!!!!!!!!!!!!!!");

		
		//成本设备清单
		eqCostListDataSource.data(pfm.eqcostList);
//		$("#pcEqCostList").kendoGrid({
//			dataSource : eqCostListDataSource,
//			columns : [ {
//				field : "eqcostNo",
//				title : "序号"
//			}, {
//				field : "eqcostMaterialCode",
//				title : "物料代码"
//			}, {
//				field : "eqcostProductName",
//				title : "产品名称"
//			}, {
//				field : "eqcostProductType",
//				title : "规格型号"
//
//			}, {
//				field : "eqcostAmount",
//				title : "数量"
//			}, {
//				field : "eqcostUnit",
//				title : "单位"
//			}, {
//				field : "eqcostBrand",
//				title : "品牌"
//			}, {
//				field : "eqcostBasePrice",
//				title : "成本价"
//			}, {
//				field : "eqcostMemo",
//				title : "备注"
//			} ],
//
//			toolbar : [ {name:"create",text:"新增成本项"} ],
//			editable : true,
//			scrollable : true
//		});
		
		
		//click Save
		$("#saveButton").click(function(){
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
//			dataSource.add(pfm);
//			console.log(dataSource);
			dataSource.sync();
			var window = $("#addNewProject");

			if (window.data("kendoWindow")) {
				window.data("kendoWindow").close();
			}

			var grid = $("#grid");
			if (window.data("kendoGrid")) {
				window.data("kendoGrid").refresh();
			}
		});
	};
	
	function saveProject(){
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
		dataSource.add(pfm);
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

	var proStatusItems = [{ text: "正式立项", value: "1" }, { text: "预立项", value: "2" }, { text: "内部立项", value: "3" }];
	$("#projectStatus").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
		optionLabel : "选择项目状态...",
		dataSource : proStatusItems
	});
	var proCategoryItems = [{ text: "产品", value: "1" }, { text: "工程", value: "2" }, { text: "服务", value: "3" }];
	$("#projectType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
		optionLabel : "选择项目类型...",
		dataSource : proCategoryItems
	});
	
	var proManagerItems = [{ text: "Danny", value: "1" }, { text: "Dylan", value: "2" }, { text: "Jacky", value: "3" }];
	$("#projectManager").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择项目经理...",
		dataSource : proManagerItems,
	});
	
	var invoiceTypeItems = [{ text: "invoiceType1", value: "1" }, { text: "invoiceType2", value: "2" }, { text: "invoiceType3", value: "3" }];
	$("#invoiceType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择发票类型...",
		dataSource : invoiceTypeItems,
	});
	var taxTypeItems = [{ text: "taxType1", value: "1" }, { text: "taxType2", value: "2" }, { text: "taxType3", value: "3" }];
	$("#taxType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择税收类型...",
		dataSource : taxTypeItems,
	});
	
	var debugCostTypeItems = [{ text: "debugCostType1", value: "1" }, { text: "debugCostType2", value: "2" }, { text: "debugCostType3", value: "3" }];
	$("#debugCostType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择调试费用类型...",
		dataSource : debugCostTypeItems,
	});
	
	var contractTypeItems = [{ text: "contractType1", value: "1" }, { text: "contractType2", value: "2" }, { text: "contractType3", value: "3" }];
	$("#contractType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择合同类型...",
		dataSource : contractTypeItems,
	});
	
	function onWindowClose(){
		var window = $("#addNewProject");
		if(window.data("kendoWindow")){
//			window.data("kendoWindow").destroy();
		}
		dataSource.read();
	};
	
	//popup window initial 
	//合同签订日期控件
	$("#contractDate").kendoDatePicker();
	
	$("#contractAmount").kendoNumericTextBox({
		min:0
	});
	$("#estimateEqCost0").kendoNumericTextBox({
		min:0
	});
	$("#estimateEqCost1").kendoNumericTextBox({
		min:0
	});
	$("#estimateSubCost").kendoNumericTextBox({
		min:0
	});
	$("#estimatePMCost").kendoNumericTextBox({
		min:0
	});
	$("#estimateDeepDesignCost").kendoNumericTextBox({
		min:0
	});
	$("#estimateDebugCost").kendoNumericTextBox({
		min:0
	});
	$("#estimateOtherCost").kendoNumericTextBox({
		min:0
	});
	$("#contractDownPayment").kendoNumericTextBox({
		min:0
	});
	$("#progressPayment").kendoNumericTextBox({
		min:0
	});
	$("#qualityMoney").kendoNumericTextBox({
		min:0
	});
	
	$("#tabstrip").kendoTabStrip({
        animation:  {
            open: {
                effects: "fadeIn"
            }
        }
    });
	
	//成本设备清单
	//eqCostListDataSource.data(null);
	if (!$("#pcEqCostList").data("kendoGrid")){
		$("#pcEqCostList").kendoGrid({
			dataSource : eqCostListDataSource,
			columns : [ {
				field : "eqcostNo",
				title : "序号"
			}, {
				field : "eqcostMaterialCode",
				title : "物料代码"
			}, {
				field : "eqcostProductName",
				title : "产品名称"
			}, {
				field : "eqcostProductType",
				title : "规格型号"

			}, {
				field : "eqcostAmount",
				title : "数量"
			}, {
				field : "eqcostUnit",
				title : "单位"
			}, {
				field : "eqcostBrand",
				title : "品牌"
			}, {
				field : "eqcostBasePrice",
				title : "成本价"
			}, {
				field : "eqcostMemo",
				title : "备注"
			} ],

			toolbar : [ {name:"create",text:"新增成本项"} ],
			editable : true,
			scrollable : true
		});
	}
	
	
	
	
	