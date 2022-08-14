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
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const userDataController_1 = __importDefault(require("./controllers/userDataController"));
const userAccessController_1 = __importDefault(require("./controllers/userAccessController"));
const feedController_1 = __importDefault(require("./controllers/feedController"));
const recipeController_1 = __importDefault(require("./controllers/recipeController"));
const followController_1 = __importDefault(require("./controllers/followController"));
const adminController_1 = __importDefault(require("./controllers/adminController"));
(0, dotenv_1.config)();
const routes = express_1.default.Router();
const userDataController = new userDataController_1.default();
const userAccessController = new userAccessController_1.default();
const feedController = new feedController_1.default();
const recipeController = new recipeController_1.default();
const followController = new followController_1.default();
const adminController = new adminController_1.default();
routes.get("/ta-acordado?", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send("eu to e tu?");
}));
routes.post("/signup", userAccessController.controlCreateUser);
routes.post("/login", userAccessController.controlLogin);
routes.post("/user/password/reset", userAccessController.controlResetPassword);
routes.get("/user/profile", userDataController.controlGetLoggedUserData);
routes.get("/user/:id", userDataController.controlGetUserById);
routes.post("/user/follow", followController.controlFollow);
routes.post("/user/unfollow", followController.controlUnfollow);
routes.get("/feed", feedController.controlGetFeed);
routes.post("/recipe", recipeController.controlAddRecipe);
routes.get("/recipe/:id", recipeController.controlSearchRecipeById);
routes.post("/recipe/edit/:id", recipeController.controlEditRecipe);
routes.delete("/recipe/delete/:id", recipeController.controlDeleteRecipe);
routes.delete("/recipes/delete/all/user/:id", recipeController.controlDeleteAllUserRecipes);
routes.delete("/admin/delete/user/:id", adminController.controlDeleteuser);
exports.default = routes;
