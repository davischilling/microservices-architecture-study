"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signoutCtrl = void 0;
exports.signoutCtrl = async (req, res) => {
    req.session = null;
    res.send({});
};
//# sourceMappingURL=signout.js.map