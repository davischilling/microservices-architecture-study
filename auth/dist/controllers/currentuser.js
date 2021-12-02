"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUserCtrl = void 0;
exports.currentUserCtrl = async (req, res) => {
    res.send({ currentUser: req.currentUser || null });
};
//# sourceMappingURL=currentuser.js.map