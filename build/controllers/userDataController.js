"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const userDataQueries_1 = require("../data/userDataQueries");
const authenticator_1 = require("../services/authenticator");
class UserDataController {
    constructor() {
        this.controlGetLoggedUserData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const verifiedToken = (0, authenticator_1.getTokenData)(token);
                if (!verifiedToken) {
                    res.statusCode = 401;
                    throw new Error("Unauthorized");
                }
                const user = yield (0, userDataQueries_1.getUserData)(verifiedToken.id);
                res.status(200).send(user);
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
        this.controlGetUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const token = req.headers.authorization;
                const verifiedToken = (0, authenticator_1.getTokenData)(token);
                if (!verifiedToken) {
                    res.statusCode = 401;
                    throw new Error("Unauthorized");
                }
                const user = yield (0, userDataQueries_1.getUserData)(id);
                res.status(200).send(user);
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
    }
}
exports.default = UserDataController;
