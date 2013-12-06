describe("CentersCtrl", function() {
	var $rootScope, $scope, controller;

	beforeEach(function() {
		module('sheepgridApp');

		inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			controller = $injector.get('$controller')("CentersCtrl", {
				$scope : $scope
			});
		});
	});

	describe("aaaa", function() {
		describe("test", function() {
			it("Should dddd ", function() {

				debugger;
				console.log(1111);

			});

		});
	});

});