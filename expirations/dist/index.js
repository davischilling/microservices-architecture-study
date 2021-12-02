"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_created_1 = require("./events/listeners/order-created");
const nats_wrapper_1 = require("./nats-wrapper");
const start = async () => {
    console.log('Starting expirations...');
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
        new order_created_1.OrderCreatedListener(nats_wrapper_1.natsWrapper.client).listen();
    }
    catch (err) {
        console.log(err);
    }
};
start();
//# sourceMappingURL=index.js.map