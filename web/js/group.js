var groupId;
var dataSource;
$(document).ready(function() {
	dataSource = new kendo.data.DataSource({
		transport : {
			read : {
				url : "../service/user/group/list",
				dataType : "jsonp"
			},
			update : {
				url : "../service/user/group/update",
				dataType : "jsonp",
				type : "post"
			},
			create : {
				url : "../service/user/group/add",
				dataType : "jsonp",
				type : "post"
			},

			destroy : {
				url : "../service/user/group/delete",
				dataType : "jsonp",
				type : "post"
			},

			parameterMap : function(options, operation) {
				if (operation !== "read" && options.models) {
					return {
						models : kendo.stringify(options.models)
					};
				}
			},
		},
		pageSize : 10,
		batch : true,
		schema : {
			model : {
				id : "_id",
				fields : {
					description : {
						validation : {
							required : true
						}
					},
					groupName : {
						validation : {
							required : true
						}
					}
				}
			}

		}
	});

	$("#group-grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		editable : "popup",
		toolbar : [  {
			name : "create",
			text : "创建角色"
		} ],
		columns : [ {
			field : "_id",
			title : "ID",
			hidden : true,
			editHidden: true
		}, {
			field : "groupName",
			title : "角色名"
		}, {
			field : "description",
			title : "描述"
		}, {
			field : "roles",
			title : "权限",
			template : kendo.template($("#roleTemplate").html()),
			editHidden: true

		}, {
			command : [ "edit", {
				name : "destroy",
				title : "删除",
				text : "删除"
			} ],
			title : "&nbsp;",
			width : "160px"
		} ]

	});

	$("#role-save").click(function() {
		var multiselect = $("#group-role-select").data("kendoMultiSelect");
		// get the value of the multiselect.
		var value = multiselect.value();
		var data = dataSource.data();
		var length = data.length;
		for (i = 0; i < length; i++) {
			if (data[i]._id == groupId) {
				var up = dataSource.at(i);
				up.set("roles", value);
				break;
			}
		}

		dataSource.sync();
	});

	$("#group-role-select").kendoMultiSelect({
		dataTextField : "description",
		dataValueField : "_id",
		placeholder : "选择权限...",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/user/role/list",
				}
			}
		},
		height : 300
	});

	$("#group-role").hide();

});

function onActivate(e) {
	var multiselect = $("#group-role-select").data("kendoMultiSelect");
	var data = dataSource.data();
	var length = data.length;
	multiselect.value([]);
	console.log(groupId);
	var roles;
	for (i = 0; i < length; i++) {
		console.log(data[i].id + "===" + groupId);
		if (data[i].id == groupId) {
			var up = data[i];
			roles = up.roles;
			console.log(roles);
			if (roles) {
				var upRoles = [];
				for (j = 0; j < roles.length; j++) {
					upRoles[j] = roles[j];
				}
				console.log(upRoles);
				multiselect.value(upRoles);
			}
			break;

		}
	}
}


function openGroupRoleWindow(id) {
	groupId = id;
	$("#group-role").show();
	var window = $("#group-role");
	if (!window.data("kendoWindow")) {
		window.kendoWindow({
			width : "315px",
			height : "200px",
			title : "选择权限",
			modal : true,
			activate : onActivate
		});
		window.data("kendoWindow").center();
	} else {
		window.data("kendoWindow").open();
		window.data("kendoWindow").center();
	}

}