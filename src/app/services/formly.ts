import { Injectable } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { DateService } from "@rapydo/services/date";

import { Schema, JSON2Form } from "@rapydo/types";

@Injectable()
export class FormlyService {
  constructor(private date: DateService) {}

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
      field["props"] = {};
      field["validators"] = {};

      // Uhmm... show to handle with placeholders? Should I raise a warning!??
      // field["wrappers"] = ["form-field-floating"];
      let floating_labels_supported = true;

      if (stype === "string") {
        if (s.max && (s.max as number) > 256) {
          field_type = "textarea";
          // should be calculated from s.max
          field["props"]["rows"] = 5;
        } else {
          field_type = "input";
        }

        template_type = "text";

        field["props"]["minLength"] = s.min;
        field["props"]["maxLength"] = s.max;

        // number is a float/decimal
      } else if (stype === "int" || stype === "number") {
        field_type = "input";
        template_type = "number";

        field["props"]["min"] = s.min;
        field["props"]["max"] = s.max;
      } else if (stype === "date") {
        floating_labels_supported = false;
        field_type = "simpledatepicker";
        if (typeof s.min !== "undefined") {
          field["props"]["min"] = this.getNgbDateStruct(s.min);
        }
        if (typeof s.max !== "undefined") {
          field["props"]["max"] = this.getNgbDateStruct(s.max);
        }
      } else if (stype === "datetime") {
        floating_labels_supported = false;
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
          field["props"]["min"] = this.getNgbDateStruct(s.min);
        }
        if (typeof s.max !== "undefined") {
          field["props"]["max"] = this.getNgbDateStruct(s.max);
        }
      } else if (stype === "email") {
        field_type = "input";
        template_type = "email";
        field["validators"] = { validation: ["email"] };
      } else if (stype === "password") {
        field_type = "password";
        // template_type = "password";

        if (typeof s.min !== "undefined") {
          field["props"]["minLength"] = s.min;
        }
        // if (typeof s.max !== "undefined") {
        //   field["props"]["maxLength"] = s.max;
        // }
      } else if (stype === "select") {
        floating_labels_supported = false;
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
        field["props"]["multiple"] = is_array;
        if ("extra_descriptions" in s) {
          field["props"]["extra_descriptions"] = s.extra_descriptions;
        }

        let options = [];
        // { k1: v1, k2: v2} -> [{value: k1, label: v1}, {value: k2, label: v2}]
        for (let key in s.options) {
          // value and label match the default bindValue and bindValue in ng-select
          options.push({ value: key, label: s.options[key] });
        }

        field["props"]["options"] = options;
        if (!is_array && !field["props"]["required"]) {
          if (Array.isArray(field["props"]["options"])) {
            // prevent duplicated empty options if already provided as valid value
            let empty_option_found = false;
            for (let opt of field["props"]["options"]) {
              if (opt.value === "") {
                empty_option_found = true;
                break;
              }
            }
            if (!empty_option_found) {
              field["props"]["options"].unshift({
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
        floating_labels_supported = false;
        field_type = "radio";
        template_type = "radio";
        field["props"]["options"] = s.options;
      } else if (stype === "url") {
        field_type = "input";
        template_type = "url";
        field["validators"] = { validation: ["url"] };
      } else if (stype === "autocomplete") {
        floating_labels_supported = false;
        field_type = "autocomplete";
        field["props"]["endpoint"] = s.autocomplete_endpoint;
        field["props"]["showValue"] = s.autocomplete_show_id;
        field["props"]["bindValue"] = s.autocomplete_id_bind;
        field["props"]["bindLabel"] = s.autocomplete_label_bind;
        field["props"]["multiple"] = is_array;
      } else if (is_array) {
        field_type = "textarea";
        field["props"]["rows"] = 5;
      }

      if (s.key.includes(".")) {
        // dots in keys are interpreted as nested dictionaries and converted into
        // a.b => a: { b: value}
        // ["a.b"] prevents this behaviour
        field["key"] = [s.key];
      } else {
        // the use of [ ] make some fields to fail (i.e. are in the form but not shown)
        // in the html ... to prevent such kind of errors this fix is only applied
        // to keys that contain dots
        field["key"] = s.key;
      }
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

      field["props"]["label"] = s.label;
      if (floating_labels_supported) {
        field["props"]["labelPosition"] = "floating";
      }

      if (stype === "select") {
        field["props"]["description"] = s.description;
      } else {
        field["props"]["placeholder"] = s.description;
      }
      field["props"]["type"] = template_type;
      field["props"]["required"] = s.required;

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
            field["props"]["selectedItems"] = [...default_data];
            const idValue = field["props"]["bindValue"] || "value";
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
    obj: string | Record<"key" | "uuid" | "id" | "name", string | number>,
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
    const utc = this.date.toUTCDate(d);
    return {
      year: utc.getFullYear(),
      month: 1 + utc.getMonth(),
      day: utc.getDate(),
    };
  }
}
