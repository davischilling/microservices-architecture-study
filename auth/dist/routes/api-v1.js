"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiV1Router = void 0;
const common_1 = require("@wymaze/common");
const express_1 = __importDefault(require("express"));
const validations_1 = require("./../validations");
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.apiV1Router = router;
router.post('/signup', validations_1.signupValidation, common_1.validateRequest, controllers_1.signupCtrl);
router.post('/signin', validations_1.signinValidation, common_1.validateRequest, controllers_1.signinCtrl);
router.post('/signout', controllers_1.signoutCtrl);
router.get('/current-user', common_1.currentUser, controllers_1.currentUserCtrl);
//# sourceMappingURL=api-v1.js.map