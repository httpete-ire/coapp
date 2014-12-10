/*jshint strict:false */
var _ = require('underscore');

/**
 * Validate form data and return errors if they exist
 */
function Validator () {
    this.errors = {};
    this.rules = {};
}

/**
 * add a validation rule to the validator
 * rules are in an array
 * addtional options are attached to an object
 * @param {Object} opts :: object containing validation rules
 */
Validator.prototype.addRule = function(opts) {
    // create an object for a field
    this.rules[opts.field] = {};

    // assigning the values of the obts object
    // to a field in the validation object
    this.rules[opts.field].value = opts.value;
    this.rules[opts.field].rules = opts.rules;
    if (opts.options) {
        this.rules[opts.field].options = opts.options;
    }

};

/**
 * returns if there is an error in the validator object
 * @type {Boolean}
 */
Validator.prototype.isValid = function() {
    return _.isEmpty(this.errors);
};

/**
 * sets an error message using the name of the field
 */
Validator.prototype.setError = function(fieldName, msg) {
    this.errors[fieldName] = msg;
};

/**
 * validate a rule using the fields, value and / or options
 * @param {Object} validRules :: object that
 * contains the field, value and optionss
 *
 * @return {Boolean} :: returns if the rule was valid
 */
Validator.prototype.validateRule = function(validRules) {
    var valid = true;

    // using the rule, run the correct validation function
    switch (validRules.rule) {

        case 'compare' :
            // compare the value of the field to the value in
            // the options (opts) object
            valid = compareValues(validRules.value, validRules.opts.compare);

            if (!valid) {
                this.setError(validRules.name, validRules.name + ' does not match');
            }
            break;

        case 'email':
            // check if the value is a valid email
            valid = validEmail(validRules.value);

            if (!valid) {
                this.setError(validRules.name, validRules.name + ' must be a valid email');
            }
            break;

        case 'required':
            // check if the value is set
            valid = required(validRules.value);

            if (!valid) {
                this.setError(validRules.name, validRules.name + ' is required');
            }
            break;

    }

    return valid;
}

/**
 * validate every rule added using the add rule method
 * @return {Boolean} :: returns if the form is valid or not
 */
Validator.prototype.validate = function() {

    // store the validator object
    var _this = this;

    // loop through validators rules
    for ( var fieldName in this.rules) {

        // get specific rule
        var field = this.rules[fieldName];

        // ensure field has a rule
        if(field.rules) {

            // loop over every rule and pass an object to the validate method
            // containing the 'field name', 'value', 'rule'
            // and the options object
            _.each(field.rules, function (rule) {

                // validate the rule
                _this.validateRule({
                    name: fieldName,
                    value: field.value,
                    rule: rule,
                    opts: field.options
                });

            });

        }

    }

    return this.isValid(); // return if there is an error
};

/**
 * return the error object
 * @return {Object} :: object containgin errors and messages
 */
Validator.prototype.getErrors = function() {
    return this.errors;
};


//
//
// Validation methods
//
//

/**
 * Regular expressions for validations
 *
 */
var regex = {
    email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
}


/**
 * check if email matchs the email reqex
 * @param  {String} email :: email to check
 * @return {boolean} ::
 */
function validEmail (email) {
    return regex.email.test(email);
}

/**
 * check if one value matches a second value
 * @param  {String} value1 :: first value to compare
 * @param  {String} value2 :: second value to compare
 * @return {Boolean}       :: return if first value matches second
 */
function compareValues (value1, value2) {
    return value1 === value2;
}

/**
 * check if a value is not empty
 * @param  {String}  str :: value to check
 * @return {Boolean}
 */
function required (str) {
    return (str);
}

// export the validator object
module.exports =  Validator;