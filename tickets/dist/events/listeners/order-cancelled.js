"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCancelledListener = void 0;
const ticket_updated_1 = require("./../publishers/ticket-updated");
const queue_group_name_1 = require("./queue-group-name");
const common_1 = require("@wymaze/common");
const Ticket_1 = require("../../models/Ticket");
class OrderCancelledListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.OrderCancelled;
        this.queueGroupName = queue_group_name_1.queueGroupName;
    }
    async onMessage(data, msg) {
        const ticket = await Ticket_1.Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new common_1.NotFoundError();
        }
        ticket.set({ orderId: undefined });
        await ticket.save();
        const { id, title, price, userId, orderId, version } = ticket;
        new ticket_updated_1.TicketUpdatedPublisher(this.client).publish({
            id,
            title,
            price,
            userId,
            orderId,
            version
        });
        msg.ack();
    }
}
exports.OrderCancelledListener = OrderCancelledListener;
//# sourceMappingURL=order-cancelled.js.map