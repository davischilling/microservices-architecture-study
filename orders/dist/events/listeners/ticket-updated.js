"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketUpdatedListener = void 0;
const Ticket_1 = require("../../models/Ticket");
const common_1 = require("@wymaze/common");
const queue_group_name_1 = require("./queue-group-name");
class TicketUpdatedListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.TicketUpdated;
        this.queueGroupName = queue_group_name_1.queueGroupName;
    }
    async onMessage(data, msg) {
        const { title, price } = data;
        const ticket = await Ticket_1.Ticket.findByEvent(data);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set({ title, price });
        await ticket.save();
        msg.ack();
    }
}
exports.TicketUpdatedListener = TicketUpdatedListener;
//# sourceMappingURL=ticket-updated.js.map