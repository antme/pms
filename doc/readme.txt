
     

Tomcat配置
修改server.conf, 在 <Host> </Host>中间加入如下配置
	
	<Context path="" docBase="F:\workspace\pms\web" reloadable="true" crossContext="true"/>
	<Context path="/service" docBase="F:\workspace\pms\service\target\service" reloadable="true" crossContext="true"/>
	
Web访问路径：http://localhost:8080/
Service访问路径：http://localhost:8080/service/user/login

每次用Maven构建项目后会自动部署系统