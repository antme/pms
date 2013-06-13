var requestDataItem;

var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		purchaseOrderCode : {
			editable : false
		},
		logisticsArrivedTime : {
			type : "date"
		},
		supplierName : {
			validation : {
				required : true
			}
		},
		purchaseContractType : {
			defaultValue : "代理产品"
		},
		
		eqcostDeliveryType: {
			defaultValue : "直发现场"
		},
		
		contractProperty: {
			defaultValue: "闭口合同"
		},
		
		invoiceType: {
			defaultValue: "增值税专用"
		},
		supplierNameContact : {

		},
		firstPay : {

		},
		signDate : {
			type : "date"
		}
	}
});


$(document).ready(function() {
	$("#tabstrip").kendoTabStrip({
		animation : {
			open : {
				effects : "fadeIn"
			}
		}
	});
	
	if (!$("#purchasecontractin").data("kendoMultiSelect")) {
		$("#purchasecontractin").kendoMultiSelect({
			dataTextField : "purchaseOrderCode",
			dataValueField : "_id",
			placeholder : "选择采购订单...",
			dataSource : {
				transport : {
					read : {
						dataType : "jsonp",
						url : "/service/purcontract/order/list",
					}
				}
			}
		});
	}

	

	$("#supplierName").kendoDropDownList({
		dataTextField : "supplierName",
		dataValueField : "_id",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/suppliers/list"
				}
			}
		}
	});
	
	
	if (redirectParams) {
		postAjaxRequest("/service/purcontract/get", redirectParams, edit);
	} 
	
});



var itemDataSource = new kendo.data.DataSource({
	transport : {
		update : {
			url : "/service/purcontract/update",
			dataType : "jsonp",
			type : "post"
		},
		create : {
			url : "/service/purcontract/add",
			dataType : "jsonp",
			type : "post"
		},
		parameterMap : function(options, operation) {
			if (operation !== "read" && options.models) {
				return {

					// 解析成json_p模式
					json_p : kendo.stringify(requestDataItem),
					mycallback : "checkStatus"
				};
			}
		}
	},
	schema : {
		model : model
	},
	batch : true
});


var itemListDataSource = new kendo.data.DataSource({
	data: []
});

function save(status) {
	if(!requestDataItem.status){
		requestDataItem.status = "草稿";
	}
	if(status){
		requestDataItem.status = status;
	}
	
	if(itemDataSource.at(0)){
		//force set haschanges = true
		itemDataSource.at(0).set("uid", kendo.guid());
	}

	
	if(requestDataItem.supplierName && requestDataItem.supplierName._id){
		requestDataItem.supplierName = requestDataItem.supplierName._id
	}
	
	if(!requestDataItem.supplierName){
		var dl = $("#supplierName").data("kendoDropDownList");
		requestDataItem.supplierName = dl.dataSource.at(0)._id;
	}

	// 同步数据
	itemDataSource.sync();
	
	
}

function checkStatus() {
	loadPage("purchasecontract", null);
}
// 计算成

function showOrderWindow() {
	// 如果用户用默认的采购申请，select event不会触发， 需要初始化数据
	var kendoGrid = $("#purchasecontractin").data("kendoMultiSelect");

	var dataItems = kendoGrid.dataSource.data();
	var selectedValues = kendoGrid.value();
	for(id in selectedValues){	
		for(index in dataItems){			
			if(dataItems[index]._id == selectedValues[id]){
				var eqcostList = dataItems[index].eqcostList;
				for(listIndex in eqcostList){
					if(eqcostList[listIndex].uid){
						if(!eqcostList[listIndex].logisticsType ){
							eqcostList[listIndex].logisticsType="";
						}
						itemListDataSource.add(eqcostList[listIndex]);
					}
				}
				break;
			}
		}
		
	}
	
	requestDataItem = new model({});
	requestDataItem.eqcostList = itemListDataSource.data();
	
	
	
//	if (!requestDataItem) {
//		requestDataItem = kendoGrid.dataSource.at(0);
//	}
//	// 新增，所以设置_id为空
//	requestDataItem.set("_id", "");
	edit();
}

function edit(data) {

	// 初始化空对象
	var dataItem = new model();
	if(data){
		$("#purchasecontractselect").hide();
		requestDataItem = data;
	}else{
		$("#purchasecontractselect").show();
	}

	if (requestDataItem) {
		requestDataItem = new model(requestDataItem);

	}

	kendo.bind($("#purchasecontract-edit"), requestDataItem);

	
	var eqcostList = requestDataItem.eqcostList;
	
	if(eqcostList){
		for (i = 0; i < eqcostList.length; i++) {
			if (!eqcostList[i].logisticsType) {
				eqcostList[i].logisticsType = "";
			}
		}
	}
	// 渲染成本编辑列表
	itemDataSource.data(requestDataItem.eqcostList);


	$("#purchasecontract-edit-item").show();
	$("#purchasecontract-select").hide();

	$("#purchaseOrderCode").html(requestDataItem.purchaseOrderCode);
	$("#projectName").html(requestDataItem.projectName);
	$("#projectCode").html(requestDataItem.projectCode);
	$("#salesContractCode").html(requestDataItem.salesContractCode);
	$("#customerRequestContractId").html(requestDataItem.customerRequestContractId);

	$("#signDate").kendoDatePicker();

	if (!$("#purchasecontract-edit-grid").data("kendoGrid")) {
		$("#purchasecontract-edit-grid").kendoGrid({
			dataSource : itemDataSource,
			columns : [ {
				field : "eqcostNo",
				title : "货品编号",
				width : 80
			}, {
				field : "eqcostProductName",
				title : "货品名",
				width : 80
			}, {
				field : "eqcostProductCategory",
				title : "货品类别",
				width : 80
			}, {
				field : "eqcostProductType",
				title : "货品型号",
				width : 80

			}, {
				field : "eqcostProductUnitPrice",
				title : "单价",
				width : 50
			}, {
				field : "requestedTotalMoney",
				title : "小计金额",
				width : 80
			}, {
				field : "eqcostApplyAmount",
				title : "本次采购数量"
			}, {
				field : "logisticsStatus",
				title : "货品物流状态",
				width : 100
			}, {
				field : "logisticsType",
				title : "物流类型",
				width : "160px",
				editor : categoryDropDownEditor,
				template : "#=logisticsType#"
			}, {
				field : "logisticsArrivedTime",
				title : "货品预计到达时间"
			}, {
				command : [  {
					name : "destroy",
					title : "删除",
					text : "删除"
				} ],
				title : "&nbsp;",
				width : "160px"
			}],
			scrollable : true,
			editable : true,
			width : "800px"

		});
	}
}

function categoryDropDownEditor(container, options) {
	var data = [ {
		name : "直发"
	}, {
		name : "上海仓库"
	} ];

	$('<input required data-text-field="name" data-value-field="name" data-bind="value:'
					+ options.field + '"/>').appendTo(container)
			.kendoDropDownList({
				autoBind : false,
				dataSource : data
			});
}
