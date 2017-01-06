/**
 * 倒计时标签
 * author : lwf 2016-11-10
 */

"use strict";
var moduleName="kass.widget.countdown";

angular.module(moduleName,[])
.directive("countdown",["$interval",function($interval){
	return{
		restrict:"E",
		replace:true,
		scope:{
			countFrom:"=",
			onTimeout:"&"
		},
		template:'<p>{{timeout}} s</p>',
		controller:["$scope",function($scope){
			var timer = null;
			$scope.$watch("countFrom",function(newValue){
				if(newValue&&!isNaN(parseInt(newValue))){
					var from = parseInt(newValue);
					$scope.timeout = from,
					$interval.cancel(timer),
					timer = $interval(function(){
						$scope.timeout--,
						0===$scope.timeout&&($interval.cancel(timer),$scope.onTimeout())
					},1e3)
				}
				else 
					$scope.timeout=0
			}),
			$scope.$on("$destroy",function(){
				$interval.cancel(timer);
			})
		}]
	}
}]);
module.exports=moduleName;

