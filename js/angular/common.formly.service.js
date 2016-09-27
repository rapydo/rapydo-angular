(function() {
  'use strict';

angular.module('web').service('FormlyService', FormlyService);

function isArray(obj){
    return !!obj && Array === obj.constructor;
}

function FormlyService(noty)
{

	var self = this;

	self.json2Form = function(schema, data, DataController) {
		var fields = [];
		var model = {}
		for (var i=0; i<schema.length; i++) {

			var s = schema[i];
			var k = s.key;

			var field_type = "";
			var template_type = "";

			var field = {}
			var multiple = ('multiple' in s && s['multiple'] == "true")
			field['templateOptions'] = {}

			if (s['type'] == "text") {
				field_type = "input";
				template_type = "text";
				if (multiple) {
					field['templateOptions']["inputOptions"] = {}
					field['templateOptions']["inputOptions"]["type"] = field_type;
					field['type'] = "multiInput"
				}
			} else if (s['type'] == "longtext") {
				field_type = "textarea";
				template_type = "text";
			} else if (s['type'] == "int") {
				field_type = "input";
				template_type = "number";
			} else if (s['type'] == "date") {
				field_type = "input";
				template_type = "date";
			} else if (s['type'] == "select") {
				field_type = "select";
				template_type = "select";
			} else if (s['type'] == "autocomplete") {
				// Custom defined type
				field_type = "autocomplete";
				template_type = "autocomplete";

				if (multiple) {
					field['templateOptions']["inputOptions"] = {}
					field['templateOptions']["inputOptions"]["type"] = field_type;
					field_type = "multiAutocomplete"
				}

			}

			field['key'] = s['key'];
			field['type'] = field_type ; 
			if ('default' in s)
				field['defaultValue'] = s['default'];

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

			if (template_type == 'autocomplete') {
				field['controller'] = DataController+" as ctrl";
			}
			// if (template_type == 'date') {
			// 	console.log(data)
			// }

			if (multiple) {
				if (!isArray(model[k])) {
					model[k] = [model[k]];
				}
			}

			fields.push(field);

			if (data) {
				if (data[k] == null) {
					model[k] = ""
				} else if (typeof data[k] === "object") {
					model[k] = data[k]["id"];
				} else {
					model[k] = data[k];
				}
				if (template_type == "number") {
					model[k] = parseInt(model[k]);
				}
			}
		}

		// Return all information
		return {"fields":fields, "model": model};
	}

}

})();
