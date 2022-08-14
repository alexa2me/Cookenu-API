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
const connection_1 = __importDefault(require("../data/connection"));
const recipeQueries_1 = require("../data/recipeQueries");
const authenticator_1 = require("../services/authenticator");
const idGenerator_1 = require("../services/idGenerator");
const user_1 = require("../types/user");
const formatData_1 = require("../utils/formatData");
class RecipeController {
    constructor() {
        this.controlAddRecipe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description } = req.body;
                const token = req.headers.authorization;
                const verifiedToken = (0, authenticator_1.getTokenData)(token);
                if (!verifiedToken) {
                    res.statusCode = 401;
                    throw new Error("Unauthorized");
                }
                if (!title || !description) {
                    res.statusCode = 422;
                    throw new Error("Preencha todos os campos: 'title' e 'description'.");
                }
                const newRecipe = {
                    id: (0, idGenerator_1.generateId)(),
                    title,
                    description,
                    user_id: verifiedToken.id,
                };
                yield (0, recipeQueries_1.addRecipe)(newRecipe);
                res.status(200).send({ message: "Recipe added successfully!" });
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
        this.controlSearchRecipeById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const token = req.headers.authorization;
                const verifiedToken = (0, authenticator_1.getTokenData)(token);
                if (!verifiedToken) {
                    res.statusCode = 401;
                    throw new Error("Unauthorized");
                }
                const recipe = yield (0, recipeQueries_1.searchRecipeById)(id);
                res.status(200).send({
                    id: recipe.id,
                    title: recipe.title,
                    description: recipe.description,
                    createdAt: (0, formatData_1.formatData)(recipe.created_at),
                });
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
        this.controlEditRecipe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const recipe_id = req.params.id;
                const { title, description } = req.body;
                const token = req.headers.authorization;
                const verifiedToken = (0, authenticator_1.getTokenData)(token);
                if (!verifiedToken) {
                    res.statusCode = 401;
                    throw new Error("Unauthorized");
                }
                if (verifiedToken.role !== user_1.USER_ROLES.NORMAL) {
                    res.statusCode = 403;
                    throw new Error("Only NORMAL users are allowed to edit recipes.");
                }
                if (!title || !description) {
                    res.statusCode = 422;
                    throw new Error("Please, fill all fields: 'title' and 'description'.");
                }
                const recipe = yield (0, recipeQueries_1.searchRecipeById)(recipe_id);
                if (recipe.user_id !== verifiedToken.id) {
                    res.statusCode = 401;
                    throw new Error("This recipe doesn't belong to you, so you're not allowed to edit it.");
                }
                yield (0, recipeQueries_1.editRecipe)(recipe_id, verifiedToken.id, title, description);
                res.status(200).send({ message: "Recipe edited successfully" });
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
        this.controlDeleteRecipe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const token = req.headers.authorization;
                const verifiedToken = (0, authenticator_1.getTokenData)(token);
                if (!verifiedToken) {
                    res.statusCode = 401;
                    throw new Error("Unauthorized");
                }
                const recipe = yield (0, recipeQueries_1.searchRecipeById)(id);
                const [user] = yield (0, connection_1.default)("users")
                    .select("name", "role")
                    .where("id", verifiedToken.id);
                if (user.role !== "ADMIN") {
                    if (recipe.user_id !== verifiedToken.id) {
                        res.statusCode = 401;
                        throw new Error("This recipe doesn't belong to you, so you're not allowed to delete it.");
                    }
                }
                yield (0, recipeQueries_1.deleteRecipe)(id);
                res.status(200).send({ message: "Recipe deleted successfully!" });
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
        this.controlDeleteAllUserRecipes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const token = req.headers.authorization;
                const verifiedToken = (0, authenticator_1.getTokenData)(token);
                if (!verifiedToken) {
                    res.statusCode = 401;
                    throw new Error("Unauthorized");
                }
                const [user] = yield (0, connection_1.default)("users")
                    .select("id", "role")
                    .where("id", verifiedToken.id);
                if (user.role !== "ADMIN") {
                    if (user.id !== verifiedToken.id) {
                        res.statusCode = 401;
                        throw new Error("You aren't allowed to delete these recipes, check your credentials.");
                    }
                }
                yield (0, recipeQueries_1.deleteAllUserRecipes)(id);
                res.status(200).send({ message: "All recipes deleted successfully!" });
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
    }
}
exports.default = RecipeController;
