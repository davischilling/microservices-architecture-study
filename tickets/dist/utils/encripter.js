"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encripter = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const scryptAsync = util_1.promisify(crypto_1.scrypt);
class Encripter {
    static async toHash(password) {
        const salt = crypto_1.randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64));
        return `${buf.toString('hex')}.${salt}`;
    }
    static async compare(storedPassword, supliedPassword) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(supliedPassword, salt, 64));
        return buf.toString('hex') === hashedPassword;
    }
}
exports.Encripter = Encripter;
//# sourceMappingURL=encripter.js.map