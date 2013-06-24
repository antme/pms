var editUrl;
var saveUrl;
var addUrl;
var listUrl;


//声明一个总的对象用来传递数据
var requestDataItem = undefined;

//编辑页面的model对象
//抽象model对象， datasource对象必须绑定一个model为了方便解析parameterMap中需要提交的参数
var model = kendo.data.Model.define({
	id : "_id",
	fields : {
		eqcostAvailableAmount : {
			type : "number"
		},

		eqcostApplyAmount : {
			validation : {
				min : 0
			},
			type : "number"
		},
		eqcostBasePrice : {
			type : "number",
			editable : false
		},
		eqcostRealAmount : {
			editable : false,
			type : "number"
		},
		eqcostProductUnitPrice : {
			type : "number"
		},
		requestedTotalMoney : {
			editable : false
		},
		eqcostContractTotalMoney : {
			type : "number",
			editable : false
		},
		differenceAmount : {
			type : "number",
			editable : false
		},
		eqcostProductName : {
			editable : false
		},
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
		orderEqcostName : {

		},
		orderEqcostModel : {

		},
		eqcostProductUnitPrice : {
			validation : {
				min : 0
			},
			type : "number"

		},
		comment : {

		}
	}
});


//保存操作
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
	

	console.log(requestDataItem);
	// 同步数据
	itemDataSource.sync();
}