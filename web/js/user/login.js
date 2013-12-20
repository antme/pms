var validator;
$(document).ready(function() {

	
	var userAgent = window.navigator.userAgent.toLowerCase();	
	if (userAgent.indexOf("msie 7.0")>0 || userAgent.indexOf("msie 6.0")>0) {
		$("#error").html("请采用IE8及以上的IE浏览器或则chrome【推荐】, firefox, safari等浏览器");
	}else{
		validator = $("#form-login").kendoValidator().data("kendoValidator");
	
		$("#login-button").click(function() {
			login();
		});
	
		$("#logout-button").click(function() {
			$.ajax({
				url : "../service/user/logout",
				success : function(responsetxt) {
					window.location = "index.html";
				}
			});
	
		});
		
		$("#userName").focus();
		$("#userName").keydown(function(event) {
			if(event.charCode == 13 || event.keyCode == 13){
				$("#userName").focus();
				login();
			}
			  
		});
		
		$("#password").keydown(function(event) {	
			if(event.charCode == 13 || event.keyCode == 13){
				$("#password").focus();
				login();
			}		  
		});
	}
	
});


function login(){
	if (validator.validate()) {
		$.ajax({
			url : "../service/user/login",
			success : function(responsetxt) {
				var res;
				eval("res=" + responsetxt);
				if (res.status == "0") {
					$("#error").html(res.msg);
				} else {
					window.location = "main.html";
				}
			},
			
			error : function(){
				$("#error").html("连接Service失败");
			},

			data : {
				userName : $("#userName").val(),
				password : $("#password").val()

			},
			method : "post"
		});
	}
};

function forceLogin(){
	window.location.href="index.html";
}