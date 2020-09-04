import { Injectable } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

import { Schema } from "@rapydo/types";

@Injectable()
export class FormlyService {
  constructor() {}

  public json2Form(schema: Schema[], data: Record<string, any>) {
    let fields = [];
    let model = {};
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

      if (s.enum) {
        stype = "select";
      }
      if (stype === "text" || stype === "string" || stype === "textarea") {
        if (s.max && s.max > 256) {
          stype = "textarea";
        }

        if (stype === "textarea") {
          field_type = "textarea";
          // should be calculated from s.max, if provided
          field["templateOptions"]["rows"] = 5;
        } else {
          field_type = "input";
        }

        template_type = "text";

        if (s.min) {
          field["templateOptions"]["minLength"] = s.min;
        }
        if (s.max) {
          field["templateOptions"]["maxLength"] = s.max;
        }
      } else if (stype === "int" || stype === "number") {
        field_type = "input";
        template_type = "number";

        if (typeof s.min !== "undefined") {
          field["templateOptions"]["min"] = s.min;
        }
        if (typeof s.max !== "undefined") {
          field["templateOptions"]["max"] = s.max;
        }
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

        s.options = [];
        // { k1: v1, k2: v2}
        for (let key in s.enum) {
          s.options.push({ value: key, label: s.enum[key] });
        }

        field["templateOptions"]["options"] = s.options;
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
      } else if (stype === "checkbox" || stype === "boolean") {
        field_type = "checkbox";
        template_type = "checkbox";

        if (typeof model[s.key] === "undefined") {
          model[s.key] = false;
        }
      } else if (stype === "radio" || stype === "radio_with_description") {
        field_type = stype;
        template_type = "radio";
        field["templateOptions"]["options"] = s.options;

        // } else if (stype === "file") {
        //   field_type = "file";
        //   template_type = "file";
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
      field["templateOptions"]["required"] = s.required === "true";

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
              let default_data_list = [];

              // This works because template_type = "array";
              // Otherwise the model should be {key1: true, key2: true}
              for (let d of default_data) {
                if (typeof d["key"] !== "undefined") {
                  d = d["key"].toString();
                } else if (typeof d["uuid"] !== "undefined") {
                  d = d["uuid"].toString();
                } else if (typeof d["id"] !== "undefined") {
                  d = d["id"].toString();
                }
                default_data_list.push(d);
              }

              default_data = default_data_list;

              // } else if (template_type === "select" && s.multiple) {
              //   if (!Array.isArray(default_data)) {
              //     default_data = [default_data];
              //   }
              //   let default_data_list = [];

              //   for (let d of default_data) {
              //     if (typeof d["key"] !== "undefined") {
              //       d = d["key"].toString();
              //     } else if (typeof d["uuid"] !== "undefined") {
              //       d = d["uuid"].toString();
              //     } else if (typeof d["id"] !== "undefined") {
              //       d = d["id"].toString();
              //     }
              //     default_data_list.push(d);
              //   }

              //   default_data = default_data_list;
              // } else if (template_type === "select" && !s.multiple) {
            } else if (template_type === "select") {
              if (Array.isArray(default_data)) {
                if (default_data.length === 1) {
                  default_data = default_data[0];
                } else {
                  console.warn(
                    "Cannot determine default data from ",
                    default_data
                  );
                }
              }

              if (typeof default_data["key"] !== "undefined") {
                default_data = default_data["key"].toString();
              } else if (typeof default_data["uuid"] !== "undefined") {
                default_data = default_data["uuid"].toString();
              } else if (typeof default_data["id"] !== "undefined") {
                default_data = default_data["id"].toString();
              }
            }

            model[s.key] = default_data;
          }
        }
      }
    }

    return { fields, model };
  }

  public getField(model, type, key, name, required, descr, options = null) {
    const field = {
      description: descr,
      key,
      label: name,
      required: required ? "true" : "false",
      type,
    };

    if (type === "checkbox" || type === "boolean") {
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
    } else if (type === "select") {
      field["default"] = model[key];
    }

    if (options) {
      field["options"] = options;
    }

    return this.json2Form([field], model);
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
