import express, { Express, Request, Response } from "express";
import "dotenv/config";
import morgan from "morgan";
import currencyRouter from "./routes/apiRoutes";

const app: Express = express();
//middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
app.use(morgan("dev"));

app.use("/api", currencyRouter); //mounting the router

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
