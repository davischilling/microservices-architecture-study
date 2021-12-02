"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreatedListener = void 0;
const ticket_updated_1 = require("./../publishers/ticket-updated");
const queue_group_name_1 = require("./queue-group-name");
const common_1 = require("@wymaze/common");
const Ticket_1 = require("../../models/Ticket");
class OrderCreatedListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.OrderCreated;
        this.queueGroupName = queue_group_name_1.queueGroupName;
    }
    async onMessage(data, msg) {
        // Find the ticket that the order is reserving
        const ticket = await Ticket_1.Ticket.findById(data.ticket.id);
        // If no ticket, throw error
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: data.id });
        // Save the ticket
        await ticket.save();
        const { id, title, price, userId, orderId, version } = ticket;
        await new ticket_updated_1.TicketUpdatedPublisher(this.client).publish({
            id,
            version,
            title,
            price,
            userId,
            orderId
        });
        // Ack the message
        msg.ack();
    }
}
exports.OrderCreatedListener = OrderCreatedListener;
//# sourceMappingURL=order-created.js.map