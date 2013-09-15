var groupId;

var dataSource = new kendo.data.DataSource({
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
        parameterMap: function(options, operation) {
            if (operation !== "read" && options.models) {
                return {
                	models: kendo.stringify(options.models),
    				mycallback : "myreflush"    	
                };
            } else if(operation === "read"){
            	return {
            		page : options.page,
            		pageSize : options.pageSize,
            		skip : options.skip,
            		take : options.take
            	}
             }
        }
	},
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
		},
		total: "total", // total is returned in the "total" field of the response
		data: "data"
	},
	pageSize: 10,
	serverPaging: true,
	serverSorting: true,
	serverFiltering : true,
	batch : true
});
$(document).ready(function() {

	$("#group-role-select").kendoMultiSelect({
		dataTextField : "description",
		dataValueField : "_id",
		placeholder : "选择权限...",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/user/role/list"
				}
			},
			schema : {
				total: "total", // total is returned in the "total" field of the response
				data: "data"
			}
		},
		height : 300
	});

	
	$("#group-grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		resizable: true,
		editable : "popup",
		height : "450px",
		toolbar : [ {
			name : "create",
			text : "创建角色"
		} ],
		columns : [ {
			field : "_id",
			title : "ID",
			hidden : true,
			editHidden : true
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
			editHidden : true

		}, {
			command : [{name : "edit",text : "编辑"}, {name : "destroy",text : "删除"} ],
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

	$("#group-role").hide();

});

function onActivate(e) {
	var multiselect = $("#group-role-select").data("kendoMultiSelect");
	var data = dataSource.data();
	var length = data.length;
	multiselect.value([]);
	var roles;
	for (i = 0; i < length; i++) {
		if (data[i].id == groupId) {
			var up = data[i];
			roles = up.roles;
			if (roles) {
				var upRoles = [];
				for (j = 0; j < roles.length; j++) {
					upRoles[j] = roles[j];
				}
				multiselect.value(upRoles);
			}
			break;

		}
	}
}

function openGroupRoleWindow(id) {
	groupId = id;
	var options = {
		id : "group-role",
		width : "415px",
		height : "500px",
		title : "选择权限",
		activate : onActivate
	};
	openWindow(options);
}
function myreflush(){
	loadPage("user_group");
}