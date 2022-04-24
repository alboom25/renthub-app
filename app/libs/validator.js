class Validator {
    static Validate(body, validation_object) {
        var errors = this.validateObject(body, validation_object);
        var obj = {
            validation_errors: errors,
            has_errors: errors.length > 0,
        };
        return obj;
    }

    static validateObject(form, validation_object) {
        var errors = [];
        const form_fields = Object.keys(validation_object.rules);
        for (var i = 0; i < form_fields.length; i++) {
            var conditions = Object.keys(validation_object.rules[form_fields[i]]);
            var parameters = Object.values(validation_object.rules[form_fields[i]]);
            var messages = Object.values(validation_object.messages[form_fields[i]]);
            var error = this.validateFormField(form[form_fields[i]], conditions, parameters, messages, form);
            if (error.length > 0) {
                errors.push(error);
            }
        }
        return errors;
    }

    static validateFormField(form_value, field_conditions, field_params, field_messages, form) {
        for (var i = 0; i < field_conditions.length; i++) {
            var errors = this.validateSingle(form_value, field_conditions[i], field_params[i], field_messages[i], form);
            if (errors.length > 0) {
                return errors[0];
            }
        }
        return "";
    }

    static validateSingle(field_value, field_condition, field_param, field_message, form) {
        var errros = [];
        switch (field_condition) {
            case "required":
                if (field_value === undefined && field_value !== "") {
                    errros.push(field_message);
                }
                break;
            case "remote":
                break;
            case "minlength":
                if (field_value !== undefined && field_value !== "") {
                    if (field_value.length < field_param) {
                        errros.push(field_message);
                    }
                }
                break;
            case "maxlength":
                if (field_value !== undefined && field_value !== "") {
                    if (field_value.length > field_param) {
                        errros.push(field_message);
                    }
                }
                break;
            case "rangelength":
                if (field_value !== undefined && field_value !== "") {
                    var min = field_param[0];
                    var max = field_param[1];
                    if (field_value.length < min || field_value.length > max) {
                        errros.push(field_message);
                    }
                }
                break;
            case "min":
                if (field_value !== undefined && field_value !== "") {
                    if (parseInt(field_value) < field_param) {
                        errros.push(field_message);
                    }
                }
                break;
            case "max":
                if (field_value !== undefined && field_value !== "") {
                    if (parseInt(field_value) > field_param) {
                        errros.push(field_message);
                    }
                }
                break;
            case "range":
                if (field_value !== undefined && field_value !== "") {
                    var min = field_param[0];
                    var max = field_param[1];
                    if (parseInt(field_value) < min || parseInt(field_value) > max) {
                        errros.push(field_message);
                    }
                }
                break;
            case "step":
                if (field_value !== undefined && field_value !== "") {
                    var rem = parseInt(field_value) % field_value;
                    if (rem > 0) {
                        errros.push(field_message);
                    }
                }
                break;
            case "email":
                if (field_value !== undefined && field_value !== "") {
                    if (!this.is_valid_email(field_value)) {
                        errros.push(field_message);
                    }
                }
                break;
            case "url":
                if (field_value !== undefined && field_value !== "") {
                    if (!this.is_valid_url(field_value)) {
                        errros.push(field_message);
                    }
                }
                break;
            case "date":
                if (field_value !== undefined && field_value !== "") {
                    if (!this.is_valid_date(field_value)) {
                        errros.push(field_message);
                    }
                }
                break;
            case "dateISO":
                if (field_value !== undefined && field_value !== "") {
                    if (!this.is_valid_date_iso(field_value)) {
                        errros.push(field_message);
                    }
                }
                break;
            case "number":
                if (field_value !== undefined && field_value !== "") {
                    if (!this.is_valid_number(field_value)) {
                        errros.push(field_message);
                    }
                }
                break;
            case "digits":
                if (field_value !== undefined && field_value !== "") {
                    if (!this.is_valid_digits(field_value)) {
                        errros.push(field_message);
                    }
                }
                break;
            case "equalTo":
                if (field_value !== undefined && field_value !== "") {
                    var par2 = field_param.toString().substring(1, field_param.toString().length);

                    if (field_value != form[par2]) {
                        errros.push(field_message);
                    }
                }
                break;
            case "alphanumeric":
                if (field_value !== undefined && field_value !== "") {
                    if (!this.is_alphanumeric(field_value)) {
                        errros.push(field_message);
                    }
                }
                break;
            default:
        }
        return errros;
    }

    static is_valid_email(mail) {
        return /^[a-zA-Z0-9.!$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(mail);
    }

    static is_valid_url(a) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?]\S*)?$/i.test(a);
    }

    static is_valid_date(a) {
        return !/Invalid|NaN/.test(new Date(a).toString());
    }

    static is_valid_date_iso(a) {
        return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a);
    }
    static is_valid_number(a) {
        return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a);
    }

    static is_valid_digits(a) {
        return /^\d+$/.test(a);
    }

    static is_alphanumeric(a) {
        return /^[a-z0-9_ ]+$/.test(a);
    }
}

module.exports = Validator;
