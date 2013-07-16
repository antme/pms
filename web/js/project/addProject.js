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
		/*customer : {
			validation : {
				required : true
			}
		},*/
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
		},projectStatus: {
			 defaultValue: "销售立项"
		},scs:{}
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

var pSCInfoDatasource = new kendo.data.DataSource({
	schema: {
	    model: { id: "_id" }
	}
});

$(document).ready(function() {
	//表单中的各种控件
	$("#projectStatus").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
		optionLabel : "选择项目状态...",
		dataSource : proStatusItemsForAdd
	});
	$("#projectType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
		optionLabel : "选择立项类别...",
		dataSource : proCategoryItems
	});
	

	$("#projectManager").kendoDropDownList({
		dataTextField : "userName",
		dataValueField : "_id",
        optionLabel: "选择项目经理...",
		dataSource : proManagerItems,
	});
	
	/*var customerItems = new kendo.data.DataSource({
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
	});*/
	if(popupParams){
		if (popupParams.scAddProject == 1){//销售合同中进入添加
			pModel = new projectModel();
			kendo.bind($("#addProject"), pModel);
			
			$("#projectStatus").data("kendoDropDownList").setDataSource(proStatusItems);
		}else{
			postAjaxRequest("/service/project/getandmergescinfo", popupParams, popView);
			disableAllInPoppup();
		}
	}else if (redirectParams) {//Edit
		postAjaxRequest("/service/project/get", redirectParams, edit);
	} else {//Add
		//添加表单绑定一个空的 Model
		pModel = new projectModel();
		kendo.bind($("#addProject"), pModel);
	}
	
});//end dom ready

function popView(data){
	pModel = new projectModel(data);
	kendo.bind($("#addProject"), pModel);
	
	/*$("#scs").kendoTooltip({
        filter: "tr",
        content: kendo.template($("#scsTemplate").html()),
        width: 400,
        height: 200,
        position: "top"
    });

    $("#scs").find("tr").click(false);*/
	
	$("#scs").show();
	//关联合同
	pSCInfoDatasource.data(pModel.scs);
	if (!$("#scs").data("kendoGrid")){
		$("#scs").kendoGrid({
			dataSource : pSCInfoDatasource,
			columns : [ {
				field : "contractCode",
				title : "合同编号",
				template : function(dataItem) {
					return '<a  onclick="viewSC(\'' + dataItem._id + '\');">' + dataItem.contractCode + '</a>';
				},
				width:150
			}/*, 
			{
				field : "contractPerson",
				title : "签订人"
			}*/]
		});
	}//关联合同
}

function edit(data){
	pModel = new projectModel(data);
	kendo.bind($("#addProject"), pModel);
	var pTypeList = $("#projectType").data("kendoDropDownList");
	pTypeList.enable(false);
	
	$("#projectCode").attr("disabled",true);
}

function saveProject(){
	var validator = $("#addProject").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		return;
    } else {
    	if (popupParams !=null && popupParams.scAddProject == 1){//创建销售合同时 创建项目
    		saveProjectInAddSC(pModel.toJSON());
		}else{
	    	dataSource.add(pModel);
	    	dataSource.sync();
			loadPage("projectList");
		}
    	
    }
	
};

function cancelAddProject(){
	if (popupParams !=null && popupParams.scAddProject == 1){
		//close the window
		$("#popup").data("kendoWindow").close();
	}else{
		loadPage("projectList");
	}
}

function saveProjectInAddSC(data){
	postAjaxRequest("/service/project/add", data, saveProjectInAddSCCallBack);
}

function saveProjectInAddSCCallBack(data){
	$("#popup").data("kendoWindow").close();
	projectItems.read();
	var pdblist = $("#projectId").data("kendoDropDownList");
	pdblist.value(data._id);
	scm.set("projectId",data._id);
	$("#selProjectName").html(data.projectName);
	showTabs(data.projectStatus);
}

function viewSC(id){
	$("#scInfo").show();
	var data = pSCInfoDatasource.get(id);
	$("#scInfo_scCode").html(data.contractCode);
	$("#scInfo_scPerson").html(data.contractPerson);
	$("#scInfo_scDate").html(kendo.toString(data.contractDate, 'd'));
	$("#scInfo_scCustomer").html(data.customer);
	$("#scInfo_scType").html(data.contractType);
	$("#scInfo_scRunningStatus").html(data.runningStatus);
	$("#scInfo_scAmount").html(data.contractAmount);
}
