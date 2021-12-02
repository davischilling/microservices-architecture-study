"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpirationCompleteListener = void 0;
const Order_1 = require("../../models/Order");
const common_1 = require("@wymaze/common");
const queue_group_name_1 = require("./queue-group-name");
const order_cancelled_1 = require("../publishers/order-cancelled");
class ExpirationCompleteListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.ExpirationComplete;
        this.queueGroupName = queue_group_name_1.queueGroupName;
    }
    async onMessage(data, msg) {
        const order = await Order_1.Order.findById(data.orderId).populate('ticket');
        if (!order) {
            throw new common_1.NotFoundError();
        }
        if (order.status === common_1.OrderStatus.Complete) {
            return msg.ack();
        }
        order.set({
            status: common_1.OrderStatus.Cancelled
        });
        await order.save();
        await new order_cancelled_1.OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });
        msg.ack();
    }
}
exports.ExpirationCompleteListener = ExpirationCompleteListener;
//# sourceMappingURL=expiration-complete.js.map