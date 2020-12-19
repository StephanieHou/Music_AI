const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisteration(data) {
    let errors = {};

    data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
    data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.cpassword = !isEmpty(data.cpassword) ? data.cpassword : "";

    if (Validator.isEmpty(data.first_name)) {
        errors.first_name = "First Name Field Is Required";
    }

    if (Validator.isEmpty(data.last_name)) {
        errors.last_name = "Last Name Field Is Required";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Email Field Is Required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email Is Invalid";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password Field Is Required";
    }

    if (Validator.isEmpty(data.cpassword)) {
        errors.cpassword = "Confirm Password Field Is Required";
    }

    if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
        errors.password = "Password Must Be At Least 8 Characters";
    }
    if (!Validator.equals(data.password, data.cpassword)) {
        errors.cpassword = "Passwords Must Match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};