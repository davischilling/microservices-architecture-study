"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPaymentValidation = void 0;
const express_validator_1 = require("express-validator");
exports.newPaymentValidation = [
    express_validator_1.body('token')
        .not()
        .isEmpty(),
    express_validator_1.body('orderId')
        .not()
        .isEmpty()
];
//# sourceMappingURL=new-payment.js.map