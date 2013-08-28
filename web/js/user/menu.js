

$(document).ready(function() {	
	$("#tree-menu").kendoTreeView({
    	template: kendo.template($("#treeview-menu-template").html()),
        dataSource: menus
    });
});



function openMenuEditWindow(param){
	var options = { width:"1080px", height: "500px", title:"权限配置"};
	openRemotePageWindow(options, "user_menuEdit", {_id : param});	
}

