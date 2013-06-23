intSelectInput();
$(document).ready(function () {
	var baseUrl = "../../service/purchase/back";
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
            eqcostAmount: {
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
	
	$("#subGrid").kendoGrid({
		dataSource: {
			schema: {
				model: subModel
			},
			aggregate: [ 
			    { field: "eqcostNo", aggregate: "count" },
			    { field: "pbTotalCount", aggregate: "sum" },
			    { field: "eqcostLeftAmount", aggregate: "sum" },
			    { field: "eqcostAmount", aggregate: "sum" }
			]			
		},
	    columns: [
			{ field: "eqcostNo", title: "序号" ,footerTemplate: "总共: #=count#"},
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号" },
			{ field: "eqcostUnit", title: "单位" },
			{ field: "pbTotalCount", title: "本次申请数量", attributes: { "style": "color:red"}, footerTemplate: "总共: #=sum#"},
			{ field: "eqcostLeftAmount", title: "可申请数量",footerTemplate: "总共: #=sum#"},
			{ field: "eqcostAmount", title: "总数" ,footerTemplate: "总共: #=sum#"},
			{ field: "eqcostBasePrice", title: "预估单价" },
			{ field: "eqcostBrand", title: "品牌" },
			{ field: "eqcostMemo", title: "备注" }
	  	],	 
	  	editable:true,
	  	toolbar: [{text:"保存",name:"save"}]
	});

	$("#searchfor").kendoDropDownList({
		dataTextField : "contractCode",
		dataValueField : "_id",
		template:  '${ data.projectName }:<strong>${ data.contractCode }</strong>',
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/sc/listforselect",
				}
			},
			schema : {
				total: "total",
				data: "data"
			}
		}
	});	
	
	
	$("#pbDepartment").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "text",
		dataSource : departmentItems
	});
	
	$("#pbPlanDate").kendoDatePicker();
	
	$(".submitform").click(function(){
		if(confirm(this.value + "表单，确认？")){
			if(this.value == "保存"){
				postAjaxRequest( baseUrl+"/save", {models:kendo.stringify(currentObj)} , saveSuccess);
			} else if(this.value == "提交"){
				postAjaxRequest( baseUrl+"/submit", {models:kendo.stringify(currentObj)} , saveSuccess);
			}else if(this.value=="取消"){
				location.reload();
			}
		}
	});

	$("#searchbt").click(function(){
		var vv = $("#searchfor").val();
		if(vv != ""){
			postAjaxRequest(baseUrl+"/prepare", {scId:vv}, edit);
		}else{
			alert("请选择合同编号");
		}
	});	
	
	function edit(e){
		if(e){
			if(e.pbStatus == "已提交"){
				$(".foredit").attr("disabled","disabled");
				$(".foreditbt").hide();
			}
		}
		currentObj = new myModel(e);
		kendo.bind($("#form-container"), currentObj);
	}
	
	if(popupParams){
		postAjaxRequest(baseUrl+"/load", popupParams, edit);
		disableAllInPoppup();
	}else if(redirectParams){
		var backId = redirectParams._id;
		var saleId = redirectParams.salesContract_id;
		$("#searchDiv").hide();
		if(backId) {
			postAjaxRequest(baseUrl+"/load", {_id:backId}, edit);
		}else if(saleId){
			postAjaxRequest(baseUrl+"/prepare", {scId:saleId}, edit);
		}
	}
	kendo.bind($("#form-container"), currentObj);
});

function saveSuccess(){
	location.reload();
}
