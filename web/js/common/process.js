function process(url) {
	var row = getSelectedRowDataByGridWithMsg("grid");
	if (row) {
		var param = {
			"_id" : row._id
		};
		postAjaxRequest(url, param, approveStatusCheck);
	}
}

function approveStatusCheck(response) {
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

