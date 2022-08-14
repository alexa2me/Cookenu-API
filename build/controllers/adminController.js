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
const adminOnlyQueries_1 = require("../data/adminOnlyQueries");
const connection_1 = __importDefault(require("../data/connection"));
const authenticator_1 = require("../services/authenticator");
const recipeQueries_1 = require("../data/recipeQueries");
class AdminController {
    constructor() {
        this.controlDeleteuser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const token = req.headers.authorization;
                const verifiedToken = (0, authenticator_1.getTokenData)(token);
                if (!verifiedToken) {
                    res.statusCode = 401;
                    throw new Error("Unauthorized");
                }
                const [user] = yield (0, connection_1.default)("users")
                    .select("name", "role")
                    .where("id", verifiedToken.id);
                if (user.role !== "ADMIN") {
                    throw new Error("Access denied, only ADMIN role is allowed to delete users.");
                }
                yield (0, adminOnlyQueries_1.removeAllFollowerUserReferences)(id);
                yield (0, adminOnlyQueries_1.removeAllFollowedUserReferences)(id);
                yield (0, recipeQueries_1.deleteAllUserRecipes)(id);
                yield (0, adminOnlyQueries_1.deleteUser)(id);
                res.status(200).send({ message: "User deleted successfully!" });
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
    }
}
exports.default = AdminController;
