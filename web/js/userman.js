
var groupDataSource;

$(document).ready(function() {
	groupDataSource = new kendo.data.DataSource({
		transport : {
			read : {
				url : "/service/user/group/list",
				dataType : "jsonp"
			}
		}
	});
	
	groupDataSource.read();
	var dataSource = new kendo.data.DataSource({
		transport : {
			read : {
				url : "../service/user/list",
				dataType : "jsonp"
			},
			update : {
				url : "../service/user/update",
				dataType : "jsonp",
				type : "post"
			},
			create : {
				url : "../service/user/add",
				dataType : "jsonp",
				type : "post"
			},

			destroy : {
				url : "../service/user/delete",
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
					userName : {
						validation : {
							required : true
						}
					},
					password : {
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
		toolbar : [ {
			name : "create",
			text : "创建用户"
		} ],
		columns : [ {
			field : "userName",
			title : "用户名"
		}, {
			field : "phone",
			title : "手机"
		}, {
			field : "email",
			title : "Email"
		}, {
			field : "groups",
			title : "角色",
			editor: groupMultSelectEditor,
			template : function(dataItem) {
				  if(dataItem.groups){
					  var groups = dataItem.groups;
					  var groupNames = "";
					  for(i=0; i<groups.length; i++){						  
						  for(j=0; j<groupDataSource.data().length; j++){
							  if(groupDataSource.data()[j]._id == groups[i]){
								  groupNames = groupNames + groupDataSource.data()[j].groupName + " ";
							  }
						  }
					  }
				      return "<strong>" + groupNames + "</strong>";
				 }else{
					 return "<strong>....</strong>";
				 }
		    }
			
		}, {
			field : "password",
			title : "密码",
			hidden : true
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


function groupMultSelectEditor(container, options) {
	var uid = kendo.guid();
	var editor = $('<input  data-bind="value:' + options.field + '"/>');
	editor.appendTo(container);
	console.log(options.model.groups);
	editor.kendoMultiSelect({
		dataTextField : "groupName",
		dataValueField : "_id",
		placeholder : "选择权限...",
		dataSource : {
			transport : {
				read : {
					dataType : "jsonp",
					url : "/service/user/group/list",
				}
			}
		},
		change : function(e) {
			options.model.groups = this.value();
		},
		height : 300
	})[0];
}