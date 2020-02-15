import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

@Injectable()
export class FormlyService {

  private modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  public json2Form(schema, data) {

    let fields = [];
    let model = {}
    if (typeof schema == 'undefined') {
      return {"fields":fields, "model": model};
    }

    for (let i=0; i<schema.length; i++) {

      let s = schema[i];

      if (! ('type' in s)) {
        console.log("WARNING: invalid schema, missing type")
        return null;
      }
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
          if (format == "password") stype = "password"
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
              s['options'].push({"value": key, "label": option[key]});
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
        field_type = "datepicker";
        // field_type = "input";
        // template_type = "date";
      } else if (stype == "email") {
        field_type = "input";
        template_type = "email";
        field["validators"] = { "validation": ["email"]}
      } else if (stype == "password") {
        field_type = "input";
        template_type = "password";
      } else if (stype == "select") {
        field_type = "select";
        template_type = "select";

/*
        field['templateOptions']['labelProp'] = "value";
        field['templateOptions']['valueProp'] = "id";
*/

        field['templateOptions']['options'] = s['options']
        if (!field['templateOptions']['required']) {
          if (Array.isArray(field['templateOptions']['options'])) {
            field['templateOptions']['options'].unshift(
              {value: "", label: ""}
            );
          }
        }
        field['templateOptions']['multiple'] = multiple;

      } else if (stype == "checkbox" || stype == "boolean") {
        field_type = "checkbox";
        template_type = "checkbox";

        if (typeof model[s['key']] == 'undefined') {
          model[s['key']] = false;
        }
      } else if (stype == "radio") {
        field_type = "radio";
        template_type = "radio";
        field['templateOptions']['options'] = s['options']
      } else if (stype == "file") {
        field_type = "file";
        template_type = "file";
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
      }

      field['key'] = s['key'];
      field['type'] = field_type ; 
      if ('default' in s) {

        if (field['type'] == 'checkbox') {
          if (s['default']) {
            field['defaultValue'] = true;
            model[s['key']] = true;
          }
        } else {
          field['defaultValue'] = s['default'];
          model[s['key']] = s['default'];
        }
      }

      if ('size' in s)
        field['className'] = 'col-'+s['size'];

      field['templateOptions']['label'] = s['label'];

      if (stype == "select") {

        field['templateOptions']['description'] = s['description'];

      } else {
        field['templateOptions']['placeholder'] = s['description'];
      }
      field['templateOptions']['type'] = template_type; 
      field['templateOptions']['required'] = (s['required'] == "true");

      // if (template_type == 'radio') {
      //   field['templateOptions']['labelProp'] = "value";
      //   field['templateOptions']['valueProp'] = "name";
      //   field['templateOptions']['options'] = s['options']
      // }

      fields.push(field);

      if (data) {

        let model_key = s['key'];
        if (islink && "model_key" in s) {
          model_key = s['model_key']
        }

        if (model_key in data) {

          let default_data = data[model_key];

          if (default_data == null || default_data == "") {
            model[s['key']] = ""
          } else {

            if (template_type == "number") {
              default_data = parseInt(default_data);
            } else if (field_type == "datepicker") { 
              default_data = this.formatNgbDatepicker(default_data);
            } else if (template_type == "date") {
              default_data = this.formatDate(default_data);
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
    }

    return {"fields":fields, "model": model};
  }

  public getField(model, type, key, name, required, descr, options=undefined) {

    const field = {
      "description": descr,
      "key": key,
      "label": name,
      "required": (required)? "true":"false",
      "type": type
    }

    if (type == 'checkbox' || type == 'boolean') {
      if (key in model) {

        const v = model[key];

        if (v == "0" || v == "false" || v == "False" || v == "off") {
          field["default"] = false;
        } else if (v == "1" || v == "true" || v == "True" || v == "on") {
          field["default"] = true;
        } else {
          field["default"] = v;
        }
        delete model[key];
      }
    } else if (type == "select") {
      field["default"] = model[key];
    }

    if (options) {
      field['options'] = options;
    }

    return this.json2Form([field], model);
  }

  public formatNgbDatepicker(date_string) {
    if (date_string === null)
      return date_string

    if (date_string == "")
      return date_string

    // this works because we provided NgbDateAdapter = NgbDateNativeAdapter
    // otherwise by default ngbDatepicker uses { year: 'yyyy', month: 'mm', day: 'dd'}
    return new Date(date_string);
  }
  public formatDate(date_string) {
    if (date_string === null)
      return date_string

    if (date_string == "")
      return date_string

      const d = new Date(date_string);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
  }

  public showForm() {

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