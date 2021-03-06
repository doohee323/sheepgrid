'use strict';

var config = {
	// url : 'http://localhost\\:3000',
	// url: 'http://sheeprails.herokuapp.com',
	url : 'http://localhost\\:7001/rest',
	// url : '/pattern/pt42/masterdetail',
	server : 'spring', // spring, rails,
	centers : {}, // spring, rails,
	socketLogined : false,
	socketUrl : 'http://sheepsocket-43181.usw1.actionbox.io:5000/ui_centers'
// socketUrl: 'http://localhost:5000/ui_centers'
};

var app = angular.module('sheepgridApp',
		[ 'ngResource', 'ui.router', 'ngGrid' ])

app.constant('config', config).config(
		function($stateProvider, $urlRouterProvider, $locationProvider) {
			// default route
			$urlRouterProvider.otherwise("/");

			// default route
			$stateProvider.state('default', {
				templateUrl : '/views/layout/default.html',
				controller : 'DefaultCtrl',
				abstract : true
			}).state('default.centers', {
				templateUrl : './views/centers.html',
				controller : 'CentersCtrl',
			}).state('default.regions', {
				url : "/regions/:id",
				templateUrl : './views/regions.html',
				controller : 'RegionsCtrl',
			}).state("app", {
				templateUrl : "/views/layout/default.html",
				controller : "DefaultCtrl",
				abstract : true,
				url : ""
			}).state("app.centers", {
				url : "/centers",
				views : {
					"tabs@app" : {
						templateUrl : './views/centers.html',
						controller : 'CentersCtrl'
					},
					"view@app" : {
						templateUrl : "/views/tab1/welcome.html"
					}
				}
			}).state("app.regions", {
				url : "/regions",
				views : {
					"tabs@app" : {
						templateUrl : "/views/regions.html",
						controller : 'RegionsCtrl'
					},
					"view@app" : {
						templateUrl : "/views/tab1/userTabs.html"
					}
				}
			});

			$locationProvider.html5Mode(true).hashPrefix('!');

		});
