var baseUrl = "../../service/purcontract";
var requestModel;
var listDatasource;
$(document).ready(function () {	
	
	requestModel = kendo.data.Model.define({
		id : "_id",
		fields : {
			_id : {
				editable : false,
				nullable : true
			},
			payMoney:{
				type: "number"
			},
			payDate:{
				type:"date"
			},
			pcId:{},
			pcCode:{},
			supplierName:{},
			supplierCard:{}
		}
	});

	listDatasource = new kendo.data.DataSource({
	    transport: {
	        read:  {
	            url: baseUrl + "/paymoneylist",
	            dataType: "jsonp",
	            type : "post"
	        },
			update : {
				url : "/paymoney/update",
				dataType : "jsonp",
				method : "post"
			},
			create : {
				url : "/paymoney/add",
				dataType : "jsonp",
				method : "post"
			},
	        parameterMap: function(options, operation) {
	        	if (operation === "read" && $("selectvalue").val() != "") {
	        		return {pcId: $("selectvalue").val()};	
	            } else if (operation !== "read" && options.models) {
	                return {models: kendo.stringify(options.models)};
	            }
	        }
	    },
	    batch: true,
	    pageSize: 10,
	    schema: {
	        model: requestModel
	    }
	});	

	$("#searchfor").kendoDropDownList({
		dataTextField : "purchaseContractCode",
		dataValueField : "_id",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : baseUrl + "/list",
				}
			}
		}
	});		

	$("#searchbt").click(function(){
		var vv = $("#searchfor").val();
		if(vv != ""){
			listDatasource.read();
		}else{
			alert("请选择合同编号");
		}
	});	
	
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    selectable : "row",
	    //toolbar: kendo.template($("#template").html()),
	    toolbar: ["create"],
	    columns: [
	        {field:"payMoney", title:"付款金额"},
	        {field:"payDate", title:"付款日期"},
	        {field:"pcCode", title:"采购合同编号"},
	        {field:"supplierName", title:"供应商"},
	        {field:"supplierCard", title:"供应商卡号"}
	    ]
	});
	
});
