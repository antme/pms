var requestDataItem;


var contractModel = kendo.data.Model.define({
	id : "_id",
	fields : {
		salesContractCode : {
			editable : false
		},
		
		supplierName : {
			validation : {
				required : true
			}
		},
		purchaseContractType : {
			defaultValue : "代理产品"
		},
		
	
		contractProperty: {
			defaultValue: "闭口合同"
		},
		
		invoiceType: {
			defaultValue: "增值税专用"
		},
		supplierNameContact : {

		},
		
		signDate:{
			type:"date"
		},
		firstPay : {

		},
		eqcostApplyAmount : {
			editable : false
		},
		eqcostProductUnitPrice : {
			editable : false
		},
		eqcostBrand : {
			editable : false
		},
		purchaseOrderCode : {
			editable : false
		},
		eqcostList: {},
		eqcostNo : {
			editable : false
		},
		eqcostMaterialCode : {
			editable : false
		},
		eqcostProductType : {
			editable : false
		},
		eqcostAvailableAmount : {
			editable : false
		},
		eqcostUnit : {
			editable : false
		},
		eqcostProductName : {
			editable : false
		},
		contractExecuteCate : {
			
		}
	}
});


var orderDataSource = new kendo.data.DataSource({
	
});

function updateOrder(data) {
	var value = $("#eqcostDeliveryType").data("kendoDropDownList").value();
	if (value == "入公司库") {
		$("#executeStatus").kendoDropDownList({
			dataTextField : "text",
			dataValueField : "text",
			dataSource : executeType2
		});

		orderDataSource.data(data.repository);
		
		var purchasecontractin = $("#purchasecontractin").data("kendoMultiSelect");
		purchasecontractin.value([]);
		
	} else {
		$("#executeStatus").kendoDropDownList({
			dataTextField : "text",
			dataValueField : "text",
			dataSource : executeType1
		});
		
		
		orderDataSource.data(data.directly);
		
		var purchasecontractin = $("#purchasecontractin").data("kendoMultiSelect");
		purchasecontractin.value([]);
		
	}
}


$(document).ready(function() {
	$("#tabstrip").kendoTabStrip({
		animation : {
			open : {
				effects : "fadeIn"
			}
		},
		activate : function(e){
			if(e.item.id =="merged-select"){			
				initMergedGrid();

			}
		}
		
	});	


	$("#purchaseContractType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "text",
		dataSource : purchaseContractType
	});
	
	$("#supplier").kendoDropDownList({
		dataTextField : "supplierName",
		dataValueField : "_id",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/suppliers/list"
				}
			},
			schema : {
				total: "total", // total is returned in the "total" field of the response
				data: "data"
			}
		}
	});
	

	
	$("#executeStatus").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "text",
		dataSource : executeType1
	});
		
	$("#signDate").kendoDatePicker({
	    format: "yyyy/MM/dd",
	    parseFormats: ["yyyy/MM/dd"]
	});

	if(popupParams){
		$("#purchasecontract-edit-item").show();
		postAjaxRequest("/service/purcontract/get", popupParams, edit);
		disableAllInPoppup();
	}else if (redirectParams) {
		$("#purchasecontract-edit-item").show();
		postAjaxRequest("/service/purcontract/get", redirectParams, edit);
	} else{

		postAjaxRequest("/service/purcontract/order/select", null, addOrder);

		$("#purchasecontract-edit-header").show();
		$("#purchasecontract-edit-item").hide();
	}
	
});

function addOrder(data){

	
	$("#purchasecontractin").kendoMultiSelect({
		dataTextField : "purchaseOrderCode",
		dataValueField : "_id",
		placeholder : "选择采购订单...",
		dataSource : orderDataSource
	});
	
	$("#eqcostDeliveryType").kendoDropDownList({
		dataTextField : "text",
		dataValueField : "text",
		dataSource : eqcostDeliveryType,
		change : function(e) {
			updateOrder(data);
		},
		dataBound : function(e){		
			updateOrder(data);
		}
	});
	

}

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
					models: kendo.stringify(requestDataItem),
					mycallback : "checkStatus"
				};
			}
		}
	},
	schema : {
		model : contractModel
	},
	batch : true,
	group: { field: "purchaseOrderCode" }
});


var itemListDataSource = new kendo.data.DataSource({
	data: []
});

function save(status) {
	var validator = $("#purchasecontract-edit-item").kendoValidator().data("kendoValidator");
	if (validator.validate()) {

		if (!itemDataSource.at(0)) {
			alert("没有任何设备清单数据");
		} else {
			if (!requestDataItem.status) {
				requestDataItem.status = "草稿";
			}
			if (status) {
				requestDataItem.status = status;
			}
			requestDataItem.requestedTotalMoney = $("#requestedTotalMoney").val();
			

			if (itemDataSource.at(0)) {
				// force set haschanges = true
				itemDataSource.at(0).set("uid", kendo.guid());
			}

			if (!requestDataItem.supplier) {
				var dl = $("#supplier").data("kendoDropDownList");
				requestDataItem.supplier = dl.dataSource.at(0)._id;
			}else if(requestDataItem.supplier._id){
				requestDataItem.supplier = requestDataItem.supplier._id;
			}
			
			if(requestDataItem.executeStatus && requestDataItem.executeStatus.text){
				requestDataItem.executeStatus = requestDataItem.executeStatus.text;
			}
			

			// 同步数据
			itemDataSource.sync();
		}
	}

}

function checkStatus() {
	loadPage("purchasecontract", null);
}
// 计算成

function showOrderWindow() {
	// 如果用户用默认的采购申请，select event不会触发， 需要初始化数据
	var kendoGrid = $("#purchasecontractin").data("kendoMultiSelect");
	var dataItems = kendoGrid.dataSource.data();
	
	if(dataItems.length==0){
		alert("没有相关订单");
	}else{
		itemListDataSource.data([]);
		itemDataSource.data([]);
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
							eqcostList[listIndex].projectId = dataItems[index].projectId;
							eqcostList[listIndex].salesContractId = dataItems[index].salesContractId;
							eqcostList[listIndex].salesContractCode = dataItems[index].salesContractCode;
							eqcostList[listIndex].purchaseOrderId = dataItems[index]._id;
							eqcostList[listIndex].purchaseOrderCode = dataItems[index].purchaseOrderCode;
							eqcostList[listIndex].purchaseRequestId = dataItems[index].purchaseRequestId;
							eqcostList[listIndex].purchaseRequestCode = dataItems[index].purchaseRequestCode;
							
							itemListDataSource.add(eqcostList[listIndex]);
						}
					}
					break;
				}
			}
			
		}
		
		requestDataItem = new contractModel({});
		requestDataItem.eqcostList = itemListDataSource.data();
		
		requestDataItem.eqcostDeliveryType = $("#eqcostDeliveryType").data("kendoDropDownList").value();
		edit();
	}
}


function edit(data) {

	if(data){
		$("#purchasecontractselect").hide();
		requestDataItem = data;
	}else{
		$("#purchasecontractselect").show();
	}

	if (requestDataItem) {
		requestDataItem = new contractModel(requestDataItem);
	}
	
	if(requestDataItem.executeStatus && requestDataItem.executeStatus.text){
		requestDataItem.executeStatus = requestDataItem.executeStatus.text;
	}
	

	setDate(requestDataItem, "signDate", requestDataItem.signDate);
	
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


	if (!$("#purchasecontract-edit-grid").data("kendoGrid")) {
		$("#purchasecontract-edit-grid").kendoGrid({
			dataSource : itemDataSource,
			 groupable: {
				    messages: {
				      empty: "拖动订单编号到此可以分组操作"
				    }
			 },
			columns : [ {
				field : "eqcostNo",
				title : "序号"
			}, {
				field : "eqcostMaterialCode",
				title : "物料代码"
			}, {
				field : "eqcostProductName",
				title : "名称"
			}, {
				field : "eqcostProductType",
				title : "型号"
			}, {
				field : "eqcostUnit",
				title : "单位"
			}, 					
			{ field: "eqcostSalesBasePrice", title : "销售单价"}, 
			{ field: "eqcostDiscountRate",title : "折扣率"},
			{ field: "eqcostLastBasePrice",title : "最终成本价"},
			{
				field : "eqcostApplyAmount",
				title : "订单数量"
			}, {
				field : "eqcostProductUnitPrice",
				title : "单价"
			}, {
				field : "requestedTotalMoney",
				title : "总价"
			},{
				field : "eqcostBrand",
				title : "品牌"
			}, {
				field : "remark",
				title : "备注"
			}, {
				field : "salesContractCode",
				title : "销售合同编号"
			},{
				field : "purchaseOrderCode",
				title : "订单编号"
			},{
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
			width : "800px",
			save : sumOrders,
			dataBound : function(e) {
				var data = itemDataSource.data();			
				// 订单实际总价格
				var requestActureMoney = 0;
				var refresh = false;

				for (i = 0; i < data.length; i++) {
					var item = data[i];
					
					if (!item.eqcostProductUnitPrice) {
						item.eqcostProductUnitPrice = 0;
					}
					
					if (!item.eqcostApplyAmount) {
						item.eqcostApplyAmount = 0;
					}
					
					if (!item.requestedTotalMoney) {
						item.requestedTotalMoney = 0;
					}
					
					var requestedTotalMoney = item.requestedTotalMoney;
					requestActureMoney = requestActureMoney
							+ item.eqcostApplyAmount
							* item.eqcostProductUnitPrice;
					
					item.requestedTotalMoney = item.eqcostApplyAmount
							* item.eqcostProductUnitPrice;

					if ( requestedTotalMoney != item.requestedTotalMoney) {
						refresh = true;
					}
				}

				if (refresh) {
					var grid1 = $("#purchasecontract-edit-grid").data("kendoGrid");
					grid1.refresh();
				}else{

				}

				$("#requestedTotalMoney").val(requestActureMoney);
				
			}

		});
	}
	
}


var mergedDataSource = new kendo.data.DataSource({
	 data : []
});

function initMergedGrid(){
	mergedDataSource.data([]);
	var itemData = requestDataItem.eqcostList;
	var data = eval(kendo.stringify(itemData));
	while(mergedDataSource.at(0)){
		mergedDataSource.remove(mergedDataSource.at(0));
	}
	
	for(i=0; i<data.length; i++){
		
		var find = false;
		var mdata = mergedDataSource.data();
		for(j=0; j<mdata.length; j++){	
			if(mdata[j].eqcostNo == data[i].eqcostNo && mdata[j].eqcostProductName == data[i].eqcostProductName
					&& mdata[j].eqcostMaterialCode == data[i].eqcostMaterialCode
					&& mdata[j].eqcostProductType == data[i].eqcostProductType
					&& mdata[j].eqcostUnit == data[i].eqcostUnit && mdata[j].eqcostProductUnitPrice == data[i].eqcostProductUnitPrice
					&& mdata[j].eqcostBrand == data[i].eqcostBrand)
			{				
				if(!mdata[j].items){
					mdata[j].items = new Array();
				}
				mdata[j].items.push(data[i]);
				find =true;
				break;
			}
		}
		
		if(!find){
			mergedDataSource.add(data[i]);
		}
	}

	
	if (!$("#merged-grid").data("kendoGrid")) {
		$("#merged-grid").kendoGrid({
			dataSource : mergedDataSource,
			columns : [ {
				field : "eqcostNo",
				title : "序号"
			}, {
				field : "eqcostMaterialCode",
				title : "物料代码"
			}, {
				field : "eqcostProductName",
				title : "名称"
			}, {
				field : "eqcostProductType",
				title : "型号"
			}, {
				field : "eqcostUnit",
				title : "单位"
			}, {
				field : "eqcostProductUnitPrice",
				title : "单价"
			},{
				field : "eqcostBrand",
				title : "品牌"
			}],
			dataBound: function() {
                 this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            detailInit: detailInit
			
		});
	}
	
}

function detailInit(e) {
	
	var subdata = new Array();
	var mdata = eval(kendo.stringify(mergedDataSource.data()));
	for(i=0; i<mdata.length; i++){
		if(mdata[i].eqcostNo == e.data.eqcostNo && mdata[i].eqcostProductName == e.data.eqcostProductName
				&& mdata[i].eqcostMaterialCode == e.data.eqcostMaterialCode
				&& mdata[i].eqcostProductType == e.data.eqcostProductType
				&& mdata[i].eqcostUnit == e.data.eqcostUnit && mdata[i].eqcostProductUnitPrice == e.data.eqcostProductUnitPrice
				&& mdata[i].eqcostBrand == e.data.eqcostBrand)
		{
			if(mdata[i].items){
				subdata = mdata[i].items;
				subdata.push(mdata[i]);
			}else{
				subdata.push(mdata[i]);
			}
			console.log(mdata[i]);

			break;
		}
		
	}

    $("<div/>").appendTo(e.detailCell).kendoGrid({
		dataSource : {
			data : subdata,
			aggregate : [ {
				field : "eqcostApplyAmount",
				aggregate : "sum"
			}, {
				field : "requestedTotalMoney",
				aggregate : "sum"
			} ]
		},
        scrollable: true,
        columns : [ {
			field : "eqcostApplyAmount",
			title : "订单数量",
			footerTemplate: "总数: #=sum#" 
		}, {
			field : "requestedTotalMoney",
			title : "总价",
			footerTemplate: "总价: #=sum#" 
		}, {
			field : "salesContractCode",
			title : "销售合同编号"
		},{
			field : "purchaseOrderCode",
			title : "订单编号"
		}, {
			field : "remark",
			title : "备注"
		}]
    });
}


function sumOrders(e) {

	var data = itemDataSource.data();
	requestDataItem.eqcostList = data;

	var eqcostApplyAmount = e.model.eqcostApplyAmount;
	var eqcostProductUnitPrice = e.model.eqcostProductUnitPrice;


	if (e.values.eqcostProductUnitPrice) {
		eqcostProductUnitPrice = e.values.eqcostProductUnitPrice
	}

	if (e.values.eqcostApplyAmount) {
		eqcostApplyAmount = e.values.eqcostApplyAmount
	}

	var grid1 = $("#purchasecontract-edit-grid").data("kendoGrid");
	// will trigger dataBound event
	e.model.set("requestedTotalMoney", eqcostProductUnitPrice * eqcostApplyAmount);

	grid1.refresh();

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
				autoBind : true,
				dataSource : data
			});
}
