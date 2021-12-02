"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPayment = void 0;
const stripe_1 = require("./../stripe");
const Order_1 = require("../models/Order");
const common_1 = require("@wymaze/common");
const Payment_1 = require("../models/Payment");
const payment_created_1 = require("../events/publishers/payment-created");
const nats_wrapper_1 = require("../nats-wrapper");
exports.newPayment = async (req, res) => {
    const { token, orderId } = req.body;
    const order = await Order_1.Order.findById(orderId);
    if (!order) {
        throw new common_1.NotFoundError();
    }
    if (order.userId !== req.currentUser.id) {
        throw new common_1.NotFoundError();
    }
    if (order.status === common_1.OrderStatus.Cancelled) {
        throw new common_1.BadRequestError('Cannot pay for an cancelled order ');
    }
    const charge = await stripe_1.stripe.charges.create({
        currency: 'eur',
        amount: order.price * 100,
        source: token
    });
    const payment = Payment_1.Payment.build({
        orderId: order.id,
        stripeId: charge.id
    });
    await payment.save();
    new payment_created_1.PaymentCreatedPublisher(nats_wrapper_1.natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });
    res.status(201).send(payment);
};
//# sourceMappingURL=new-payment.js.map