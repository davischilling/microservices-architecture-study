"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newOrderValidation = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
exports.newOrderValidation = [
    express_validator_1.body('ticketId')
        .not()
        .isEmpty()
        .custom((input) => mongoose_1.default.Types.ObjectId.isValid(input))
        .withMessage('ticketId is required'),
];
//# sourceMappingURL=new-order.js.map