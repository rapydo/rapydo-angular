import { TestBed, getTestBed } from '@angular/core/testing';
import { FormlyService } from '@rapydo/services/formly';

describe('FormlyService', () => {
  let injector: TestBed;
  let service: FormlyService;
  const schema = [
    {
      "custom": { "label": "Text" },
      "description": "Text",
      "in": "formData",
      "name": "text",
      "required": true,
      "type": "string"
    },
    {
      "custom": { "label": "List" },
      "description": "List",
      "enum": [
        {"k1": "val1"},
        {"k2": "val2"},
      ],
      "in": "formData",
      "name": "list",
      "required": true,
      "type": "string"
    },
    {
      "custom": { "label": "Checkbox" },
      "default": true,
      "in": "formData",
      "name": "checkbox",
      "required": false,
      "type": "boolean"
    },
    {
      "custom": { "label": "Number" },
      "default": 1,
      "description": "number",
      "in": "formData",
      "name": "number",
      "required": true,
      "type": "number"
    },
  ];
  const model = {
    'text': 'xyz',
    'list': 'k2',
    'checkbox': true,
    'number': '7',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormlyService],
    });

    injector = getTestBed();
    service = injector.get(FormlyService);
  });

  it('json2Form - empty schema', () => {
    let form = service.json2Form(undefined, {});
    expect(form).not.toBeUndefined();
    expect(form["fields"]).not.toBeUndefined();
    expect(form["model"]).not.toBeUndefined();
    expect(form["fields"]).toEqual([]);
    expect(form["model"]).toEqual({});
  });

  it('json2Form - invalid schema', () => {
    let invalid = [
      {
        "invalid": "schema",
        "missing": "name key"
      },
    ];
    expect(service.json2Form(invalid, {})).toBeNull();
  });

  it('json2Form - empty model', () => {
    let form = service.json2Form(schema, {});
    expect(form).not.toBeUndefined();
    expect(form["fields"]).not.toBeUndefined();
    expect(form["model"]).not.toBeUndefined();
    expect(form["fields"]).not.toEqual([]);
    expect(form["model"]).not.toEqual({});
    expect(form["model"]["text"]).not.toBeUndefined();
    expect(form["model"]["text"]).toEqual("");
  });

  it('json2Form - with model', () => {
    let form = service.json2Form(schema, model);
    expect(form).not.toBeUndefined();
    expect(form["fields"]).not.toBeUndefined();
    expect(form["model"]).not.toBeUndefined();
    expect(form["fields"]).not.toEqual([]);
    expect(form["model"]).not.toEqual({});
    expect(form["model"]["text"]).not.toBeUndefined();
    expect(form["model"]["text"]).toEqual("xyz");
  });

  it('getField', () => {

    let form = service.getField(
      {"mykey": "myval"},
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
    expect(form["model"]["mykey"]).not.toBeUndefined();
    expect(form["model"]["mykey"]).toEqual("myval");

  });

  it('formatDate - null', () => {
    expect(service.formatDate(null)).toBeNull();
    expect(service.formatDate("")).toEqual("");
    expect(service.formatDate("01 Jan 1970 00:00:00 GMT")).toEqual("1970-01-01");
    expect(service.formatDate("01/31/1970")).toEqual("1970-01-31");
    expect(service.formatDate("01/31/1970")).toEqual("1970-01-31");
    expect(service.formatDate("1/1/1970")).toEqual("1970-01-01");
  });

});