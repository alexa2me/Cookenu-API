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
const followQueries_1 = require("../data/followQueries");
const authenticator_1 = require("../services/authenticator");
class FollowController {
    constructor() {
        this.controlFollow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { followed_id } = req.body;
                const token = req.headers.authorization;
                const verifiedToken = (0, authenticator_1.getTokenData)(token);
                if (!verifiedToken) {
                    res.statusCode = 401;
                    throw new Error("Unauthorized");
                }
                if (!followed_id) {
                    res.statusCode = 422;
                    throw new Error("Please, inform your id.");
                }
                const newFollowed = {
                    followed_id,
                    follower_id: verifiedToken.id,
                };
                yield (0, followQueries_1.followUser)(newFollowed);
                res.status(200).send({ message: "Followed successfully" });
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
        this.controlUnfollow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { followed_id } = req.body;
                const token = req.headers.authorization;
                const verifiedToken = (0, authenticator_1.getTokenData)(token);
                if (!verifiedToken) {
                    res.statusCode = 401;
                    throw new Error("Unauthorized");
                }
                if (!followed_id) {
                    res.statusCode = 422;
                    throw new Error("Please, inform an id to unfollow.");
                }
                yield (0, followQueries_1.unfollowUser)(followed_id, verifiedToken.id);
                res.status(200).send({ message: "Unfollowed successfully" });
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
    }
}
exports.default = FollowController;
