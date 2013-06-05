$(document).ready(function () {	
	initMainPage();
	
	initAddForm();

});

//初始化页面
function initMainPage(){
    var baseUrl = "../../service/purchase/request";
    var ds = new kendo.data.DataSource({
            transport: {
                read:  {
                    url: baseUrl + "/list",
                    dataType: "jsonp",
                    type : "post"
                },
                update:  {
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
            batch: false,
            pageSize: 10,
            schema: {
                model: {
                    id: "_id",
                    fields: {
                        _id: { editable: false, nullable: true },
                        code: { validation: { required: true } },
                        type: { validation: { required: true } },
                        customerContractCode : {},
                        purchaseOrderCode : {},
                        purchaseContractCode : {},
                        customerName : {},
                        projectManagerName : {},
                        status : {},
                        approvedDate : {},
                        money : {},
                        countOfOrder : {},
                        percentOfHasApplyGoods : {},
                        moneyOfHasApplyGoods : {}
                    }
                }
            }
    });
    $("#grid").kendoGrid({
        dataSource: ds,
        pageable: true,
        toolbar: kendo.template($("#purTemplate").html()),
        columns: [
            { field: "code", title: "编号" },
            { field: "type", title:"类型" },
            { field: "status", title:"申请状态" },
            { field: "projectManagerName", title:"PM" },
            { field: "approvedDate", title:"申请批准时间" },
            { field: "money", title:"金额" },
            { field: "customerName", title:"客户名" },
            { field: "customerContractCode", title:"客户合同编号" },
            { field: "purchaseOrderCode", title:"采购订单编号" },
            { field: "purchaseContractCode", title:"采购合同编号" },
            { field: "countOfOrder", title:"采购申请单数量" },
            { field: "percentOfHasApplyGoods", title:"已申请请货物%" },
            { field: "moneyOfHasApplyGoods", title:"已申请货物金额" },
            { command: [{text: "编辑",onclick:"editPerchaseRequest()"},{name: "destroy", text: "删除"}], title: "&nbsp;" }
        ],
        editable: "popup"
    });
    
	$("#popRequest").kendoWindow({
	    actions: ["Maximize", "Close"],
	    title: "采购申请单",
	    close: function() {
	    	//......
	    }
	});
	
    $("#bt_addPur").click(function(){
		$("#popRequest").data("kendoWindow").open();		
	});
    
}

//1. 初始化添加 申请框
function initAddForm(){
    var Node = kendo.data.Node;
    var viewModel = kendo.observable({
        purchaseContractList: [
              {name: "TDSH-XS-2012-0001" },
              {name: "TDSH-XS-2012-0002" },
              {name: "TDSH-XS-2012-0003" },
              {name: "TDSH-XS-2012-0004" }
        ],
    	typeValues: [
	           { name: "上海代理产品采购", value: "1" },
	           { name: "同方自主产品采购", value: "2" },
	           { name: "同方代理产品采购", value: "3" },
	           { name: "其它渠道采购", value: "4" }
        ],
        purchaseContractValue:"",
        L_purchaseContractCode: "",
        L_code: "",
        L_projectName: "",
        L_pm: "",
        L_customerName: "",
        L_type: "",
        L_requireDate: new Date(),
        gridSource: [],
        L_search: function(e) {
            e.preventDefault();
            var pcCode = this.get("purchaseContractValue");
            //$.post({});查询合同详情，在一一给控件赋值，如下
            this.set("L_purchaseContractCode", pcCode);
        },
        L_submit: function(e) {
            e.preventDefault();
            if(confirm("确认提交")){
            	//TODO:
            	location.reload();
            }
        }        
    });

    
}
function tab() {
    var tabs = "";

    for (var i = 0; i < stringify.level; i++) {
        tabs += "\t";
    }

    return tabs;
}

function stringify(items) {
    var item,
        itemString,
        levelString = "";

    for (var i = 0; i < items.length; i++) {
        item = items[i];

        if (!item.items) {
            itemString = kendo.stringify(item);
        } else {
            stringify.level++;
            var subnodes = stringify(item.items);
            stringify.level--;

            delete item.items;

            itemString = kendo.stringify(item);

            itemString = itemString.substring(0, itemString.length - 1);

            itemString += ",\"items\":[\r\n" + subnodes + tab() + "]}";
        }

        levelString += tab() + itemString;

        if (i != items.length - 1) {
            levelString += ",";
        }

        levelString += "\r\n";
    }

    return levelString;
}

stringify.level = 1;
