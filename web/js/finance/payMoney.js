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
			purchaseContractId:{
				editable : false
			},
			purchaseContractCode:{
				editable : false
			},
			supplierId:{
				editable : false
			},
			supplierName:{
				editable : false
			},
			supplierCardName:{
				editable : false
			},
			supplierCardCode:{
				editable : false
			}
		}
	});

	listDatasource = new kendo.data.DataSource({
	    transport: {
	        read:  {
	            url: baseUrl + "/paymoney/list",
	            dataType: "jsonp",
	            type : "post"
	        },
			update : {
				url : baseUrl+"/paymoney/update",
				dataType : "jsonp",
				method : "post"
			},
			create : {
				url : baseUrl+"/paymoney/add",
				dataType : "jsonp",
				method : "post"
			},
	        parameterMap: function(options, operation) {
	        	if (operation !== "read" && options.models) {
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
    
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    selectable: "row",
	    toolbar: kendo.template($("#template").html()),
	    columns: [
	        {field:"payMoney", title:"付款金额"},
	        {field:"payDate", title:"付款日期"},
	        //{field: "purchaseContractCode", title:"采购合同编号"},
	        //{field:"supplierName", title:"供应商"},
	        {field:"supplierCardName", title:"开户行"},
	        {field:"supplierCardCode", title:"卡号"}
	    ]
	});
	
	
    $("#addwindow").kendoWindow({
        width: "500px",
        title: "付款"
    });
	$("#purchaseContractId").kendoDropDownList({
		dataTextField : "purchaseContractCode",
		dataValueField : "_id",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : baseUrl + "/listforselect/paymoney"
				}
			}
		}
	});
    
	var cardNameList = ["招商银行","交通银行","中国银行","中国工商银行","中国建设银行","广发银行","中信银行",
	                    "中国农业银行","平安银行","浦发银行","上海农商银行"];
	
	$("#supplierCardName").kendoAutoComplete({
        dataSource: cardNameList,
        placeholder: "选择银行"
    });
	 $("#payMoney").kendoNumericTextBox({
		 min: 0,
		 value:0
	 });
	$("#payDate").kendoDatePicker();
	$("#addform").click(function(){
		$("#addwindow").data("kendoWindow").open();
	});
	$("#submitform").click(function(){
		var obj = new requestModel();
		obj.payMoney = $("#payMoney").val();
		obj.payDate = $("#payDate").val();
		obj.purchaseContractId = $("#purchaseContractId").val();
		obj.supplierCardName = $("#supplierCardName").val();
		obj.supplierCardCode = $("#supplierCardCode").val();
		listDatasource.add(obj);
		listDatasource.sync();
		var window =  $("#addwindow");

		if (window.data("kendoWindow")) {
			window.data("kendoWindow").close();
		}
		
		var grid = $("#grid");
		if (grid.data("kendoGrid")) {
			grid.data("kendoGrid").refresh();
		}		
	});
});

