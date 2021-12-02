"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showOrder = void 0;
const common_1 = require("@wymaze/common");
const Order_1 = require("../models/Order");
exports.showOrder = async (req, res) => {
    const order = await Order_1.Order.findById({
        _id: req.params.id,
        userId: req.currentUser.id
    }).populate('ticket');
    if (!order) {
        throw new common_1.NotFoundError();
    }
    if (order.userId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    res.status(200).send(order);
};
//# sourceMappingURL=show-order.js.map