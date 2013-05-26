$(document).ready(function() {
	var validator = $("#form-login").kendoValidator().data("kendoValidator");

	$("#login-button").click(function() {
		if (validator.validate()) {
			$.ajax({
				url : "../service/user/login",
				success : function(responsetxt) {
					var res;
					eval("res=" + responsetxt);
					if (res.status == "0") {
						$("#error").html(res.msg);
					} else {
						isLogin = true;
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
	});

	$("#logout-button").click(function() {
		$.ajax({
			url : "../service/user/logout",
			success : function(responsetxt) {
				window.location = "index.html";
			}
		});

	});

});