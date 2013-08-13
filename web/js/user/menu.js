

$(document).ready(function() {	
	$("#tree-menu").kendoTreeView({
    	template: kendo.template($("#treeview-menu-template").html()),
        dataSource: menus
    });
});


