$(document).ready(function() {
	
    $("#scFile").kendoUpload({
        async: {
            saveUrl: "/service/sc/importsc",
            autoUpload: true
        },
        success:function(e){
        	if (e.response.status == 1){//import success
        		$("#importStatus").html("数据导入成功！");
        	}else{
        		alert(e.response.msg);
        	}
        }
    });	
    
    
    $("#pcFile").kendoUpload({
        async: {
            saveUrl: "/service/purcontract/importpc",
            autoUpload: true
        },
        success:function(e){
        	if (e.response.status == 1){//import success
        		$("#importStatusPc").html("数据导入成功！");
        	}else{
        		alert(e.response.msg);
        	}
        }
    });	
    
    
    $("#eqFile").kendoUpload({
        async: {
            saveUrl: "/service/sc/importeq",
            autoUpload: true
        },
        upload: onUpload,
        success:function(e){
        	if (e.response.status == 1){//import success
        		$("#importStatusEq").html("数据导入成功！");
        	}else{
        		alert(e.response.msg);
        	}
        }
    });	
    
	
});//end dom ready	


function onUpload(e) {
    e.data = {
        scCode: $("#sccode").val()
    };
}