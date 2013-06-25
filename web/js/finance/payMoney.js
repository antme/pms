var requestModel = kendo.data.Model.define({
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
		purchaseContractId:{},
		purchaseContractCode:{},
		supplierId:{},
		supplierName:{},
		supplierCardName:{},
		supplierCardCode:{}
	}
});
var listDatasource = new kendo.data.DataSource({
    transport: {
        read:  {
            url: "/service/purcontract/paymoney/list",
            dataType: "jsonp",
            type : "post"
        }
    },
    batch: true,
    pageSize: 10,
	serverPaging: true,
	serverSorting: true,
	serverFiltering : true,
    schema: {
        model: requestModel,
        total: "total",
        data:"data"
    }
});
var currentObj = new requestModel();

$(document).ready(function () {	
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    selectable: "row",
	    toolbar: kendo.template($("#template").html()),
	    columns: [
	        {field:"payMoney", title:"付款金额"},
	        {field:"payDate", title:"付款日期",format: "{0:yyyy/MM/dd hh:mm}"},
	        {field:"purchaseContractCode", title:"采购合同编号"},
	        {field:"supplierName", title:"供应商"},
	        {field:"supplierCardName", title:"开户行"},
	        {field:"supplierCardCode", title:"卡号"}
	    ]
	});
    $("#popwindow").kendoWindow({
        width: "500px",
        title: "付款"
    });
	$("#showpopwindow").click(function(){
		$("#popwindow").data("kendoWindow").open();
	});
	
	var pcdatasource = new kendo.data.DataSource({
		transport : {
			read : {
				dataType : "jsonp",
				url : "/service/purcontract/listforselect/paymoney"
			}
		},
	    schema: {data:"data"}
	});	
	
	$("#selectpc").kendoDropDownList({
		optionLabel: "请选择合同",
		dataTextField : "purchaseContractCode",
		dataValueField : "_id",
		dataSource : pcdatasource,
	});
	$("#payDate").kendoDateTimePicker({
	    format: "yyyy/MM/dd hh:mm tt"
	});
	$("#submitform").click(function(){
		currentObj.purchaseContractId=$("#selectpc").val();
		postAjaxRequest("/service/purcontract/paymoney/add", {models:kendo.stringify(currentObj)}, saveSuccess);
	});

	kendo.bind($("#form-container"), currentObj);
});

function saveSuccess(){
	loadPage("payMoney");
}