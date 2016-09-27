angular.module('web').config(hotkeysConfig);
angular.module('web').config(formlyConfig);

function hotkeysConfig(hotkeysProvider) {
  //Disable ngRoute integration to prevent listening for $routeChangeSuccess events
  hotkeysProvider.useNgRoute = false;
}

function formlyConfig(formlyConfigProvider) {
  // self.templateDir+'/show.formly.html',
  //Custom template for autocomplete fields
  formlyConfigProvider.setType({
    name: 'autocomplete',
    extends: 'input',
    // controller: 'AutocompleteController as ctrl',
    // templateUrl: templateDir+'show.formly.html'
    template: '<input type="text" '+
              ' ng-model="model[options.key]" '+
              ' ng-model-options="{ getterSetter: true }"'+
              ' uib-typeahead="item as item.name for item in ctrl.querySearch(options.key, $viewValue)"'+
              ' typeahead-select-on-blur=true'+
              ' typeahead-show-hint=true'+
              ' class="form-control"'+
              '>',
    wrapper: ['bootstrapLabel', 'bootstrapHasError']

  });

formlyConfigProvider.setType({
    name: 'multiInput',
    extends: 'input',
    template: '<div class="input-group" ng-repeat="item in model[options.key] track by $index">'+
              '    <input type="text" class="form-control" ng-model="model[options.key][$index]"></input>'+
              '    <a ng-if="$index == 0" class="input-group-addon" uib-tooltip="Cannot remove the first element">x</a>'+
              '    <a ng-if="$index > 0" class="input-group-addon" uib-tooltip="Remove this element" ng-click="model[options.key].splice($index, 1)">x</a>'+
              '</div>'+
              '<div class="text-right">'+
              '    <button type="button" class="btn btn-success btn-sm" ng-click="model[options.key].push('+"''"+')">Add new element</button>'+
              '</div>',
    wrapper: ['bootstrapLabel', 'bootstrapHasError']

  });


formlyConfigProvider.setType({
    name: 'multiAutocomplete',
    extends: 'input',
    template: '<div class="input-group" ng-repeat="item in model[options.key] track by $index">'+
              // '    <input type="text" class="form-control" ng-model="model[options.key][$index]" id="model[options.key]" name="model[options.key]"></input>'+

              '<input type="text" '+
              ' ng-model="model[options.key][$index]" '+
              ' ng-model-options="{ getterSetter: true }"'+
              ' uib-typeahead="item as item.name for item in ctrl.querySearch(options.key, $viewValue)"'+
              ' typeahead-select-on-blur=true'+
              ' typeahead-show-hint=true'+
              ' class="form-control"'+
              '>'+
              '    <a ng-if="model[options.key].length == 1" class="input-group-addon" uib-tooltip="Cannot remove the first element">x</a>'+
              '    <a ng-if="model[options.key].length > 1" class="input-group-addon" uib-tooltip="Remove this element" ng-click="model[options.key].splice($index, 1)">x</a>'+
              '</div>'+
              '<div class="text-right">'+
              '    <button type="button" class="btn btn-success btn-sm" ng-click="model[options.key].push('+"''"+')">Add new element</button>'+
              '</div>',
    wrapper: ['bootstrapLabel', 'bootstrapHasError']

  });



}
