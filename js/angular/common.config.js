angular.module('web').config(hotkeysConfig);
angular.module('web').config(formlyConfig);

function hotkeysConfig(hotkeysProvider) {
  //Disable ngRoute integration to prevent listening for $routeChangeSuccess events
  hotkeysProvider.useNgRoute = false;
}

angular.module('web').run(function(formlyValidationMessages) {
  formlyValidationMessages.addStringMessage('required', 'This field is required');
});

function formlyConfig(formlyConfigProvider) {
  formlyConfigProvider.extras.errorExistsAndShouldBeVisibleExpression = function($viewValue, $modelValue, scope) {
    return (scope.fc.$invalid && scope.form.$submitted);
  };

  formlyConfigProvider.setWrapper({
    name: 'validation',
    template: '<formly-transclude></formly-transclude>'+
              '<div ng-messages="fc.$error" ng-if="form.$submitted || options.formControl.$touched" class="error-messages">'+
              '  <div ng-message="{{ ::name }}" ng-repeat="(name, message) in ::options.validation.messages" class="message">{{ message(fc.$viewValue, fc.$modelValue, this)}}</div>'+
              '</div>',
    types: ['input', 'textarea', 'checkbox', 'radio', 'select'] // and soon, 'multiCheckbox'
  });
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


// var offset = new Date().getTimezoneOffset();

// var tz = "'+400'";
var tz = "'utc'";
formlyConfigProvider.setType({
    name: 'datepicker',
    extends: 'input',
    template: '<p class="input-group">{{model[options.key]}}'+
              '  <input  type="text"'+
              '          id="{{::id}}"'+
              '          name="{{::id}}"'+
              '          ng-model="model[options.key]"'+
              '          ng-model-options="{timezone: '+tz+'}"'+
              '          class="form-control"'+
              '          ng-click="datepicker.open($event)"'+
              '          uib-datepicker-popup="{{to.datepickerOptions.format}}"'+
              '          is-open="datepicker.opened"'+
              '          datepicker-options="to.datepickerOptions" />'+
              '  <span class="input-group-btn">'+
              '      <button type="button" class="btn btn-default" ng-click="datepicker.open($event)" ng-disabled="to.disabled"><i class="glyphicon glyphicon-calendar"></i></button>'+
              '  </span>'+
              '</p>',
    wrapper: ['bootstrapLabel', 'bootstrapHasError'],
    defaultOptions: {
      templateOptions: {
        datepickerOptions: {
          // initDate: new Date(),
          format: 'dd/MM/yyyy'
        }
      }
    },
    controller: ['$scope', function ($scope) {
      $scope.datepicker = {};

      $scope.datepicker.opened = false;

      $scope.datepicker.open = function ($event) {
        $scope.datepicker.opened = !$scope.datepicker.opened;
      };
    }]
  });




}
