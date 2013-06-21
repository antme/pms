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
	process(approveUrl);
}

function cancel() {
	process(cancelUrl);
}

function reject() {
	process(rejectUrl);
}
