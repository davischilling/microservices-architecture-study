"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicket = void 0;
const nats_wrapper_1 = require("./../nats-wrapper");
const ticket_updated_1 = require("./../events/publishers/ticket-updated");
const common_1 = require("@wymaze/common");
const Ticket_1 = require("../models/Ticket");
exports.updateTicket = async (req, res) => {
    const ticket = await Ticket_1.Ticket.findById(req.params.id);
    if (!ticket) {
        throw new common_1.NotFoundError();
    }
    if (ticket.orderId) {
        throw new common_1.BadRequestError('Cannot edit a reserved ticket');
    }
    if (ticket.userId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    const { title, price } = req.body;
    ticket.set({
        title, price
    });
    await ticket.save();
    new ticket_updated_1.TicketUpdatedPublisher(nats_wrapper_1.natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });
    res.status(200).send(ticket);
};
//# sourceMappingURL=update-ticket.js.map