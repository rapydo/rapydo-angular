import { TestBed, getTestBed } from '@angular/core/testing';
import { FormlyService } from '@rapydo/services/formly';

describe('FormlyService', () => {
  let injector: TestBed;
  let service: FormlyService;
  const schema = [
    {
      "custom": { "label": "Text" },
      "description": "Text",
      "name": "text",
      "required": true,
      "type": "string"
    },
    {
      "custom": { "label": "List" },
      "description": "List",
      "enum": {
        "k1": "val1",
        "k2": "val2",
      },
      "name": "list",
      "required": true,
      "type": "string"
    },
    {
      "custom": { "label": "Checkbox" },
      "name": "checkbox",
      "required": false,
      "type": "boolean"
    },
    {
      "custom": { "label": "Number" },
      "description": "number",
      "name": "number",
      "required": true,
      "type": "number"
    },
  ];
  const schema_with_defaults = [
    {
      "custom": { "label": "Text" },
      "description": "Text",
      "name": "text",
      "default": "default text",
      "required": true,
      "type": "string"
    },
    {
      "custom": { "label": "List" },
      "description": "List",
      "enum": {
        "k1": "val1",
        "k2": "val2",
      },
      "default": "k1",
      "name": "list",
      "required": true,
      "type": "string"
    },
    {
      "custom": { "label": "Checkbox" },
      "default": true,
      "name": "checkbox",
      "required": false,
      "type": "boolean"
    },
    {
      "custom": { "label": "Number" },
      "description": "number",
      "default": 42,
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
    service = injector.inject(FormlyService);
  });

  it('json2Form - empty schema', () => {
    let form = service.json2Form(undefined, {});
    expect(form).not.toBeUndefined();
    expect(form["fields"]).not.toBeUndefined();
    expect(form["model"]).not.toBeUndefined();
    expect(form["fields"]).toEqual([]);
    expect(form["model"]).toEqual({});
  });

  it('json2Form - empty model', () => {
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

  it('json2Form - empty model wth defaults', () => {
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

  it('json2Form - with model', () => {
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