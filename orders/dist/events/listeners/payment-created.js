"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCreatedListener = void 0;
const Order_1 = require("../../models/Order");
const common_1 = require("@wymaze/common");
const queue_group_name_1 = require("./queue-group-name");
class PaymentCreatedListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.PaymentCreated;
        this.queueGroupName = queue_group_name_1.queueGroupName;
    }
    async onMessage(data, msg) {
        const order = await Order_1.Order.findById(data.orderId);
        if (!order) {
            throw new common_1.NotFoundError();
        }
        order.set({ status: common_1.OrderStatus.Complete });
        await order.save();
        msg.ack();
    }
}
exports.PaymentCreatedListener = PaymentCreatedListener;
//# sourceMappingURL=payment-created.js.map