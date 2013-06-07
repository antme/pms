var baseUrl = "../../service/purchase/request";

//global define: purchase request Object Model
var requestModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		_id : {
			editable : false,
			nullable : true
		},
		code:{},
		department:{},
		submitDate:{},
		planDate:{},
		type:{},
		status:{},
		specialRequire:{},
		comment:{},
		eqcostList:{},
		costUsedGoods: {},
		countUsedRquest: {},
		percentUsedGoods: {},
		costUsedGoods: {},		
		projectCode : {
			validation : {
				required : false,
				editable : false
			}
		},
		projectName : {
			validation : {
				required : false,
				editable : false
			}
		},
		projectManager : {
			validation : {
				required : false,
				editable : false
			}
		},
		customerName : {
			validation : {
				required : false,
				editable : false
			}
		},
		projectContractCode : {
			validation : {
				required : false,
				editable : false
			}
		},
		purchaseOrderCode: {}
	}
});
//------end-------
var listDatasource = new kendo.data.DataSource({
    transport: {
        read:  {
            url: baseUrl + "/list",
            dataType: "jsonp",
            type : "post"
        },
        update: {
            url: baseUrl + "/update",
            dataType: "jsonp",
            type : "post"
        },
        destroy: {
            url: baseUrl + "/destroy",
            dataType: "jsonp",
            type : "post"
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

//initial pop form
var itemForm = kendo.observable({
    itemSource: new kendo.data.DataSource({
        transport: {
            read: {
                url: baseUrl + "/load",
                dataType: "jsonp",
                method : "post"
            },
            update: {
                url: baseUrl + "/update",
                dataType: "jsonp",
                method : "post"
            },
            create: {
                url: baseUrl + "/create",
                dataType: "jsonp",
                method : "post"
            },
            parameterMap: function(options, operation) {
                if (operation === "read") {
                    return {
                    	projectCode : $("#searchFor").val(),
                    	_id : $("#searchId").val()
                    };
                } else if (operation !== "read" && options.models) {
                    return {
                        models: kendo.stringify(options.models)
                    };
                }
                return options;
            }
        },
        change: function() {
        	itemForm.reset();
        },
        batch: true,
        schema: {
            	model: requestModel
        }
    }),
    selectedItem: null,
    typeSource:["上海代理产品采购","同方自主产品采购","其它渠道采购"],
    todayDate: new Date(),
    save: function() {
        this.itemSource.sync();
    },
    reset: function(){
    	this.set("selectedItem",this.itemSource.view()[0]);
    },
    searchItem: function(){
    	this.itemSource.read();
    },
    clear: function(){
    	this.selectedItem = new requestModel();
    	//itemForm.selectedItem = new requestModel();
    }
});
//--------
$(document).ready(function () {
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    selectable : "row",
	    toolbar: kendo.template($("#template").html()),
	    columns: [
	        { field: "code", title: "申请编号" },
	        { field: "type", title:"采购类别" },
	        { field: "projectContractCode", title:"销售合同编号" },
	        { field: "purchaseOrderCode", title:"采购订单编号" },
	        { field: "purchaseContractCode", title:"采购合同编号" },
	        { field: "customerName", title:"客户名" },
	        { field: "projectManager", title:"PM" },
	        { field: "status", title:"申请状态" },
	        { field: "approvedDate", title:"批准时间" },
	        { field: "cost", title:"金额" },
	        { field: "countUsedRquest", title:"合同下申请单数量" },
	        { field: "percentUsedGoods", title:"合同下已成功申请请货物%" },
	        { field: "costUsedGoods", title:"合同下已成功申请货物金额%" },
	        { command: [{name: "destroy", text: "删除"}], title: "&nbsp;" }
	    ],
	    editable: "popup"
	});

	$("#popRequest").kendoWindow({
	    actions: ["Maximize", "Close"],
	    width : "900px",
		height : "500px",	    
	    title: "采购申请单",
	    close: function(){
	    	listDatasource.read();
	    	//location.reload();
	    }
	});
		
	$("#searchFor").kendoDropDownList({
		dataTextField : "projectName",
		dataValueField : "projectCode",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/project/listforselect",
				}
			}
		}
	});	
	    
    itemForm.selectedItem = new requestModel();
    kendo.bind($("#form-container"), itemForm);
	
	
});

function add(){
	//itemForm.clear();
	$("#popRequest").data("kendoWindow").open();
}
function edit(){
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {	
		$("#searchId").val(row._id);
	    itemForm.searchItem();
	    $("#popRequest").data("kendoWindow").open();		
	}

}
function approve() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		$.ajax({
			url : "/service/purchase/request/approve",
			success : function(responsetxt) {
				var res;
				eval("res=" + responsetxt);
				if (res.status == "0") {
					alert(res.msg);
				} else {
					alert("审核成功");
					listDatasource.read();
				}
			}, error : function() {
				alert("连接Service失败");
			}, data : {
				_id : row._id
			},method : "post"
		});
	}
}

function reject() {
	var row = getSelectedRowDataByGrid("grid");
	if (!row) {
		alert("点击列表可以选中数据");
	} else {
		$.ajax({
			url : "/service/purchase/request/reject",
			success : function(responsetxt) {
				var res;
				eval("res=" + responsetxt);
				if (res.status == "0") {
					alert(res.msg);
				} else {
					alert("拒绝成功");
					listDatasource.read();
				}
			}, error : function() {
				alert("连接Service失败");
			}, data : {
				_id : row._id
			}, method : "post"
		});
	}
}
