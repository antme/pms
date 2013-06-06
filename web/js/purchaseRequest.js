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
		}
	}
});
//------end-------


$(document).ready(function () {
	
    var listDatasource = new kendo.data.DataSource({
        transport: {
            read:  {
                url: baseUrl + "/list",
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
    
	$("#grid").kendoGrid({
	    dataSource: listDatasource,
	    pageable: true,
	    toolbar: kendo.template($("#template").html()),
	    columns: [
	        { field: "code", title: "编号" },
	        { field: "type", title:"类型" },
	        { field: "projectContractCode", title:"销售合同编号" },
	        { field: "purchaseOrderCode", title:"采购订单编号" },
	        { field: "purchaseContractCode", title:"采购合同编号" },
	        { field: "customerName", title:"客户名" },
	        { field: "projectManager", title:"PM" },
	        { field: "status", title:"申请状态" },
	        { field: "approvedDate", title:"批准时间" },
	        { field: "cost", title:"金额" },
	        { field: "countUsedRquest", title:"申请单数量" },
	        { field: "percentUsedGoods", title:"成功申请请货物%" },
	        { field: "costUsedGoods", title:"成功申请货物金额" },
	        { command: [{name: "destroy", text: "删除"}], title: "&nbsp;" }
	    ],
	    editable: "popup"
	});

	$("#popRequest").kendoWindow({
	    actions: ["Maximize", "Close"],
	    width : "900px",
		height : "500px",	    
	    title: "采购申请单"
	});
	
	$("#showRequestForm").click(function(){
		$("#popRequest").data("kendoWindow").center().open();
	});

	//--------------------------
	
	$("#approveRequest").click(function(){
		alert("功能正在开发中...");
	});
	
	showAddForm();
});


function showAddForm(){
	$("#tabstrip").kendoTabStrip({
        animation:  {
            open: {
                effects: "fadeIn"
            }
        }
    });
	
    var itemForm = kendo.observable({
        itemSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: baseUrl + "/prepare",
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
                        	projectCode : $("#searchFor").val()
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
            //location.reload();
        },
        reset: function(){
        	this.set("selectedItem",this.itemSource.view()[0]);
        },
        searchItem: function(){
        	this.itemSource.read();
        }
    });
    //-----------------
    
    itemForm.itemSource.read();
    kendo.bind($("#form-container"), itemForm);
    
	
}
