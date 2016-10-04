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
				field_type = "datepicker";
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
				
			} else if (s['type'] == 'multi_section') {
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

				// How to handle model values??
				// sections.model

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

			if (template_type == 'autocomplete' || template_type == 'multiAutocomplete') {
				field['controller'] = DataController+" as ctrl";
			}

			// if (multiple) {
			// 	if (!isArray(model[k])) {
			// 		model[k] = [model[k]];
			// 	}
			// }

			fields.push(field);

			if (data) {

				var model_key = k;
				if (s.islink == "true" && "model_key" in s) {
					model_key = s['model_key']
				}

				var default_data = data[model_key];
				if (default_data == null || default_data == "") {
					model[k] = ""
				} else {

					if (template_type == "number") {
						default_data = parseInt(default_data);
					} else if (template_type == "date") {
						default_data = new Date(default_data);
					} else if (template_type == "autocomplete") {
						if (s.islink == "true") {
							// Array copy
							default_data = (default_data.slice())[0];
						}
					} else if (template_type == "multiAutocomplete") {

					}

					model[k] = default_data;

				}
			}
		}

		// Return all information
		return {"fields":fields, "model": model};
	}

}

})();
