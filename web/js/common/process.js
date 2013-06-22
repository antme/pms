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
	}
}
function approveStatusCheck(response) {
	var kendoWindow = $("#approve").data("kendoWindow");
	kendoWindow.close();
	alert("操作成功");

	dataSource.read();
}

function approve() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "审批通过"){
			alert("此申请已审批通过，不需要再次审批");
		}else{
			process(approveUrl);
		}
	}
}

function cancel() {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		if(row.status == "已中止"){
			alert("此申请已中止，不需要再次中止");
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
		}else{
			process(rejectUrl);
		}
	}
	
}


