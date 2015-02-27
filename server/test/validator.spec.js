var expect = require('chai').expect;

var Validator = require('./../helpers/validator.js');

describe('Validator', function () {

    var validator = null;
    beforeEach(function () {
        validator = new Validator();

    });

    it('getErrors should return an error object', function () {
        var errors = validator.getErrors();

        expect(errors).to.be.an('object');
    });

    it('should validate a required field', function () {

        var rule = {
            value: '',
            field: 'name',
            rules: ['required']
        };

        validator.addRule(rule);

        var valid = validator.validate();

        var errors = validator.getErrors();

        expect(errors).to.be.an('object');
        expect(valid).to.be.false;

    });

    it('should validate an email', function () {
        var rule = {
            value: 'redmond@gmail.com',
            field: 'email',
            rules: ['email']
        };

        validator.addRule(rule);

        var valid = validator.validate();

        var errors = validator.getErrors();

        expect(errors).to.be.an('object');
        expect(valid).to.be.true;
    });

    it('should return the first error that happens', function () {
        var rule = {
            value: '',
            field: 'name',
            rules: ['required', 'email']
        };

        validator.addRule(rule);

        var valid = validator.validate();

        var errors = validator.getErrors();

        expect(errors.name).to.equal('name must be a valid email');
    });

    it('should return two errors', function () {
        var rule = {
            value: '',
            field: 'name',
            rules: ['required']
        };

        validator.addRule(rule);

        var rule1 = {
            value: 'remdondp@gmail',
            field: 'email',
            rules: ['email']
        };

        validator.addRule(rule1);

        var valid = validator.validate();

        var errors = validator.getErrors();

        expect(errors).to.include.keys('name');
        expect(errors).to.include.keys('email');

    });

    it('should compare two values', function () {
        var rule = {
            vale: 'abc1234',
            field: 'password',
            rules: ['compare'],
            options: {
                compare: 'abc1234'
            }
        };

        var valid = validator.validate();

        expect(valid).to.be.true;
    });
});