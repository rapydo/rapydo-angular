(function() {
  'use strict';

// AngularJS directive to patch datepickers up so that the widgets will 
// automatically store dates or timings that are timezone-neutral (UTC).
// Got from:
// http://www.ericluwj.com/2015/11/06/angularui-ui-bootstrap-datepicker-and-timepicker-neutral-timezone.html
angular.module('web')
  .directive('datetimepickerNeutralTimezone', function() {
	// You would need to use the directive on the same HTML elements with the 
	// ng-model attributes by adding the datetimepicker-neutral-timezone attribute
	// (added such attribute in datepicker formly template in common.config.js)
    return {
      restrict: 'A',
      priority: 1,
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        ctrl.$formatters.push(function (value) {
          var date = new Date(Date.parse(value));
          date = new Date(date.getTime() + (60000 * date.getTimezoneOffset()));
          return date;
        });

        ctrl.$parsers.push(function (value) {
          var date = new Date(value.getTime() - (60000 * value.getTimezoneOffset()));
          return date;
        });
      }
    };
  });


angular.module('web').service('FormlyService', FormlyService);

function isArray(obj){
    return !!obj && Array === obj.constructor;
}

function FormlyService(noty, $log)
{

	var self = this;

	self.json2Form = function(schema, data, DataController) {

		var fields = [];
		var model = {}
		if (typeof schema == 'undefined') {
			return {"fields":fields, "model": model};
		}

		// search for multi_sections
		var add_sections = {}
		for (var i=0; i<schema.length; i++) {
			var s = schema[i];
			if (! ('custom' in s)) continue


			if ('section' in s['custom']) {
				schema[i]["type"] = "multi_section" // should be if multiple
				schema[i]["sections"] = []
				add_sections[s["name"]] = i

			} else if ('section_key' in s['custom']) {
				var section_key = s['custom']['section_key'];
				var row_identifier = s['custom']['row'];

				delete s['custom']['section_key'];
				var index = add_sections[section_key]

				if (! (row_identifier in schema[index]["sections"]))
					schema[index]["sections"][row_identifier] = []
				schema[index]["sections"][row_identifier].push(s);
				// remove element from array
				schema.splice(i, 1);
				i--;
			}
		}

		for (var i=0; i<schema.length; i++) {

			var s = schema[i];
			// var k = s.key;
			var stype = s['type'];

			var field_type = "";
			var template_type = "";

			var field = {}
			var multiple = ('multiple' in s && s['multiple'] == "true")
			var islink = ('islink' in s && s['islink'] == "true")
			field['templateOptions'] = {}

			// Swagger compatibility
			if (! ('key' in s)) {
				s['key'] = s['name']
				if ('custom' in s) {

					var custom = s['custom']

					if ('label' in custom) {
						s['label'] = custom['label']
					}

					if ('htmltype' in custom) {
						stype = custom['htmltype']
					}

					if ('islink' in custom) {
						islink = custom['islink']
					}

					if ('multiple' in custom) {
						multiple = custom['multiple']
					}

					if ('size' in custom) {
						s['size'] = custom['size']
					}

					if ('autocomplete' in custom) {
						stype = 'autocomplete'
					}
					if ('model_key' in custom) {
						s['model_key'] = custom['model_key']
					}
					if ('select_id' in custom) {
						s['select_id'] = custom['select_id']
					}
					if ('select_label' in custom) {
						s['select_label'] = custom['select_label']
					}
				}

				if ('format' in s) {
					var format = s['format']
					if (format == "date") stype = "date"
				}

				if (s['required']) {
					s['required'] = "true"
				}

				if (s['enum']) {
					stype = "select"
					s['options'] = []

					for (var j in s['enum']) {
						var option = s['enum'][j];
						for (var key in option) {
							s['options'].push({"id": key, "value": option[key]});
						}
					}
				}
			}
			// End of swagger compatibility

			if (stype == "text" || stype == "string") {
				field_type = "input";
				template_type = "text";
				if (multiple) {
					field['templateOptions']["inputOptions"] = {}
					field['templateOptions']["inputOptions"]["type"] = field_type;
					field['type'] = "multiInput"
				}
			} else if (stype == "longtext" || stype == "textarea") {
				field_type = "textarea";
				template_type = "text";
			} else if (stype == "int" || stype == "number") {
				field_type = "input";
				template_type = "number";
			} else if (stype == "date") {
				field_type = "datepicker";
				template_type = "date";
			} else if (stype == "select") {
				field_type = "select";
				template_type = "select";
			// } else if (stype == "radio") {
			// 	field_type = "radio";
			// 	template_type = "radio";
			} else if (stype == "autocomplete") {
				// Custom defined type
				field_type = "autocomplete";
				template_type = "autocomplete";

				if (multiple) {
					field['templateOptions']["inputOptions"] = {}
					field['templateOptions']["inputOptions"]["type"] = field_type;
					field_type = "multiAutocomplete"
					template_type = "multiAutocomplete"
				}

				if ("select_id" in s) {
					field['templateOptions']['select_id'] = s.select_id;
				} else {
					field['templateOptions']['select_id'] = "value"
				}

				if ("select_label" in s) {
					field['templateOptions']['select_label'] = s.select_label;
				} else {
					field['templateOptions']['select_label'] = "name"
				}
				
			} else if (stype == 'multi_section') {
				field_type = "repeatSection";
				template_type = "repeatSection";

				field['templateOptions']['fields'] = [];

				var sections_config = s['sections'];

				// Each element in sections list will be a row
				for (var section_index in sections_config) {
					var section = sections_config[section_index];
					var sub_form = self.json2Form(section, data, DataController);

					var row = {
						className: 'row',
						fieldGroup: [
						]
					}
					// Each element in the section will be a column
					for (var index in sub_form.fields) {
						row.fieldGroup.push(sub_form.fields[index]);
					}
					field['templateOptions']['fields'].push(row);
				}

				field['templateOptions']['btnText'] = "Add";

			}

			field['key'] = s['key'];
			field['type'] = field_type ; 
			if ('default' in s)
				field['defaultValue'] = s['default'];

			if ('size' in s)
				field['className'] = 'col-xs-'+s['size'];

			field['templateOptions']['label'] = s['label'];
			field['templateOptions']['placeholder'] = s['description'];
			field['templateOptions']['type'] = template_type; 
			field['templateOptions']['required'] = (s['required'] == "true");
			if (template_type == 'textarea') {
				field['templateOptions']['rows'] = 5;
			}
			if (template_type == 'select') {
				field['templateOptions']['labelProp'] = "value";
      			field['templateOptions']['valueProp'] = "id";
      			field['templateOptions']['options'] = s['options']
      			//field['templateOptions']['multiple'] = false;
			}
			// if (template_type == 'radio') {
			// 	field['templateOptions']['labelProp'] = "value";
			// 	field['templateOptions']['valueProp'] = "name";
			// 	field['templateOptions']['options'] = s['options']
			// }
			if (template_type == 'autocomplete' || template_type == 'multiAutocomplete') {
				field['controller'] = DataController+" as ctrl";
			}

			fields.push(field);

			if (data) {

				var model_key = s['key'];
				if (islink && "model_key" in s) {
					model_key = s['model_key']
				}

				var default_data = data[model_key];

				if (default_data == null || default_data == "") {
					model[s['key']] = ""
				} else {

					if (template_type == "number") {
						default_data = parseInt(default_data);
					} else if (template_type == "date") {
						default_data = new Date(default_data);
					} else if (template_type == "select") {
						if (islink) {
							// Array copy
							// default_data = (default_data.slice())[0];
							default_data = default_data[0];
						}

						if ("select_id" in s && s["select_id"] in default_data) {
							default_data = default_data[s["select_id"]];
							default_data = default_data.toString()
						}

					} else if (template_type == "autocomplete") {
						if (islink) {
							// Array copy
							default_data = (default_data.slice())[0];
						}
					} else if (template_type == "multiAutocomplete") {

					}

					model[s['key']] = default_data;
				}
			}
		}

		// Return all information
		return {"fields":fields, "model": model};
	}

}

})();
