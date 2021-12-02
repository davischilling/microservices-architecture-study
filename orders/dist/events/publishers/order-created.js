"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreatedPublisher = void 0;
const common_1 = require("@wymaze/common");
class OrderCreatedPublisher extends common_1.Publisher {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.OrderCreated;
    }
}
exports.OrderCreatedPublisher = OrderCreatedPublisher;
//# sourceMappingURL=order-created.js.map