"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketCreatedListener = void 0;
const Ticket_1 = require("../../models/Ticket");
const common_1 = require("@wymaze/common");
const queue_group_name_1 = require("./queue-group-name");
class TicketCreatedListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.TicketCreated;
        this.queueGroupName = queue_group_name_1.queueGroupName;
    }
    async onMessage(data, msg) {
        const { id, title, price } = data;
        const ticket = Ticket_1.Ticket.build({
            id, title, price
        });
        await ticket.save();
        msg.ack();
    }
}
exports.TicketCreatedListener = TicketCreatedListener;
//# sourceMappingURL=ticket-created.js.map