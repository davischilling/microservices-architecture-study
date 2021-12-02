"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showPayment = void 0;
const common_1 = require("@wymaze/common");
const Payment_1 = require("../models/Payment");
exports.showPayment = async (req, res) => {
    const payment = await Payment_1.Payment.findById(req.params.id);
    if (!payment) {
        throw new common_1.NotFoundError();
    }
    res.status(200).send(payment);
};
//# sourceMappingURL=show-payment.js.map