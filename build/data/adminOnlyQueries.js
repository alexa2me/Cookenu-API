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
exports.deleteUser = exports.removeAllFollowedUserReferences = exports.removeAllFollowerUserReferences = void 0;
const connection_1 = __importDefault(require("./connection"));
const removeAllFollowerUserReferences = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.default)("followers").delete(id).where("follower_id", `${id}`);
});
exports.removeAllFollowerUserReferences = removeAllFollowerUserReferences;
const removeAllFollowedUserReferences = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.default)("followers").delete(id).where("followed_id", `${id}`);
});
exports.removeAllFollowedUserReferences = removeAllFollowedUserReferences;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.default)("users").delete(id).where("id", id);
});
exports.deleteUser = deleteUser;
