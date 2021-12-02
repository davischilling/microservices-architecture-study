"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiV1Router = void 0;
const validations_1 = require("./../validations");
const common_1 = require("@wymaze/common");
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.apiV1Router = router;
router.post('/new-ticket', common_1.requireAuth, validations_1.newTicketValidation, common_1.validateRequest, controllers_1.newTicket);
router.get('/:id', controllers_1.showTicket);
router.get('/', controllers_1.allTickets);
router.put('/update-ticket/:id', common_1.requireAuth, validations_1.updateTicketValidation, common_1.validateRequest, controllers_1.updateTicket);
//# sourceMappingURL=ap1-v1.js.map