var dataSource = new kendo.data.DataSource({
	transport : {
		read : {
			url : "../service/history/sc/amount",
			dataType : "jsonp"
		}
	},
	schema: {
	    data: "data"
	},

//	pageSize: 5,
//    serverPaging: true,
//	batch : true,
	
	parameterMap : function(options, operation) {
		if (operation !== "read" && options.models) {
			return {
				models : kendo.stringify(options.models)
			};
		}
	}
});

$(document).ready(function() {
	
	$("#contractAmountHistoryGrid").kendoGrid({
		dataSource : dataSource,
//		pageable : {
//			buttonCount:5,
//			//input:true,
//			//pageSizes:true
//		},
//		editable : "popup",
//		toolbar : [ { template: kendo.template($("#template").html()) } ],
//		selectable: "row",
        sortable: {
            mode: "multiple",
            allowUnsort: true
        },
		columns : [ {
			field : "oldValue",
			title : "修改前数据"
		},{
			field : "newValue",
			title : "修改后数据"
		}, {
			field : "time",
			title : "修改时间"
		}, {
			field : "operator",
			title : "修改人"
		}]
	});
//	if(popupParams){
//		postAjaxRequest("/service/sc/get", popupParams, edit);
//		//disableAllInPoppup();
//	}//else if (redirectParams) {//Edit
		//postAjaxRequest("/service/sc/get", redirectParams, edit);
	//}
});