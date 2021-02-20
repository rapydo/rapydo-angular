import { Injectable } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { FormlyFieldConfig } from "@ngx-formly/core";
import * as moment from "moment";

import { Schema, JSON2Form } from "@rapydo/types";

@Injectable()
export class FormlyService {
  private get_type(s: Schema) {
    if (s.options && s.type !== "radio") {
      return "select";
    }

    if (s.autocomplete_endpoint) {
      return "autocomplete";
    }

    return s.type;
  }
  public json2Form(schema: Schema[], data: Record<string, any>): JSON2Form {
    let fields: FormlyFieldConfig[] = [];
    let model: Record<string, unknown> = {};
    if (schema === null || typeof schema === "undefined") {
      return { fields, model };
    }

    for (let s of schema) {
      // This can occur if a key is deleted from the response, as in admin_mail.ts
      if (!s) {
        continue;
      }

      const stype: string = this.get_type(s);

      const is_array = s.type.endsWith("[]");

      let field_type = "";
      let template_type = "";

      let field = {};
      field["templateOptions"] = {};
      field["validators"] = {};

      if (stype === "string") {
        if (s.max && s.max > 256) {
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
        field_type = "password";
        // template_type = "password";

        if (typeof s.min !== "undefined") {
          field["templateOptions"]["minLength"] = s.min;
        }
        // if (typeof s.max !== "undefined") {
        //   field["templateOptions"]["maxLength"] = s.max;
        // }
      } else if (stype === "select") {
        // if (is_array) {
        //   field_type = "multicheckbox";
        //   // will output as a list instead of an object)
        //   template_type = "array";
        // } else {
        //   field_type = "select";
        //   template_type = "select";
        // }

        field_type = "select";
        template_type = "select";
        field["templateOptions"]["multiple"] = is_array;

        let options = [];
        // { k1: v1, k2: v2} -> [{value: k1, label: v1}, {value: k2, label: v2}]
        for (let key in s.options) {
          // value and label match the default bindValue and bindValue in ng-select
          options.push({ value: key, label: s.options[key] });
        }

        field["templateOptions"]["options"] = options;
        if (!is_array && !field["templateOptions"]["required"]) {
          if (Array.isArray(field["templateOptions"]["options"])) {
            // prevent duplicated empty options if already provided as valid value
            let empty_option_found = false;
            for (let opt of field["templateOptions"]["options"]) {
              if (opt.value === "") {
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
      } else if (stype === "boolean") {
        field_type = "checkbox";
        template_type = "checkbox";

        if (typeof model[s.key] === "undefined") {
          model[s.key] = false;
        }
      } else if (stype === "radio") {
        field_type = "radio";
        template_type = "radio";
        field["templateOptions"]["options"] = s.options;
      } else if (stype === "url") {
        field_type = "input";
        template_type = "url";
        field["validators"] = { validation: ["url"] };
      } else if (stype == "autocomplete") {
        field_type = "autocomplete";
        field["templateOptions"]["endpoint"] = s.autocomplete_endpoint;
        field["templateOptions"]["showValue"] = s.autocomplete_show_id;
        field["templateOptions"]["bindValue"] = s.autocomplete_id_bind;
        field["templateOptions"]["bindLabel"] = s.autocomplete_label_bind;
        field["templateOptions"]["multiple"] = is_array;
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

      fields.push(field);

      if (data && s.key in data) {
        let default_data = data[s.key];

        if (default_data === null || default_data === "") {
          if (field_type !== "datepicker") {
            model[s.key] = "";
          }
        } else {
          if (template_type === "number") {
            default_data = parseInt(default_data);
          } else if (field_type === "datepicker") {
            default_data = this.formatNgbDatepicker(default_data);
          } else if (field_type === "autocomplete") {
            field["templateOptions"]["selectedItems"] = [...default_data];
            const idValue = field["templateOptions"]["bindValue"] || "value";
            default_data = default_data.map((v) => v[idValue]);

            // Replaced by datepicker
            // } else if (template_type === "date") {
            //   default_data = this.formatDate(default_data);

            // Replaced by ng-select with multiple values
            // } else if (field_type === "multicheckbox") {
            //   // This works because template_type = "array";
            //   // Otherwise the model should be {key1: true, key2: true}
            //   let default_data_list = [];
            //   for (let d of default_data) {
            //     default_data_list.push(this.getSelectIdFromObject(d));
            //   }
            //   default_data = default_data_list;
          } else if (template_type === "select") {
            if (is_array) {
              const default_data_list = [];
              for (let d of default_data) {
                default_data_list.push(this.getSelectIdFromObject(d));
              }

              default_data = default_data_list;
            } else {
              default_data = this.getSelectIdFromObject(default_data);
            }
          }

          model[s.key] = default_data;
        }
      }
    }

    return { fields, model };
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
