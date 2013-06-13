$(document).ready(function () {
	var currentObj;
	var baseUrl = "../../service/purchase/allot";
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
            backTotalCount: {
            	editable : false
            },
            backUsedCount: {
            	type: "number",
           	 	validation: {
                    min: 0
                },
           }
		}
	});	
	var myModel = kendo.data.Model.define({
		id : "_id",
		fields : {
			department: {},
			submitDate: {},
			approveDate: {},
			planDate: {},
			type: {},
			status: {},
			specialRequire: {},
			comment: {},
			money: {},
			projectName: {},
			projectCode: {},
			projectManager: {},
			customer: {},
			salesContract_id:{},
			scontractCode: {},
			contractAmount: {},
			purchaseOrderCode: {},
			purchaseContractCode: {}
		}
	});
	
	$("#subGrid").kendoGrid({
		dataSource: {
			schema: {
				model: subModel
			},
			aggregate: [ 
			    { field: "eqcostNo", aggregate: "count" },
			    { field: "allotCount", aggregate: "sum" },
			    { field: "backTotalCount", aggregate: "sum" },
			]			
		},
	    columns: [
			{ field: "eqcostNo", title: "序号" ,footerTemplate: "总共: #=count#"},
			{ field: "eqcostMaterialCode", title: "物料代码" },
			{ field: "eqcostProductName", title: "产品名称" },
			{ field: "eqcostProductType", title: "规格型号" },
			{ field: "eqcostUnit", title: "单位" },
			{ field: "allotCount", title: "调拨数量", attributes: { "style": "color:red"}, footerTemplate: "总共: #=sum#"},
			{ field: "backTotalCount", title: "本次申请数量", footerTemplate: "总共: #=sum#"},
			{ field: "eqcostBasePrice", title: "预估单价￥" },
			{ field: "eqcostBrand", title: "品牌" },
			{ field: "eqcostMemo", title: "备注" }
	  	],	 
	  	editable:true,
	  	toolbar: [{text:"保存",name:"save"}]
	});

	$(".submitform").click(function(){
		if(confirm(this.value + "表单，确认？")){
			postAjaxRequest( baseUrl+"/submit", {models:kendo.stringify(currentObj)} , saveSuccess);
		}
	});
	function generateAllot() {
		var row = getSelectedRowDataByGrid("grid");
		if (!row) {
			alert("点击列表可以选中数据");
		} else {
			$.ajax({
				url : baseUrl+"/allot/prepare",
				success : function(responsetxt) {
					var res;
					eval("res=" + responsetxt);
					if (res.status == "0") {
						alert(res.msg);
					} else {
						alert("调拨申请成功");
					}
				}, error : function() {
					alert("连接Service失败");
				}, data : {
					_id : row._id
				},method : "post"
			});
		}
	}	
	function edit(e){
		currentObj = new myModel(e);
		kendo.bind($("#form-container"), currentObj);
	}
	
	function saveSuccess(){
		location.reload();
	}
	$(".foredit").attr("disabled","disabled");
	if(redirectParams){
		var backId = redirectParams.backId;
		var id = redirectParams._id;
		if(backId) {
			postAjaxRequest(baseUrl+"/prepare", {_id:backId}, edit);
		}else if(id) {
			postAjaxRequest(baseUrl+"/load", {_id:backId}, edit);
		}
	}
	
	
});


