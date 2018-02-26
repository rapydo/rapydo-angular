(function() {
  'use strict';

angular.module('web').controller('ListsController', ListsController);
function ListsController($scope, $log) {
	var self = this;
	self.selectedElements = 0;

	self.selectElement = function(element) {

	    element.isSelected=!element.isSelected;

        if (element.isSelected) self.selectedElements++;
        else self.selectedElements--;
	};

	self.selectAll = function(elements) {

	    self.selectedElements = 0;

	    for (var index=0; index<elements.length; index++) {
	    		if (elements[index].readonly) continue;
	            elements[index].isSelected=true;
	            self.selectedElements++;
	    }
	}

	self.deselectAll = function(elements) {

	    self.selectedElements = 0;
	    for (var index=0; index<elements.length; index++) {
	            elements[index].isSelected=false;
	    }

	}

	self.invertSelection = function(elements) {

	    self.selectedElements = 0;
	    for (var index=0; index<elements.length; index++) {
	            elements[index].isSelected=!elements[index].isSelected;

	           if (elements[index].isSelected) self.selectedElements++;

	    }

	}
};

ListsController.$inject = ["$scope", "$log"];

})();