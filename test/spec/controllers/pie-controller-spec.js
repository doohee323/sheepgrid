describe("PieController", function () {
    var $rootScope, $scope, controller;

    beforeEach(function () {
        module('pie');

        inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            controller = $injector.get('$controller')("PieController", {
                $scope: $scope
            });
        });
    });

    describe("aaaa", function() {
        describe("test", function () {
            it("Should dddd ", function () {
                expect($scope.slices).toEqual(8);
                $scope.eatSlice();
                console.log($scope.slices);
                expect($scope.slices).toEqual(7);
            });

            it("Should bbbb", function () {

            });
        });
    });
    describe('Initailization', function() {
		it('should instantiate ', function() {
			expect($scope.slices).toEqual(8);
		});
	});
});