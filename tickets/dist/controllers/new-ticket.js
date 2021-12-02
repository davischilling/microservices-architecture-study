"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newTicket = void 0;
const Ticket_1 = require("../models/Ticket");
const ticket_created_1 = require("./../events/publishers/ticket-created");
const nats_wrapper_1 = require("./../nats-wrapper");
exports.newTicket = async (req, res) => {
    const { title, price } = req.body;
    const ticket = Ticket_1.Ticket.build({
        title,
        price,
        userId: req.currentUser.id
    });
    await ticket.save();
    new ticket_created_1.TicketCreatedPublisher(nats_wrapper_1.natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });
    res.status(201).send(ticket);
};
//# sourceMappingURL=new-ticket.js.map