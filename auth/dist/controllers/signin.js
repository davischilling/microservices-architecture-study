"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinCtrl = void 0;
const encripter_1 = require("./../utils/encripter");
const common_1 = require("@wymaze/common");
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.signinCtrl = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await user_1.User.findOne({ email });
    if (!existingUser) {
        throw new common_1.BadRequestError('Invalid Credentials');
    }
    const passwordsMatch = await encripter_1.Encripter.compare(existingUser.password, password);
    if (!passwordsMatch) {
        throw new common_1.BadRequestError('Invalid Credentials');
    }
    const userJwt = jsonwebtoken_1.default.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY);
    req.session = {
        jwt: userJwt
    };
    res.status(200).send(existingUser);
};
//# sourceMappingURL=signin.js.map