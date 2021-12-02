"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allPayments = void 0;
const common_1 = require("@wymaze/common");
const Payment_1 = require("../models/Payment");
exports.allPayments = async (req, res) => {
    const payments = await Payment_1.Payment.find({});
    if (!payments) {
        throw new common_1.NotFoundError();
    }
    res.status(200).send(payments);
};
//# sourceMappingURL=all-payments.js.map