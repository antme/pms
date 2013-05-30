var dataSource;
$(document).ready(function() {
	dataSource = new kendo.data.DataSource({
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
			//	parameterMap : function(options, operation) {
				//if (operation !== "read" && options.models) {
					//return {
						//models : kendo.stringify(options.models)
					//};
				//}
			//},
			
			method : "post"
		},
		pageSize: 5,
        //serverPaging: true,
        //serverSorting: true,
        //serverFiltering: true,
		//batch : true,
		
        schema : {
			model : {
				id : "_id",
				fields : {
					_id : {
						editable : false,
						nullable : true
					},
					projectName : {
						validation : {
							required : true
						}
					}
				}
			}
		},
	});

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
			title : "开票金额%"
		}, {
			field : "getAmount",
			title : "到款金额%"
		}, {
			field : "purchaseAmount",
			title : "采购金额%"
		}]

	});
	
	$("#addNewProject").hide();
});		

	function toolbar_delete() {
		var rowData = getSelectedRowDataByGrid("grid");
		alert("Delete the row _id: " + rowData._id);
	  	console.log("Toolbar command is clicked!");
	  	return false;
	};
	
	function toolbar_projectApprove() {
		var rowData = getSelectedRowDataByGrid("grid");
		alert("Approved prject _id: " + rowData._id);
		console.log("Toolbar command is clicked!");
		return false;
	};
	
	function onActivate(e) {
		
	}
	
	function toolbar_addNewProject() {
		console.log("add new project##############");
		$("#addNewProject").show();
		var window = $("#addNewProject");
		if (!window.data("kendoWindow")) {
			window.kendoWindow({
				width : "900px",
				height : "500px",
				title : "新建项目",
				modal : true,
				activate : onActivate
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

	}
		
	