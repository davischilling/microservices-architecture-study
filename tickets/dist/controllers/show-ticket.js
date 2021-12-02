"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showTicket = void 0;
const common_1 = require("@wymaze/common");
const Ticket_1 = require("../models/Ticket");
exports.showTicket = async (req, res) => {
    const ticket = await Ticket_1.Ticket.findById(req.params.id);
    if (!ticket) {
        throw new common_1.NotFoundError();
    }
    res.status(200).send(ticket);
};
//# sourceMappingURL=show-ticket.js.map