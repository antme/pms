$(document).ready(function() {
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
					_id : {
						editable : false,
						nullable : true
					},
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

	$("#grid").kendoGrid({
		dataSource : dataSource,
		pageable : true,
		editable : "popup",
		toolbar : [ "create" ],
		columns : [ {
			field : "groupName",
			title : "角色名"
		}, {
			field : "description",
			title : "描述"
		}, {
			field : "roles",
			title : "权限",
			template : kendo.template($("#roleTemplate").html()),
			editable: false

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
});