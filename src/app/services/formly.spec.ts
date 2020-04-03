import { TestBed, getTestBed } from '@angular/core/testing';
import { FormlyService } from '@rapydo/services/formly';

describe('FormlyService', () => {
  let injector: TestBed;
  let service: FormlyService;
  let schema = getSchema();
  let model = getModel();

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
    expect(form).toContain("fields");
    expect(form).toContain("model");
    expect(form['fields']).toEqual([]);
    expect(form['model']).toEqual({});
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
    expect(form).toContain("fields");
    expect(form).toContain("model");
    expect(form['fields']).not.toEqual([]);
    expect(form['model']).not.toEqual({});
    expect(form['model']).toContain('text');
    expect(form['model']['text']).toEqual('');
  });

  it('json2Form - with model', () => {
    let form = service.json2Form(schema, model);
    expect(form).not.toBeUndefined();
    expect(form).toContain("fields");
    expect(form).toContain("model");
    expect(form['fields']).not.toEqual([]);
    expect(form['model']).not.toEqual({});
    expect(form['model']).toContain('text');
    expect(form['model']['text']).toEqual('xyz');
  });

  getSchema() {
    return [
      {
        "custom": {
            "label": "Text"
        },
        "description": "Text",
        "in": "formData",
        "name": "text",
        "required": true,
        "type": "string"
      },
      {
        "custom": {
          "label": "List"
        },
        "description": "List",
        "enum": [
          {
            "k1": "val1"
          },
          {
            "k2": "val2"
          },
        ],
        "in": "formData",
        "name": "list",
        "required": true,
        "type": "string"
      },
      {
        "custom": {
            "label": "Checkbox"
        },
        "default": true,
        "in": "formData",
        "name": "checkbox",
        "required": false,
        "type": "boolean"
      },
      {
        "custom": {
            "label": "Number"
        },
        "default": 1,
        "description": "number",
        "in": "formData",
        "name": "number",
        "required": true,
        "type": "number"
      },
    ];
  }

  getModel() {
    return {
      'text': 'xyz'
      'list': 'k2',
      'checkbox': true,
      'number': '7',
    }
  }


});