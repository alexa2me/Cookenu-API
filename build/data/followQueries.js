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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollowUser = exports.followUser = void 0;
const connection_1 = __importDefault(require("./connection"));
const followUser = (follow) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.default)("followers").insert(follow);
});
exports.followUser = followUser;
const unfollowUser = (followed_id, follower_id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.default)("followers")
        .delete(followed_id)
        .where("followed_id", followed_id)
        .andWhere("follower_id", follower_id);
});
exports.unfollowUser = unfollowUser;
