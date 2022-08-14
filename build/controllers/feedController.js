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
const feedQueries_1 = require("../data/feedQueries");
const authenticator_1 = require("../services/authenticator");
const formatData_1 = require("../utils/formatData");
class FeedController {
    constructor() {
        this.controlGetFeed = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const verifiedToken = (0, authenticator_1.getTokenData)(token);
                if (!verifiedToken) {
                    res.statusCode = 401;
                    throw new Error("Unauthorized");
                }
                const feed = yield (0, feedQueries_1.getFeed)(verifiedToken.id);
                const feedMap = feed.map((item) => {
                    return {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        createdAt: (0, formatData_1.formatData)(item.created_at),
                        userId: item.user_id,
                        userName: item.name,
                    };
                });
                res.status(200).send({ recipes: feedMap });
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
    }
}
exports.default = FeedController;
