"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.stripe = {
    charges: {
        create: jest.fn().mockResolvedValue({
            id: mongoose_1.default.Types.ObjectId().toHexString()
        })
    }
};
//# sourceMappingURL=stripe.js.map