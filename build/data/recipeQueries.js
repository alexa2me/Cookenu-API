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
exports.deleteAllUserRecipes = exports.deleteRecipe = exports.editRecipe = exports.searchRecipeById = exports.addRecipe = void 0;
const connection_1 = __importDefault(require("./connection"));
const addRecipe = (recipe) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.default)("recipes").insert(recipe);
});
exports.addRecipe = addRecipe;
const searchRecipeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, connection_1.default)("recipes")
        .select("id", "title", "description", "created_at", "user_id")
        .where("id", `${id}`);
    return result[0];
});
exports.searchRecipeById = searchRecipeById;
const editRecipe = (recipe_id, user_id, title, description) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.default)("recipes")
        .update({
        title,
        description,
    })
        .where("id", recipe_id)
        .andWhere("user_id", `${user_id}`);
});
exports.editRecipe = editRecipe;
const deleteRecipe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.default)("recipes").delete(id).where("id", id);
});
exports.deleteRecipe = deleteRecipe;
const deleteAllUserRecipes = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.default)("recipes").delete(id).where("user_id", id);
});
exports.deleteAllUserRecipes = deleteAllUserRecipes;
