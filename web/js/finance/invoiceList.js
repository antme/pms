var scInvoiceModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		scInvoiceMoney:{},
		invoiceType:{},
		scId:{},
		scInvoiceDate:{}
	}
});
var im;

var invoiceDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/sc/invoice/list",
			dataType : "jsonp"
		},
		update : {
			url : "../service/sc/invoice/update",
			dataType : "jsonp",
			method : "post"
		},
		create : {
			url : "../service/sc/invoice/add",
			dataType : "jsonp",
			method : "post"
		}
	},
	parameterMap : function(options, operation) {
		if (operation !== "read" && options.models) {
			return {
				//options.models.set("cid":"aaaaaaaaaaaaaa");
				models : kendo.stringify(options.models)
			};
		}
	},
	pageSize: 10,
	batch : true,
	
	schema : {
		data:"data",
		total:"total",
		model : scInvoiceModel
	}
});

var contractItems = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/sc/list",
			dataType : "jsonp"
		}
	},
	schema: {
	    data: "data"
	}
});

$(document).ready(function() {
	
	$("#scId").kendoDropDownList({
		dataTextField : "contractCode",
		dataValueField : "_id",
        optionLabel: "选择合同...",
		dataSource : contractItems,
	});
	
	if (!$("#invoiceGrid").data("kendoGrid")){
		$("#invoiceGrid").kendoGrid({
			dataSource : invoiceDataSource,
			pageable : {
				buttonCount:5,
				//input:true,
				//pageSizes:true
			},
			editable : "popup",
			toolbar : [ {
				template : kendo.template($("#tool-bar-template").html())
			} ],
			columns : [ {
				field : "scInvoiceMoney",
				title : "开票金额"
			}, {
				field : "invoiceType",
				title : "开票类型"
			}, {
				field : "scInvoiceDate",
				title : "开票日期"
			}],
			scrollable : true,
			sortable : true
		});
	}
});

function selectASC(){
	var sc = $("#scId").data("kendoDropDownList");
	scid = sc.value();
	if(scid != ""){
		postAjaxRequest("../service/sc/invoice/list", {scId:scid}, initialGrid);
	}else{
		alert("请选择合同");
		return;
	}
}

function initialGrid(data){
	invoiceDataSource.data(data.data);
}

function toolbar_addInvoice(){
	var scid = $("#scId").val();
	if (scid==""){
		alert("请选择合同！");
		return;
	}
	im = new scInvoiceModel();
	kendo.bind($("#invoice-edit"), im);
	var options = {id:"invoice-edit", width:"450px", height: "300px", title:"新开票"};
	$("#scInvoiceMoney").kendoNumericTextBox({
		min:0
	});//发票类型
	var invoiceTypeItems = [{ text: "增值税专用", value: 1 }, { text: "增值税普通", value: 2 }, { text: "建筑业发票", value: 3 }, { text: "服务业发票", value: 4 }];
	$("#addInvoiceType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "value",
        optionLabel: "选择发票类型...",
		dataSource : invoiceTypeItems,
	});
	openWindow(options);
}

function saveInvoice(){
	im.set("scId", $("#scId").val());
	invoiceDataSource.add(im);
	invoiceDataSource.sync();
	var window = $("#invoice-edit");

	if (window.data("kendoWindow")) {
		window.data("kendoWindow").close();
	}
	
	var grid = $("#invoiceGrid");
	if (grid.data("kendoGrid")) {
		grid.data("kendoGrid").refresh();
	}
}

function closeWindow(windowId){
	var window = $("#"+windowId);

	if (window.data("kendoWindow")) {
		window.data("kendoWindow").close();
	}
}
