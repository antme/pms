var projectModel = kendo.data.Model.define({
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
		projectAbbr : {
			validation : {
				required : true
			}
		},
		customer : {
			validation : {
				required : true
			}
		},
		projectManager : {
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
		}
	}

});

var pModel;

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
	batch : true,
	
	schema : {
		model : projectModel
	}
});

$(document).ready(function() {
	//表单中的各种控件
	var proStatusItems = [{ text: "正式立项", value: "正式立项" }, { text: "预立项", value: "预立项" }, { text: "内部立项", value: "内部立项" }];
	$("#projectStatus").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
		optionLabel : "选择项目状态...",
		dataSource : proStatusItems
	});
	var proCategoryItems = [{ text: "产品", value: "产品" }, { text: "工程", value: "工程" }, { text: "服务", value: "服务" }];
	$("#projectType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
		optionLabel : "选择项目类型...",
		dataSource : proCategoryItems
	});
	
	var proManagerItems = new kendo.data.DataSource({
		transport : {
			read : {
				url : "/service/user/list",
				dataType : "jsonp"
			}
		},
		schema: {
		    data: "data"
		}
	});
	//var proManagerItems = [{ text: "Danny", value: "1" }, { text: "Dylan", value: "2" }, { text: "Jacky", value: "3" }];
	$("#projectManager").kendoDropDownList({
		dataTextField : "userName",
		dataValueField : "_id",
        optionLabel: "选择项目经理...",
		dataSource : proManagerItems,
	});
	
	var customerItems = new kendo.data.DataSource({
		transport : {
			read : {
				url : "/service/customer/list",
				dataType : "jsonp"
			}
		},
		schema: {
		    data: "data"
		}
	});
	$("#customer").kendoDropDownList({
		dataTextField : "name",
		dataValueField : "_id",
        optionLabel: "选择客户...",
		dataSource : customerItems,
	});
	if(popupParams){
		postAjaxRequest("/service/project/get", popupParams, edit);
		disableAllInPoppup();
	}else if (redirectParams) {//Edit
		postAjaxRequest("/service/project/get", redirectParams, edit);
	} else {//Add
		//添加表单绑定一个空的 Model
		pModel = new projectModel();
		kendo.bind($("#addProject"), pModel);
	}
	
});//end dom ready

function edit(data){
	pModel = new projectModel(data);
	kendo.bind($("#addProject"), pModel);
}

function saveProject(){
	var validator = $("#addProject").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		return;
    } else {
        //var _id = pModel.get("_id");
    	//console.log(kendo.stringify(pModel));
    	dataSource.add(pModel);
    	dataSource.sync();
    	loadPage("projectList");
    }
	
};
