'use strict';

angular.module('sheepgridApp')
  .filter('agoText', function () {
    return function (input) {
    	moment.lang('en');
    	return moment(input).fromNow();
    };
  });
