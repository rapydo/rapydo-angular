import { TestBed, getTestBed } from "@angular/core/testing";
import { FormControl } from "@angular/forms";
import { FormlyService } from "@rapydo/services/formly";
import { Schema, SchemaType } from "@rapydo/types";
import { emailValidator } from "@rapydo/shared.module";

describe("FormlyService", () => {
  let injector: TestBed;
  let service: FormlyService;
  const schema: Schema[] = [
    {
      label: "Text",
      description: "Text",
      key: "text",
      required: true,
      type: SchemaType.STRING,
    },
    {
      label: "List",
      description: "List",
      options: {
        k1: "val1",
        k2: "val2",
      },
      key: "list",
      required: true,
      type: SchemaType.STRING,
    },
    {
      label: "Checkbox",
      key: "checkbox",
      required: false,
      type: SchemaType.BOOLEAN,
    },
    {
      label: "Number",
      description: "number",
      key: "number",
      required: true,
      type: SchemaType.NUMBER,
    },
  ];
  const schema_with_defaults: Schema[] = [
    {
      label: "Text",
      description: "Text",
      key: "text",
      default: "default text",
      required: true,
      type: SchemaType.STRING,
    },
    {
      label: "List",
      description: "List",
      options: {
        k1: "val1",
        k2: "val2",
      },
      default: "k1",
      key: "list",
      required: true,
      type: SchemaType.STRING,
    },
    {
      label: "Checkbox",
      default: true,
      key: "checkbox",
      required: false,
      type: SchemaType.BOOLEAN,
    },
    {
      label: "Number",
      description: "number",
      default: 42,
      key: "number",
      required: true,
      type: SchemaType.NUMBER,
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

describe("EmailValidator", () => {
  // EmailValidator returns null if the email is valid (i.e. no validation error)
  // otherwise if invalid a { email: true } is returned

  // Examples of email obtained from
  // https://codefool.tumblr.com/post/15288874550/list-of-valid-and-invalid-email-addresses

  it("Valid emails", function () {
    expect(
      emailValidator(new FormControl("email@example.com"), undefined)
    ).toBeNull();
    expect(
      emailValidator(new FormControl("email@subdomain.example.com"), undefined)
    ).toBeNull();
    expect(
      emailValidator(
        new FormControl("firstname.lastname@example.com"),
        undefined
      )
    ).toBeNull();
    expect(
      emailValidator(
        new FormControl("firstname-lastname@example.com"),
        undefined
      )
    ).toBeNull();

    expect(
      emailValidator(
        new FormControl("firstname+lastname@example.com"),
        undefined
      )
    ).toBeNull();

    expect(
      emailValidator(new FormControl("email@123.123.123.123"), undefined)
    ).toBeNull();

    expect(
      emailValidator(new FormControl("1234567890@example.com"), undefined)
    ).toBeNull();
    expect(
      emailValidator(new FormControl("email@example-one.com"), undefined)
    ).toBeNull();
    expect(
      emailValidator(new FormControl("email@example.name"), undefined)
    ).toBeNull();
    expect(
      emailValidator(new FormControl("email@example.museum"), undefined)
    ).toBeNull();
    expect(
      emailValidator(new FormControl("email@example.co.jp"), undefined)
    ).toBeNull();
  });

  it("Invalid emails", function () {
    expect(emailValidator(new FormControl(""), undefined)).not.toBeNull();
    expect(
      emailValidator(new FormControl("plainaddress"), undefined)
    ).not.toBeNull();
    expect(
      emailValidator(new FormControl("#@%^%#$@#$@#.com"), undefined)
    ).not.toBeNull();
    expect(
      emailValidator(new FormControl("@example.com"), undefined)
    ).not.toBeNull();
    expect(
      emailValidator(
        new FormControl("Joe Smith <email@example.com>"),
        undefined
      )
    ).not.toBeNull();
    expect(
      emailValidator(
        new FormControl("firstname$lastname@example.com"),
        undefined
      )
    ).not.toBeNull();
    expect(
      emailValidator(
        new FormControl("firstname=lastname@example.com"),
        undefined
      )
    ).not.toBeNull();
    expect(
      emailValidator(new FormControl("email.example.com"), undefined)
    ).not.toBeNull();
    expect(
      emailValidator(new FormControl("email@example@example.com"), undefined)
    ).not.toBeNull();
    expect(
      emailValidator(new FormControl(".email@example.com"), undefined)
    ).not.toBeNull();

    expect(
      emailValidator(new FormControl("email.@example.com"), undefined)
    ).not.toBeNull();

    expect(
      emailValidator(new FormControl("email..email@example.com"), undefined)
    ).not.toBeNull();

    expect(
      emailValidator(new FormControl("あいうえお@example.com"), undefined)
    ).not.toBeNull();
    expect(
      emailValidator(
        new FormControl("email@example.com (Joe Smith)"),
        undefined
      )
    ).not.toBeNull();
    expect(
      emailValidator(new FormControl("email@example"), undefined)
    ).not.toBeNull();
    expect(
      emailValidator(new FormControl("email@-example.com"), undefined)
    ).not.toBeNull();

    expect(
      emailValidator(new FormControl("email@111.222.333.44444"), undefined)
    ).not.toBeNull();

    expect(
      emailValidator(new FormControl("email@example..com"), undefined)
    ).not.toBeNull();

    expect(
      emailValidator(new FormControl("Abc..123@example.com"), undefined)
    ).not.toBeNull();
  });
});
