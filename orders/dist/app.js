"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
require("express-async-errors");
const cookie_session_1 = __importDefault(require("cookie-session"));
const common_1 = require("@wymaze/common");
const ap1_v1_1 = require("./routes/ap1-v1");
const app = express_1.default();
app.set('trust proxy', true);
app.use(body_parser_1.json());
app.use(cookie_session_1.default({
    signed: false,
    secure: false
}));
app.use(common_1.currentUser);
app.use('/api/orders', ap1_v1_1.apiV1Router);
app.all('*', async (req, res) => {
    throw new common_1.NotFoundError();
});
app.use(common_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map