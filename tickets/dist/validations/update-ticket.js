"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketValidation = void 0;
const express_validator_1 = require("express-validator");
exports.updateTicketValidation = [
    express_validator_1.body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    express_validator_1.body('price')
        .not()
        .isEmpty()
        .withMessage('Price is required')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0')
];
//# sourceMappingURL=update-ticket.js.map