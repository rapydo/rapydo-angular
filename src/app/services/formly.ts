import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs/observable/of';

@Injectable()
export class FormlyService {

	private modalRef: NgbModalRef;

	constructor(private modalService: NgbModal) {}

	public json2Form(schema, data, DataController) {

		let fields = [];
		let model = {}
		if (typeof schema == 'undefined') {
			return {"fields":fields, "model": model};
		}

		// search for multi_sections
		let add_sections = {}
		for (let i=0; i<schema.length; i++) {
			let s = schema[i];
			if (! ('custom' in s)) continue


			if ('section' in s['custom']) {
				schema[i]["type"] = "multi_section" // should be if multiple
				schema[i]["sections"] = []
				add_sections[s["name"]] = i

			} else if ('section_key' in s['custom']) {
				let section_key = s['custom']['section_key'];
				let row_identifier = s['custom']['row'];

				delete s['custom']['section_key'];
				let index = add_sections[section_key]

				if (! (row_identifier in schema[index]["sections"]))
					schema[index]["sections"][row_identifier] = []
				schema[index]["sections"][row_identifier].push(s);
				// remove element from array
				schema.splice(i, 1);
				i--;
			}
		}

		for (let i=0; i<schema.length; i++) {

			let s = schema[i];
			// let k = s.key;
			let stype = s['type'];

			let field_type = "";
			let template_type = "";

			let field = {}
			let multiple = ('multiple' in s && s['multiple'] == "true")
			let islink = ('islink' in s && s['islink'] == "true")
			field['templateOptions'] = {}
			field['validators'] = {}

			// Swagger compatibility
			if (! ('key' in s)) {
				s['key'] = s['name']
				if ('custom' in s) {

					let custom = s['custom']

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
						stype = "autocomplete"
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
					let format = s['format']
					if (format == "date") stype = "date"
					if (format == "email") stype = "email"
				}

				if (s['required']) {
					s['required'] = "true"
				}

				if (s['enum']) {
					stype = "select"
					s['options'] = []

					for (let j in s['enum']) {
						let option = s['enum'][j];
						for (let key in option) {
							s['options'].push({"label": key, "value": option[key]});
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
				field['templateOptions']['rows'] = 5;
			} else if (stype == "int" || stype == "number") {
				field_type = "input";
				template_type = "number";
			} else if (stype == "date") {
				// field_type = "datepicker";
				field_type = "input";
				template_type = "date";
			} else if (stype == "email") {
				field_type = "input";
				template_type = "email";
				field['validators']['validation']  = ['email']
			} else if (stype == "select") {
				field_type = "select";
				template_type = "select";

/*				field['templateOptions']['labelProp'] = "value";
      			field['templateOptions']['valueProp'] = "id";*/
      			field['templateOptions']['options'] = s['options']
      			field['templateOptions']['multiple'] = multiple;

			} else if (stype == "checkbox" || stype == "boolean") {
				field_type = "checkbox";
				template_type = "checkbox";
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
				console.log(field_type + " not implemented!");
				// Not implemented!!!
				field_type = "input";
				template_type = "text";

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

				/*console.log(DataController);*/
				/*field['controller'] = DataController+" as ctrl";*/


				
			} else if (stype == 'multi_section') {
				field_type = "repeatSection";
				template_type = "repeatSection";

				field['templateOptions']['fields'] = [];

				let sections_config = s['sections'];

				// Each element in sections list will be a row
				for (let section_index in sections_config) {
					let section = sections_config[section_index];
					let sub_form = this.json2Form(section, data, DataController);

					let row = {
						className: 'row',
						fieldGroup: [
						]
					}
					// Each element in the section will be a column
					for (let tmp in sub_form.fields) {
						row.fieldGroup.push(sub_form.fields[tmp]);
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
				field['className'] = 'col-'+s['size'];

			field['templateOptions']['label'] = s['label'];
			field['templateOptions']['placeholder'] = s['description'];
			field['templateOptions']['type'] = template_type; 
			field['templateOptions']['required'] = (s['required'] == "true");

			// if (template_type == 'radio') {
			// 	field['templateOptions']['labelProp'] = "value";
			// 	field['templateOptions']['valueProp'] = "name";
			// 	field['templateOptions']['options'] = s['options']
			// }

			fields.push(field);

			if (data) {

				let model_key = s['key'];
				if (islink && "model_key" in s) {
					model_key = s['model_key']
				}

				let default_data = data[model_key];

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

						if (typeof default_data["key"] !== 'undefined' &&
								typeof default_data["description"] !== 'undefined') {
							default_data = default_data["key"];
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

	showForm() {

		let template = "<div>test</div>";
	    this.modalRef = this.modalService.open(template, {size: 'lg'});
	    this.modalRef.result.then((result) => {
			/*console.log("Closed with: " + result)*/;
	    }, (reason) => {
			/*console.log(`Dismissed ${this.getDismissReason(reason)}`)*/;
	    });
		/*console.log("evviva");*/
	}



}