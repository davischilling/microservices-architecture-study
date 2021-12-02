"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const common_1 = require("@wymaze/common");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const orderSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(common_1.OrderStatus),
        default: common_1.OrderStatus.Created
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
orderSchema.set('versionKey', 'version');
orderSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
orderSchema.statics.findByEvent = async (event) => {
    return Order.findOne({
        _id: event.id,
        version: event.version - 1
    });
};
orderSchema.statics.build = (attrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status
    });
};
const Order = mongoose_1.default.model('Order', orderSchema);
exports.Order = Order;
//# sourceMappingURL=Order.js.map