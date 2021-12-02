"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCancelledListener = void 0;
const common_1 = require("@wymaze/common");
const queue_group_name_1 = require("./queue-group-name");
const Order_1 = require("../../models/Order");
class OrderCancelledListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.OrderCancelled;
        this.queueGroupName = queue_group_name_1.queueGroupName;
    }
    async onMessage(data, msg) {
        const order = await Order_1.Order.findOne({
            _id: data.id,
            version: data.version - 1,
        });
        if (!order) {
            throw new Error('Order not found');
        }
        order.set({ status: common_1.OrderStatus.Cancelled });
        await order.save();
        msg.ack();
    }
}
exports.OrderCancelledListener = OrderCancelledListener;
//# sourceMappingURL=order-cancelled-listener.js.map