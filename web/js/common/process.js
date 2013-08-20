var processUrl = undefined;
function process(url) {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		$("#approve-comment").val("");
		$("#approve-comment").attr("disabled", false);
		processUrl = url;
		var options = {
			width : 500,
			height : 200,
			actions : [ "Maximize", "Close" ]
		};
		$("#approve-comment").val("");
		$("#approve").kendoWindow({
			width : options.width,
			height : options.height,
			title : options.title
		});

		kendoWindow = $("#approve").data("kendoWindow");
		kendoWindow.open();
		kendoWindow.center();
	}
}

function approveSubmit() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		var param = {
			"_id" : row._id,
			"approveComment" : $("#approve-comment").val()
		};
		postAjaxRequest(processUrl, param, approveStatusCheck);
		$("#approve-comment").val("");
	}
}
function approveStatusCheck(response) {
	var kendoWindow = $("#approve").data("kendoWindow");
	kendoWindow.close();
	alert("审核提交成功");

	listDataSource.read();
}

function approve() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "审批通过"){
			alert("此申请已审批通过，不需要再次审批");
		}else if(row.status == "已锁定"){
			alert("数据已锁定，不需要再次审批");
		}else{
			process(approveUrl);
		}
	}
}

function cancel() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "已废除"){
			alert("此申请已废除，不需要再次中止");
		}else if(row.status == "已锁定"){
			alert("数据已锁定，不能中止");
		}else{
			process(cancelUrl);
		}
	}
}

function reject() {
	
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "审批拒绝"){
			alert("此申请已审批拒绝，不需要再次拒绝");
		}else if(row.status == "已锁定"){
			alert("数据已锁定，不能拒绝");
		}else if(row.status == "审批通过"){
			alert("数据已审批通过，不能拒绝");
		}else{
			process(rejectUrl);
		}
	}
	
}


