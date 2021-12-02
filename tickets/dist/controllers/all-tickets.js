"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTickets = void 0;
const common_1 = require("@wymaze/common");
const Ticket_1 = require("../models/Ticket");
exports.allTickets = async (req, res) => {
    const tickets = await Ticket_1.Ticket.find({
        orderId: undefined
    });
    if (!tickets) {
        throw new common_1.NotFoundError();
    }
    res.status(200).send(tickets);
};
//# sourceMappingURL=all-tickets.js.map