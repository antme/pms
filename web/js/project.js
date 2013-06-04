
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
		toolbar : [ {name: "create", text: "添加"},{ template: kendo.template($("#template").html()) } ],
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
			title : "项目状态"
		}, {
			field : "projectType",
			title : "项目类型"
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

	var pfm = new addProjectFormModel();
	
	function toolbar_addNewProject() {
		console.log("add new project##############");
		kendo.bind($("#addNewProject"), pfm);
		$("#addNewProject").show();
		var window = $("#addNewProject");
		if (!window.data("kendoWindow")) {
			window.kendoWindow({
				width : "900px",
				height : "500px",
				title : "新建项目",
				modal : true
			});
			window.data("kendoWindow").center();
		} else {
			window.data("kendoWindow").open();
			window.data("kendoWindow").center();
		}
		
		$("#tabstrip").kendoTabStrip({
            animation:  {
                open: {
                    effects: "fadeIn"
                }
            }
        });
	};//end toolbar_addNewProject
	

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
	
	var contractTypeItems = [{ text: "contractType1", value: "1" }, { text: "contractType2", value: "2" }, { text: "contractType3", value: "3" }];
	$("#contractType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择合同类型...",
		dataSource : contractTypeItems,
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
	
	function saveProject(){
		dataSource.add(pfm);
		dataSource.sync();
		var window = $("#addNewProject");

		if (window.data("kendoWindow")) {
			window.data("kendoWindow").close();
		}

		var grid = $("#grid");
		if (window.data("kendoGrid")) {
			window.data("kendoGrid").refresh();
		}
	}
	
	
	