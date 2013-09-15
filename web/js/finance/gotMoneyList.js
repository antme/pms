var scGotMoneyModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		scGotMoney:{},
		scId:{},
		scGotMoneyDate:{}
	}
});
var gmm;

var gotMoneyDataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/sc/gotmoney/list",
			dataType : "jsonp"
		},
		update : {
			url : "../service/sc/gotmoney/update",
			dataType : "jsonp",
			method : "post"
		},
		create : {
			url : "../service/sc/gotmoney/add",
			dataType : "jsonp",
			method : "post"
		}
	},
	parameterMap : function(options, operation) {
		if (operation !== "read" && options.models) {
			return {
				models : kendo.stringify(options.models)
			};
		}
	},
	pageSize: 10,
	batch : true,
	
	schema : {
		data:"data",
		total:"total",
		model : scGotMoneyModel
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
	
	if (!$("#gotMoneyGrid").data("kendoGrid")){
		$("#gotMoneyGrid").kendoGrid({
			dataSource : gotMoneyDataSource,
			editable : "popup",
			sortable : true,
			pageable : {
				buttonCount:5,
				//input:true,
				//pageSizes:true
			},
			toolbar : [ {
				template : kendo.template($("#tool-bar-template").html())
			} ],
			//toolbar : [ { name:"create",text:"新收款" } ],
			columns : [ {
				field : "scGotMoney",
				title : "收款金额"
			}, {
				field : "scGotMoneyDate",
				title : "收款日期"
			}],
			scrollable : true
		});
	}
});

function selectASC(){
	var scid = $("#scId").val();
	if(scid != ""){
		postAjaxRequest("../service/sc/gotmoney/list", {scId:scid}, initialGrid);
	}else{
		alert("请选择合同");
		return;
	}
}

function initialGrid(data){
	gotMoneyDataSource.data(data.data);
}

function toolbar_addGotMoney(){
	var scid = $("#scId").val();
	if (scid==""){
		alert("请选择合同！");
		return;
	}
	gmm = new scGotMoneyModel();
	kendo.bind($("#got-money-edit"), gmm);
	var options = {id:"got-money-edit", width:"450px", height: "300px", title:"新收款"};
	openWindow(options);
}

function saveGotMoney(){
	var scid = $("#scId").val();
	gmm.set("scId", scid);
	gotMoneyDataSource.add(gmm);
	gotMoneyDataSource.sync();
	var window = $("#got-money-edit");

	if (window.data("kendoWindow")) {
		window.data("kendoWindow").close();
	}
	
	var grid = $("#gotMoneyGrid");
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