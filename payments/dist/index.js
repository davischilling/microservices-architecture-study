"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const nats_wrapper_1 = require("./nats-wrapper");
const listeners_1 = require("./events/listeners");
const start = async () => {
    console.log('Starting payments...');
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }
    try {
        await nats_wrapper_1.natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        nats_wrapper_1.natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        process.on('SIGINT', () => nats_wrapper_1.natsWrapper.client.close());
        process.on('SIGTERM', () => nats_wrapper_1.natsWrapper.client.close());
        new listeners_1.OrderCreatedListener(nats_wrapper_1.natsWrapper.client).listen();
        new listeners_1.OrderCancelledListener(nats_wrapper_1.natsWrapper.client).listen();
        await mongoose_1.default.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connect to mongodb');
        app_1.default.listen(3000, () => {
            console.log('Listening on port 3000!!!!!');
        });
    }
    catch (err) {
        console.log(err);
    }
};
start();
//# sourceMappingURL=index.js.map