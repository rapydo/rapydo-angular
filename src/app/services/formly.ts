import { Injectable } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { FormlyFieldConfig } from "@ngx-formly/core";
import * as moment from "moment";

import { Schema, SchemaType, JSON2Form } from "@rapydo/types";

@Injectable()
export class FormlyService {
  constructor() {}

  public json2Form(schema: Schema[], data: Record<string, any>): JSON2Form {
    let fields: FormlyFieldConfig[] = [];
    let model: Record<string, unknown> = {};
    if (schema === null || typeof schema === "undefined") {
      return { fields, model };
    }

    for (let s of schema) {
      let stype: string = s.type;

      let field_type = "";
      let template_type = "";

      let field = {};
      field["templateOptions"] = {};
      field["validators"] = {};

      if (
        s.options &&
        stype !== "radio" &&
        stype !== "radio_with_description"
      ) {
        stype = "select";
      }

      if (stype === "string") {
        if (s.max && s.max > 256) {
          stype = "textarea";
          field_type = "textarea";
          // should be calculated from s.max
          field["templateOptions"]["rows"] = 5;
        } else {
          field_type = "input";
        }

        template_type = "text";

        field["templateOptions"]["minLength"] = s.min;
        field["templateOptions"]["maxLength"] = s.max;

        // number is a float/decimal
      } else if (stype === "int" || stype === "number") {
        field_type = "input";
        template_type = "number";

        field["templateOptions"]["min"] = s.min;
        field["templateOptions"]["max"] = s.max;
      } else if (stype === "date") {
        field_type = "datepicker";
        // field_type = "input";
        // template_type = "date";
        // Note that min and max require getNgbDateStruct even if datepicker is
        // configured with NgbDateNativeAdapter. This is something like a BUG
        // in getNgbDate and could (or at least should) be fixed in a near future:
        // From the ng-bootstrap docs:
        // You can also tell datepicker to use the native JavaScript date adapter (bundled with ng-bootstrap).
        // >>>> For now <<<< the adapter works only for the form
        // integration, so for instance (ngModelChange) will return a native date object
        // >>>> All other APIs continue to use NgbDateStruct <<<<

        if (typeof s.min !== "undefined") {
          field["templateOptions"]["min"] = this.getNgbDateStruct(s.min);
        }
        if (typeof s.max !== "undefined") {
          field["templateOptions"]["max"] = this.getNgbDateStruct(s.max);
        }
      } else if (stype === "email") {
        field_type = "input";
        template_type = "email";
        field["validators"] = { validation: ["email"] };
      } else if (stype === "password") {
        field_type = "input";
        template_type = "password";

        if (typeof s.min !== "undefined") {
          field["templateOptions"]["minLength"] = s.min;
        }
        // if (typeof s.max !== "undefined") {
        //   field["templateOptions"]["maxLength"] = s.max;
        // }
      } else if (stype === "select") {
        if (s.multiple) {
          field_type = "multicheckbox";
          // will output as a list instead of an object)
          template_type = "array";
        } else {
          field_type = "select";
          template_type = "select";
        }

        let options = [];
        // { k1: v1, k2: v2}
        for (let key in s.options) {
          options.push({ value: key, label: s.options[key] });
        }

        field["templateOptions"]["options"] = options;
        if (!s.multiple && !field["templateOptions"]["required"]) {
          if (Array.isArray(field["templateOptions"]["options"])) {
            // prevent duplicated empty options if already provided as valid value
            let empty_option_found = false;
            for (let opt of field["templateOptions"]["options"]) {
              if (opt.value == "") {
                empty_option_found = true;
                break;
              }
            }
            if (!empty_option_found) {
              field["templateOptions"]["options"].unshift({
                value: "",
                label: "",
              });
            }
          }
        }
        // if (s.multiple) {
        //   field["templateOptions"]["multiple"] = s.multiple;
        // }
      } else if (stype === "boolean") {
        field_type = "checkbox";
        template_type = "checkbox";

        if (typeof model[s.key] === "undefined") {
          model[s.key] = false;
        }
      } else if (stype === "radio" || stype === "radio_with_description") {
        field_type = stype;
        template_type = "radio";
        field["templateOptions"]["options"] = s.options;
      }

      field["key"] = s.key;
      field["type"] = field_type;

      if ("default" in s) {
        if (field["type"] === "checkbox") {
          if (s.default) {
            field["defaultValue"] = true;
            model[s.key] = true;
          }
        } else {
          field["defaultValue"] = s.default;
          model[s.key] = s.default;
        }
      }

      field["templateOptions"]["label"] = s.label;

      if (stype === "select") {
        field["templateOptions"]["description"] = s.description;
      } else {
        field["templateOptions"]["placeholder"] = s.description;
      }
      field["templateOptions"]["type"] = template_type;
      field["templateOptions"]["required"] = s.required;

      // if (template_type === 'radio') {
      //   field['templateOptions']['labelProp'] = "value";
      //   field['templateOptions']['valueProp'] = "name";
      //   field['templateOptions']['options'] = s.options;
      // }

      fields.push(field);

      if (data) {
        let model_key = s.key;

        if (model_key in data) {
          let default_data = data[model_key];

          if (default_data === null || default_data === "") {
            model[s.key] = "";
          } else {
            if (template_type === "number") {
              default_data = parseInt(default_data);
            } else if (field_type === "datepicker") {
              default_data = this.formatNgbDatepicker(default_data);
            } else if (template_type === "date") {
              default_data = this.formatDate(default_data);
            } else if (field_type == "multicheckbox") {
              // This works because template_type = "array";
              // Otherwise the model should be {key1: true, key2: true}
              let default_data_list = [];
              for (let d of default_data) {
                default_data_list.push(this.getSelectIdFromObject(d));
              }

              default_data = default_data_list;
            } else if (template_type === "select") {
              // if (Array.isArray(default_data)) {
              //   if (default_data.length === 1) {
              //     default_data = default_data[0];
              //   } else {
              //     console.warn(
              //       "Cannot determine default data from ",
              //       default_data
              //     );
              //   }
              // }
              default_data = this.getSelectIdFromObject(default_data);
            }

            model[s.key] = default_data;
          }
        }
      }
    }

    return { fields, model };
  }

  public getField(
    model: Record<string, any>,
    type: SchemaType,
    key: string,
    name: string,
    required: boolean,
    descr: string,
    options: Record<string, string> = null
  ): JSON2Form {
    const field = {
      description: descr,
      key,
      label: name,
      required,
      type,
    };

    if (type === "boolean") {
      if (key in model) {
        const v = model[key];

        if (v === "0" || v === "false" || v === "False" || v === "off") {
          field["default"] = false;
        } else if (v === "1" || v === "true" || v === "True" || v === "on") {
          field["default"] = true;
        } else {
          field["default"] = v;
        }
        delete model[key];
      }
    } else if (options) {
      field["default"] = model[key];
    }

    if (options) {
      field["options"] = options;
    }

    return this.json2Form([field], model);
  }

  public getSelectIdFromObject(
    obj: string | Record<"key" | "uuid" | "id" | "name", string | number>
  ): string {
    if (typeof obj["key"] !== "undefined") {
      return obj["key"].toString();
    }
    if (typeof obj["uuid"] !== "undefined") {
      return obj["uuid"].toString();
    }
    if (typeof obj["id"] !== "undefined") {
      return obj["id"].toString();
    }
    // it is used by Roles
    if (typeof obj["name"] !== "undefined") {
      return obj["name"].toString();
    }

    if (typeof obj == "string") {
      return obj;
    }

    return obj.toString();
  }

  public formatNgbDatepicker(date_string: string): Date {
    if (date_string === null || date_string === "") {
      return null;
    }

    // this works because we provided NgbDateAdapter = NgbDateNativeAdapter
    // otherwise by default ngbDatepicker uses { year: 'yyyy', month: 'mm', day: 'dd'}
    return new Date(date_string);
  }
  public formatDate(date_string: string): string {
    if (date_string === null || date_string === "") {
      return date_string;
    }

    const d = new Date(date_string);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return [year, month, day].join("-");
  }
  public getNgbDateStruct(d: Date | string | number): NgbDateStruct {
    // Can handle both string in standard (ISO?) formats and Date objects
    const mdt = moment.utc(d);
    return {
      year: mdt.year(),
      month: 1 + mdt.month(),
      day: mdt.date(),
    };

    // Version Date only, no moment conversion:
    // return {
    //   year: d.getFullYear(),
    //   month: d.getMonth() + 1,
    //   day: d.getDate()
    // }
  }
}
