"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newOrder = void 0;
const order_created_1 = require("./../events/publishers/order-created");
const nats_wrapper_1 = require("../nats-wrapper");
const Order_1 = require("../models/Order");
const Ticket_1 = require("../models/Ticket");
const common_1 = require("@wymaze/common");
const EXPIRATION_WINDOW_SECONDS = 15 * 60;
exports.newOrder = async (req, res) => {
    const { ticketId } = req.body;
    const ticket = await Ticket_1.Ticket.findById(ticketId);
    if (!ticket) {
        throw new common_1.NotFoundError();
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
        throw new common_1.BadRequestError('Ticket is already reserved');
    }
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    const order = Order_1.Order.build({
        userId: req.currentUser.id,
        status: common_1.OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });
    await order.save();
    new order_created_1.OrderCreatedPublisher(nats_wrapper_1.natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    });
    res.status(201).send(order);
};
//# sourceMappingURL=new-order.js.map