$(document).ready(function() {
	
    $("#scFile").kendoUpload({
        async: {
//            saveUrl: "/service/sc/importsc",
        	saveUrl: "/service/sc/importsc2",
            autoUpload: true
        },
        success:function(e){
        	if (!e.response.msg){//import success
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
        	if (e.response.status == 1 || e.response.status == "1"){//import success
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
        	if (e.response && (e.response.status === 0 || e.response.status == "0")){//import success
        		
        		alert(e.response.msg);
        	}else{
        		$("#importStatusEq").html("数据导入成功！");
        	}
        }
    });	
    
    
    $("#shipFile").kendoUpload({
        async: {
            saveUrl: "/service/ship/importship",
            autoUpload: true
        },
        upload: onUpload,
        success:function(e){
        	if (e.response && (e.response.status === 0 || e.response.status == "0")){//import success
        		
        		alert(e.response.msg);
        	}else{
        		$("#importStatusShip").html("数据导入成功！");
        	}
        }
    });	
    
    
    $("#finaceFile").kendoUpload({
        async: {
//            saveUrl: "/service/sc/importsc",
        	saveUrl: "/service/sc/importfinance",
            autoUpload: true
        },
        success:function(e){
        	if (!e.response.msg){//import success
        		$("#importFinanceStatus").html("数据导入成功！");
        	}else{
        		alert(e.response.msg);
        	}
        }
    });	
    
	
});//end dom ready	

function clearEqCost(){
	postAjaxRequest("/service/sc/clear", redirectParams, function(data){
		alert("清除成功，可以导数据了");
	});
}

function onUpload(e) {
    e.data = {
//        scCode: $("#sccode").val()
    };
}