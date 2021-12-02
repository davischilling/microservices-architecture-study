"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expirationQueue = void 0;
const nats_wrapper_1 = require("./../nats-wrapper");
const expiration_complete_1 = require("./../events/publishers/expiration-complete");
const bull_1 = __importDefault(require("bull"));
const expirationQueue = new bull_1.default('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});
exports.expirationQueue = expirationQueue;
expirationQueue.process(async (job) => {
    new expiration_complete_1.ExpirationCompletePublisher(nats_wrapper_1.natsWrapper.client).publish({
        orderId: job.data.orderId
    });
});
//# sourceMappingURL=expiration.js.map