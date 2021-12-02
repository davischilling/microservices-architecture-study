"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreatedListener = void 0;
const common_1 = require("@wymaze/common");
const queue_group_name_1 = require("./queue-group-name");
const Order_1 = require("../../models/Order");
class OrderCreatedListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.OrderCreated;
        this.queueGroupName = queue_group_name_1.queueGroupName;
    }
    async onMessage(data, msg) {
        const order = Order_1.Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version,
        });
        await order.save();
        msg.ack();
    }
}
exports.OrderCreatedListener = OrderCreatedListener;
//# sourceMappingURL=order-created-listener.js.map