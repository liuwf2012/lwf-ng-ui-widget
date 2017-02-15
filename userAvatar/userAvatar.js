/**
 *	用户头像 
 *	说明：
 *		1）用户头像为空时,显示用户名加背景色做默认头像
 *		2）用户头像存在时,显示头像图片
 *
 *	使用：
 *		@param uid  			//必须，用户emplid
 *		@param user-name   		//可选，用户名（用户名和用户头像必须填一个，否则头像显示为空）
 *		@param avatar 			//可选，用户头像地址
 *		@param size				//可选，头像尺寸，sm(24*24),md(32*32),lg(64*64),xlg(100*100)
 *		@param on-click-avatar 	//可选，点击头像执行的操作
 *		<user-avatar uid="12121" user-name="XXX" avatar="http://a.jpg" on-click-avatar="fn()"></user-avatar>
 *
 * 	lwf 2016-11-23
 */
"use strict";
var moduleName="lwf.widget.userAvatar";
angular.module(moduleName,[])
.directive("userAvatar",[function(){
	return{
		restrict:"AE",
		replace:true,
		scope:{
			uid: "=",
			userName: "=",
			avatar: "=",
			size: "@",
			onClickAvatar:"&"
		},
		template:'<div class="user-avatar"></div>',
		link: function(scope, element, attrs){
			var avatarDOM = element[0],
				CHINESE_CHARACTER = /[\u4e00-\u9fa5]/,
				colors = ["#1abc9c","#e67e22","#3498db","#e74c3c","#568aad","#7f8c8d","#8460a0"],
				//根据用户名的unicode计算颜色，保证同一个名称适中显示同一种颜色
				_getColor = function(name){
					var _char, _unicode=0;
					for(_char in name)
						_unicode += name.charCodeAt(_char);
					return colors[_unicode % colors.length];
				},
				_getNameAlias = function(name){
					return (!name || name.length<=2) 
						? name 
						: (CHINESE_CHARACTER.test(name)
							? name.substr(-2) 
							: name.substr(0,2));
				},
				createAvatar = function(){
					if(!isNaN(scope.uid)){	
						//生成avatar innerHTML
						if(scope.avatar){
							avatarDOM.style.backgroundImage = "url('"+scope.avatar+"')";
							avatarDOM.innerHTML = "";
						}else{
							var showName = _getNameAlias(scope.userName);
							avatarDOM.innerHTML='<div class="avatar-text">'+ showName +"</div>";
							avatarDOM.style.backgroundImage = "";
							avatarDOM.style.backgroundColor = _getColor(showName);
						}
						//设置尺寸
						scope.size && angular.element(avatarDOM).addClass(scope.size);
						scope.onClickAvatar && element.addClass("hover");
					}
				};
			scope.$watch("userName",function(newValue){
				createAvatar();
			});
			scope.$watch("avatar",function(newValue){
				createAvatar();
			});
			//绑定事件
			var clickFn = function(){
				scope.onClickAvatar && scope.onClickAvatar();
			};
			element.on("click",clickFn);
			scope.$on("$destroy",function(){
				element.off("click",clickFn);
			});
			//监听修改头像事件(只修改自己的)
			scope.$on("SET_USER_AVATAR",function(event,newAvatar,emplid){
				if(emplid==scope.uid){
					scope.avatar = newAvatar;
				}
			});
			//监听修改用户名事件(只修改自己的)
			scope.$on("SET_USER_NAME",function(event,newName,emplid){
				if(emplid==scope.uid){
					scope.userName = newName;
				}
			});
		}
	}
}]);

