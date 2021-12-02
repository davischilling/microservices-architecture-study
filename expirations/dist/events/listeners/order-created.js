"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreatedListener = void 0;
const queue_group_name_1 = require("./queue-group-name");
const common_1 = require("@wymaze/common");
const expiration_1 = require("../../queues/expiration");
class OrderCreatedListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.OrderCreated;
        this.queueGroupName = queue_group_name_1.queueGroupName;
    }
    async onMessage(data, msg) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expiration_1.expirationQueue.add({
            orderId: data.id
        }, {
            delay
        });
        msg.ack();
    }
}
exports.OrderCreatedListener = OrderCreatedListener;
//# sourceMappingURL=order-created.js.map