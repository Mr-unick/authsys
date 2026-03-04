import { FieldType, FormInstance, InputField } from "./instances";

/**
 * Builder class for generating dynamic form configurations for the frontend.
 * Uses the Builder pattern for fluent API.
 */
export class GenerateForm {
    private form: FormInstance;
    private fields: InputField[] = [];
    private field!: InputField;

    constructor(name: string, method: string = 'post') {
        this.form = {
            title: name,
            fields: this.fields,
            submiturl: '',
            method,
        };
    }

    addField(name: string, type: FieldType): this {
        let newplaceholder = name.replace(/_/g, ' ');
        newplaceholder = newplaceholder.charAt(0).toUpperCase() + newplaceholder.slice(1);

        this.field = {
            name,
            disabled: false,
            label: newplaceholder,
            type,
            required: false,
            newRow: false,
            placeholder: type === 'select' ? `Select ${newplaceholder}` : `Enter ${newplaceholder}`,
            value: null,
            options: [],
        };

        this.fields.push(this.field);
        return this;
    }

    required(): this {
        this.field.required = true;
        return this;
    }

    disabled(): this {
        this.field.disabled = true;
        return this;
    }

    value(value: string | number | boolean | null | undefined | number[] | string[]): this {
        this.field.value = value ?? null;
        return this;
    }

    label(label: string): this {
        this.field.label = label;
        return this;
    }

    newRow(): this {
        this.field.newRow = true;
        return this;
    }

    options(options: Array<any>): this {
        this.field.options = options;
        return this;
    }

    submiturl(url: string): this {
        this.form.submiturl = url;
        return this;
    }

    method(method: "post" | "put"): this {
        this.form.method = method;
        return this;
    }

    getForm(): FormInstance {
        return this.form;
    }
}
