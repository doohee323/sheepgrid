'use strict';

angular.module('sheepgridApp')
.factory('RegionService', function ($resource, config) {
	return $resource(config.url + "/uip_regions/:id", {
		id:"@id"
	}, {
		update: {
			method: "PUT"
		}
	});

});
