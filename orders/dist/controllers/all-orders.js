"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allOrders = void 0;
const common_1 = require("@wymaze/common");
const Order_1 = require("../models/Order");
exports.allOrders = async (req, res) => {
    const orders = await Order_1.Order.find({
        userId: req.currentUser.id
    }).populate('ticket');
    if (!orders) {
        throw new common_1.NotFoundError();
    }
    res.status(200).send(orders);
};
//# sourceMappingURL=all-orders.js.map