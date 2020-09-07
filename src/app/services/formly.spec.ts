import { TestBed, getTestBed } from "@angular/core/testing";
import { FormlyService } from "@rapydo/services/formly";
import { Schema } from "@rapydo/types";

describe("FormlyService", () => {
  let injector: TestBed;
  let service: FormlyService;
  const schema: Schema[] = [
    {
      label: "Text",
      description: "Text",
      key: "text",
      required: "true",
      type: "string",
    },
    {
      label: "List",
      description: "List",
      enum: {
        k1: "val1",
        k2: "val2",
      },
      key: "list",
      required: "true",
      type: "string",
    },
    {
      label: "Checkbox",
      key: "checkbox",
      required: "false",
      type: "boolean",
    },
    {
      label: "Number",
      description: "number",
      key: "number",
      required: "true",
      type: "number",
    },
  ];
  const schema_with_defaults: Schema[] = [
    {
      label: "Text",
      description: "Text",
      key: "text",
      default: "default text",
      required: "true",
      type: "string",
    },
    {
      label: "List",
      description: "List",
      enum: {
        k1: "val1",
        k2: "val2",
      },
      default: "k1",
      key: "list",
      required: "true",
      type: "string",
    },
    {
      label: "Checkbox",
      default: "true",
      key: "checkbox",
      required: "false",
      type: "boolean",
    },
    {
      label: "Number",
      description: "number",
      default: 42,
      key: "number",
      required: "true",
      type: "number",
    },
  ];
  const model = {
    text: "xyz",
    list: "k2",
    checkbox: true,
    number: "7",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormlyService],
    });

    injector = getTestBed();
    service = injector.inject(FormlyService);
  });

  it("json2Form - empty schema", () => {
    let form = service.json2Form(null, {});
    expect(form).not.toBeUndefined();
    expect(form["fields"]).not.toBeUndefined();
    expect(form["model"]).not.toBeUndefined();
    expect(form["fields"]).toEqual([]);
    expect(form["model"]).toEqual({});
  });

  it("json2Form - empty model", () => {
    let form = service.json2Form(schema, {});
    expect(form).not.toBeUndefined();
    expect(form["fields"]).not.toBeUndefined();
    expect(form["model"]).not.toBeUndefined();
    expect(form["fields"]).not.toEqual([]);
    expect(form["model"]).not.toEqual({});
    expect(form["model"]["text"]).toBeUndefined();
    expect(form["model"]["list"]).toBeUndefined();
    expect(form["model"]["checkbox"]).not.toBeUndefined();
    expect(form["model"]["checkbox"]).toEqual(false);
    expect(form["model"]["number"]).toBeUndefined();
  });

  it("json2Form - empty model with defaults", () => {
    let form = service.json2Form(schema_with_defaults, {});
    expect(form).not.toBeUndefined();
    expect(form["fields"]).not.toBeUndefined();
    expect(form["model"]).not.toBeUndefined();
    expect(form["fields"]).not.toEqual([]);
    expect(form["model"]).not.toEqual({});
    expect(form["model"]["text"]).not.toBeUndefined();
    expect(form["model"]["text"]).toEqual("default text");
    expect(form["model"]["list"]).not.toBeUndefined();
    expect(form["model"]["list"]).toEqual("k1");
    expect(form["model"]["checkbox"]).not.toBeUndefined();
    expect(form["model"]["checkbox"]).toEqual(true);
    expect(form["model"]["number"]).not.toBeUndefined();
    expect(form["model"]["number"]).toEqual(42);
  });

  it("json2Form - with model", () => {
    let form = service.json2Form(schema, model);
    expect(form).not.toBeUndefined();
    expect(form["fields"]).not.toBeUndefined();
    expect(form["model"]).not.toBeUndefined();
    expect(form["fields"]).not.toEqual([]);
    expect(form["model"]).not.toEqual({});
    expect(form["model"]["text"]).not.toBeUndefined();
    expect(form["model"]["text"]).toEqual("xyz");
    expect(form["model"]["list"]).not.toBeUndefined();
    expect(form["model"]["list"]).toEqual("k2");
    expect(form["model"]["checkbox"]).not.toBeUndefined();
    expect(form["model"]["checkbox"]).toEqual(true);
    expect(form["model"]["number"]).not.toBeUndefined();
    expect(form["model"]["number"]).toEqual(7);
  });

  it("getField", () => {
    let form = service.getField(
      { mykey: "myval" },
      "string",
      "mykey",
      "My Field",
      true,
      "My descr"
    );
    expect(form).not.toBeUndefined();
    expect(form["fields"]).not.toBeUndefined();
    expect(form["model"]).not.toBeUndefined();
    expect(form["fields"]).not.toEqual([]);
    expect(form["model"]).not.toEqual({});
    expect(form["fields"][0].key).toEqual("mykey");
    expect(form["fields"][0].type).toEqual("input");
    expect(form["fields"][0].templateOptions).not.toBeUndefined();
    expect(form["fields"][0].templateOptions.label).toEqual("My Field");
    expect(form["fields"][0].templateOptions.placeholder).toEqual("My descr");
    expect(form["fields"][0].templateOptions.type).toEqual("text");
    expect(form["fields"][0].templateOptions.required).toBeTruthy();
    expect(form["model"]["mykey"]).not.toBeUndefined();
    expect(form["model"]["mykey"]).toEqual("myval");

    for (let d of ["0", "false", "False", "off"]) {
      form = service.getField(
        { mykey: d },
        "checkbox",
        "mykey",
        "My Field",
        true,
        "My descr"
      );
      // checkbox is defaulted to FALSE
      expect(form["fields"]).not.toEqual([]);
      expect(form["fields"][0].key).toEqual("mykey");
      expect(form["fields"][0].type).toEqual("checkbox");
      expect(form["fields"][0].templateOptions).not.toBeUndefined();
      expect(form["fields"][0].templateOptions.label).toEqual("My Field");
      expect(form["fields"][0].templateOptions.placeholder).toEqual("My descr");
      expect(form["fields"][0].templateOptions.type).toEqual("checkbox");
      expect(form["fields"][0].templateOptions.required).toBeTruthy();
      expect(form["fields"][0].defaultValue).toBeUndefined();
    }

    for (let d of ["1", "true", "True", "on"]) {
      form = service.getField(
        { mykey: d },
        "checkbox",
        "mykey",
        "My Field",
        true,
        "My descr"
      );
      expect(form["fields"]).not.toEqual([]);
      expect(form["fields"][0].key).toEqual("mykey");
      expect(form["fields"][0].type).toEqual("checkbox");
      expect(form["fields"][0].templateOptions).not.toBeUndefined();
      expect(form["fields"][0].templateOptions.label).toEqual("My Field");
      expect(form["fields"][0].templateOptions.placeholder).toEqual("My descr");
      expect(form["fields"][0].templateOptions.type).toEqual("checkbox");
      expect(form["fields"][0].templateOptions.required).toBeTruthy();
      expect(form["fields"][0].defaultValue).toBeTruthy();
    }

    form = service.getField(
      { mykey: "strange value" },
      "checkbox",
      "mykey",
      "My Field",
      true,
      "My descr"
    );
    expect(form["fields"]).not.toEqual([]);
    expect(form["fields"][0].key).toEqual("mykey");
    expect(form["fields"][0].type).toEqual("checkbox");
    expect(form["fields"][0].templateOptions).not.toBeUndefined();
    expect(form["fields"][0].templateOptions.label).toEqual("My Field");
    expect(form["fields"][0].templateOptions.placeholder).toEqual("My descr");
    expect(form["fields"][0].templateOptions.type).toEqual("checkbox");
    expect(form["fields"][0].templateOptions.required).toBeTruthy();
    expect(form["fields"][0].defaultValue).toBeTruthy();

    form = service.getField(
      {},
      "checkbox",
      "mykey",
      "My Field",
      true,
      "My descr"
    );
    expect(form["fields"]).not.toEqual([]);
    expect(form["fields"][0].key).toEqual("mykey");
    expect(form["fields"][0].type).toEqual("checkbox");
    expect(form["fields"][0].templateOptions).not.toBeUndefined();
    expect(form["fields"][0].templateOptions.label).toEqual("My Field");
    expect(form["fields"][0].templateOptions.placeholder).toEqual("My descr");
    expect(form["fields"][0].templateOptions.type).toEqual("checkbox");
    expect(form["fields"][0].templateOptions.required).toBeTruthy();
    expect(form["fields"][0].defaultValue).toBeFalsy();

    form = service.getField(
      { mykey: "a" },
      "select",
      "mykey",
      "My Field",
      true,
      "My descr",
      { a: "AAA", b: "BBB" }
    );
    expect(form["fields"]).not.toEqual([]);
    expect(form["fields"][0].key).toEqual("mykey");
    expect(form["fields"][0].type).toEqual("select");
    expect(form["fields"][0].templateOptions).not.toBeUndefined();
    expect(form["fields"][0].templateOptions.label).toEqual("My Field");
    expect(form["fields"][0].templateOptions.description).toEqual("My descr");
    expect(form["fields"][0].templateOptions.placeholder).toBeUndefined();
    expect(form["fields"][0].templateOptions.type).toEqual("select");
    expect(form["fields"][0].templateOptions.required).toBeTruthy();
    expect(form["fields"][0].defaultValue).toBeTruthy();
  });

  it("formatDate", () => {
    expect(service.formatDate(null)).toBeNull();
    expect(service.formatDate("")).toEqual("");
    expect(service.formatDate("01 Jan 1970 00:00:00 GMT")).toEqual(
      "1970-01-01"
    );
    expect(service.formatDate("01/31/1970")).toEqual("1970-01-31");
    expect(service.formatDate("01/31/1970")).toEqual("1970-01-31");
    expect(service.formatDate("1/1/1970")).toEqual("1970-01-01");
    expect(service.formatDate("10/31/1970")).toEqual("1970-10-31");
  });

  it("formatNgbDatepicker", () => {
    expect(service.formatNgbDatepicker(null)).toBeNull();
    expect(service.formatNgbDatepicker("")).toBeNull();
    expect(service.formatNgbDatepicker("01/31/1970")).toEqual(
      new Date("01/31/1970")
    );
    expect(service.formatNgbDatepicker("1/31/1970")).toEqual(
      new Date("01/31/1970")
    );
    expect(service.formatNgbDatepicker("1/4/1970")).toEqual(
      new Date("01/04/1970")
    );
    expect(service.formatNgbDatepicker("1/04/1970")).toEqual(
      new Date("01/04/1970")
    );
  });

  it("getNgbDateStruct", () => {
    const d = new Date("01/31/1970");
    expect(service.getNgbDateStruct(d)).toEqual({
      year: 1970,
      month: 1,
      day: 31,
    });
    expect(service.getNgbDateStruct("01/31/1970")).toEqual({
      year: 1970,
      month: 1,
      day: 31,
    });
    expect(service.getNgbDateStruct("01/31/1970 23:59:59")).toEqual({
      year: 1970,
      month: 1,
      day: 31,
    });
  });
});
