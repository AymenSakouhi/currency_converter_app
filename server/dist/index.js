"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const morgan_1 = __importDefault(require("morgan"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
const app = (0, express_1.default)();
//middleware and routes
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
app.use((0, morgan_1.default)("dev"));
app.use("/api", apiRoutes_1.default); //mounting the router
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});
