intSelectInput();
var subModel = kendo.data.Model.define({
	id : "eqcostNo",
	fields : {
        eqcostNo: {
			editable : false,
			nullable : true	
        },
        eqcostMaterialCode: {
        	editable : false
        },
        eqcostProductName: {
        	editable : false
        },
        eqcostProductType: {
        	editable : false
        },
        eqcostRealAmount: {
        	editable : false
        },
        eqcostUnit: {
        	editable : false
        },
        eqcostBrand: {
        	editable : false
        },
        eqcostBasePrice: {
        	editable : false
        },
        eqcostMemo: {
        	editable : false
        },
        eqcostLeftAmount: {
        	editable : false
        },
        pbTotalCount: {
        	type: "number",
        	 validation: {
                 min: 0
             }
        },
        pbComment: {}
	}
});	
var myModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		pbCode:{},
		pbDepartment:{},
		pbSubmitDate:{type:"date"},
		pbPlanDate:{type:"date"},
		pbType:{},
		pbStatus:{},
		pbComment:{},
		pbMoney:{},
		projectName: {},
		projectCode: {},
		projectManager: {},
		customer: {},
		scId:{},
		contractCode: {},
		contractAmount: {}
	}
});
var currentObj = new myModel();

$(document).ready(function () {
	checkRoles();
	$("#subGrid").kendoGrid({
		dataSource: {
			schema: {
				model: subModel
			},
			aggregate: [ 
			    { field: "eqcostNo", aggregate: "count" },
			    { field: "pbTotalCount", aggregate: "sum" },
			    { field: "eqcostLeftAmount", aggregate: "sum" },
			    { field: "eqcostRealAmount", aggregate: "sum" }
			]			
		},
	    columns: [
			{ field: "eqcostNo", title: "序号" ,footerTemplate: "总共: #=count#"},
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号" },
			{ field: "eqcostUnit", title: "单位" },
			{ field: "pbTotalCount", title: "本次申请数量", attributes: { "style": "color:red"}, footerTemplate: "总共: #=sum#"},
			{ field: "eqcostRealAmount", title: "合同中总数" ,footerTemplate: "总共: #=sum#"},
			{ field: "eqcostBasePrice", title: "预估单价" },
			{ field: "eqcostBrand", title: "品牌" },
			{ field: "eqcostMemo", title: "备注" }
	  	],	 
	  	editable:true,
	  	toolbar: [{text:"计算",name:"save"}]
	});

	$("#searchfor").kendoDropDownList({
		dataTextField : "contractCode",
		dataValueField : "_id",
		template:  '${ data.projectName }:<strong>${ data.contractCode }</strong>',
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : baseUrl+"/purchase/sc/listforselect",
				}
			},
			schema : {
				total: "total",
				data: "data"
			}
		}
	});	

	$("#form-container-button button").click(function(){
		if(this.value == "cancel") {
			loadPage("purchaseBack");
		} else if(confirm("提交表单，确认？")){
			postAjaxRequest("/service/purchase/back/"+this.value, {models:kendo.stringify(currentObj)} , saveSuccess);
		}
	});

	$("#searchbt").click(function(){
		var vv = $("#searchfor").val();
		if(vv != ""){
			postAjaxRequest(baseUrl+"/purchase/back/prepare", {scId:vv}, editSuccess);
		}else{
			alert("请选择合同编号");
		}
	});	
	
	if(popupParams){
		$("#searchDiv").hide();
		postAjaxRequest(baseUrl+"/purchase/back/load", popupParams, editSuccess);
		disableAllInPoppup();
	}else if(redirectParams){
		$("#searchDiv").hide();
		postAjaxRequest(baseUrl+"/purchase/back/load", redirectParams, editSuccess);
	}
	kendo.bind($("#form-container"), currentObj);
});

function saveSuccess(){
	loadPage("purchaseBack");
}

function editSuccess(e){
	if(!e) return;
	if(e.pbStatus =="已提交") {
		$("#form-container :input").attr("disabled","disabled");
		$("#form-container-button button").attr("disabled","disabled");
	}
	currentObj = new myModel(e);
	currentObj.set("pbPlanDate", kendo.toString(currentObj.pbPlanDate, 'd'));
	kendo.bind($("#form-container"), currentObj);			
}