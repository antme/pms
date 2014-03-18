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
		projectManagerId : {
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
			 defaultValue: "销售预立项"
		},scs:{}
	}

});

var pModel;


var pSCInfoDatasource = new kendo.data.DataSource({
	schema: {
	    model: { id: "_id" }
	}
});

$(document).ready(function() {
	//表单中的各种控件
	

	if(popupParams){
		if (popupParams.scAddProject == 1){//销售合同中进入添加
			pModel = new projectModel();
			kendo.bind($("#addProject"), pModel);
			
			$("#projectStatus").data("kendoDropDownList").setDataSource(proStatusItems);
		}else{
			postAjaxRequest("/service/project/getandmergescinfo", popupParams, projectPopView);
			disableAllInPoppup();
		}
	}else{
		if($("#projectStatus").length > 0){
			$("#projectStatus").kendoDropDownList({
				dataTextField : "text",
				dataValueField : "value",
				optionLabel : "选择项目状态...",
				dataSource : proStatusItems,
				change: function(e){
					var projectStatusDl = 	$("#projectStatus").data("kendoDropDownList");
				}
			});
		}
//		if($("#projectType").length > 0){
//			$("#projectType").kendoDropDownList({
//				dataTextField : "text",
//				dataValueField : "text",
//				optionLabel : "选择立项类别...",
//				dataSource : proCategoryItems
//			});
//		}

		if($("#projectManagerId").length > 0){
			$("#projectManagerId").kendoDropDownList({
				dataTextField : "userName",
				dataValueField : "_id",
		        optionLabel: "选择项目经理...",
				dataSource : proManagerItems
			});
		}

		if($("#customerId").length>0){
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
			
			$("#customerId").kendoDropDownList({
				dataTextField : "name",
				dataValueField : "_id",
		        optionLabel: "选择客户...",
				dataSource : customerItems
			});
		}
		if (redirectParams) {//Edit
			postAjaxRequest("/service/project/get", redirectParams, editProject);
		} else {//Add
			//添加表单绑定一个空的 Model
			pModel = new projectModel();
			kendo.bind($("#addProject"), pModel);
			$("#projectCode").attr("disabled",true);
		}
	}
	
});//end dom ready

function projectPopView(data){
	pModel = new projectModel(data);
	pModel.projectManagerId = pModel.projectManagerName;
	pModel.customerId = pModel.customerName;
	
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

function editProject(data){
	var pStatus = $("#projectStatus").data("kendoDropDownList");

	if(data){
		//立项类别不可修改， 所以编辑时候切换到包含 销售正式立项的datasource
		if(pStatus){
			pStatus.setDataSource(proStatusItems);
		}
	}
	pModel = new projectModel(data);
	kendo.bind($("#addProject"), pModel);

	disableForm();
	
	
	
	//$("#projectCode").attr("disabled",true);
}

function addRequiredField(){
	
}

function disableForm(){
	
	
	$("#projectCode").attr("disabled",true);
	$("#projectName").attr("disabled",true);
	$("#projectAbbr").attr("disabled",true);

//	var pTypeList = $("#projectType").data("kendoDropDownList");
//	if(pTypeList){
//		pTypeList.enable(false);
//	}
	var pManager = $("#projectManagerId").data("kendoDropDownList");
	
	if(pManager && pModel.projectManagerId && pModel.projectManagerId!=""){
		pManager.enable(false);
	}
	
	var pStatus = $("#projectStatus").data("kendoDropDownList");

	if(pStatus && pModel.projectStatus=="销售正式立项"){
		pStatus.enable(false);
	}
	
	var customer = $("#customerId").data("kendoDropDownList");

	if(customer && pModel.customerId && pModel.customerId!=""){
		customer.enable(false);
	}
	
	if(pModel.projectType && pModel.projectType!="" && $("#projectType").length>0){
		$("#projectType").attr("disabled",true);
	}
	
}

function saveProject(){
	var validator = $("#addProject").kendoValidator().data("kendoValidator");
	if (!validator.validate()) {
		return;
    } else {
    	if (popupParams !=null && popupParams.scAddProject == 1){//创建销售合同时 创建项目
    		saveProjectInAddSC(pModel.toJSON());
		}else{
			
			if(pModel.customerId && pModel.customerId._id){
				pModel.customerId = pModel.customerId._id;
			}
			
			if(pModel.projectManagerId && pModel.projectManagerId._id){
				pModel.projectManagerId = pModel.projectManagerId._id;
			}
			
			if(pModel.projectType && pModel.projectType.value){
				pModel.projectType = pModel.projectType.value;
			}
			
			var proType = pModel.projectType;
			var proAbbr = null;
			if(pModel.projectAbbr){
				proAbbr = pModel.projectAbbr.trim();
			}
			if ("工程"==proType && (proAbbr==null || proAbbr.length==0)){
				$("#projectAbbr").removeAttr("disabled");
				alert("工程类项目缩写不能为空！");
				return;
			}
	    	postAjaxRequest("/service/project/add", pModel.toJSON(), function(data){
				loadPage("project_projectList");
	    	});
		}    	
    }	
};

function cancelAddProject(){
	if (popupParams !=null && popupParams.scAddProject == 1){
		//close the window
		$("#popup").data("kendoWindow").close();
	}else{
		loadPage("project_projectList");
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
	$("#scInfo_scCustomer").html(data.customerName);
	$("#scInfo_scType").html(data.contractType);
	$("#scInfo_scRunningStatus").html(data.runningStatus);
	$("#scInfo_scAmount").html(data.contractAmount);
}
