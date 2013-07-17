$(document).ready(function() {
	
    $("#scFile").kendoUpload({
        async: {
            saveUrl: "/service/sc/importsc",
            autoUpload: true
        },
        success:function(e){
        	if (e.response.status == 1){//import success
        		$("#importStatus").html("数据导入成功！");
        	}
        }
    });	
	
});//end dom ready	