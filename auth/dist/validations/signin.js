"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinValidation = void 0;
const express_validator_1 = require("express-validator");
exports.signinValidation = [
    express_validator_1.body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    express_validator_1.body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
];
//# sourceMappingURL=signin.js.map