var scProgressPaymentDatasource = new kendo.data.DataSource({
	
	schema : {
		model : {
            fields: {
            	progressPaymentNo: { type: "string" },
            	progressPaymentAmount: { type: "number" },
            	progressPaymentMemo: { type: "string" }
            }
        }
	}
});