"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupCtrl = void 0;
const common_1 = require("@wymaze/common");
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.signupCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    const existingUser = await user_1.User.findOne({ email });
    if (existingUser) {
        throw new common_1.BadRequestError('Email in use');
    }
    const user = user_1.User.build({ email, password });
    await user.save();
    const userJwt = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY);
    req.session = {
        jwt: userJwt
    };
    res.status(201).send(user);
};
//# sourceMappingURL=signup.js.map