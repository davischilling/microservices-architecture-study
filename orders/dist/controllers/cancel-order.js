"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = void 0;
const nats_wrapper_1 = require("../nats-wrapper");
const order_cancelled_1 = require("../events/publishers/order-cancelled");
const common_1 = require("@wymaze/common");
const Order_1 = require("../models/Order");
exports.cancelOrder = async (req, res) => {
    const order = await Order_1.Order.findById(req.params.id).populate('ticket');
    if (!order) {
        throw new common_1.NotFoundError();
    }
    if (order.userId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    order.status = common_1.OrderStatus.Cancelled;
    await order.save();
    new order_cancelled_1.OrderCancelledPublisher(nats_wrapper_1.natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });
    res.status(200).send(order);
};
//# sourceMappingURL=cancel-order.js.map