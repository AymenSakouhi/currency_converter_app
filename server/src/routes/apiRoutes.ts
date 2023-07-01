import express, { Router } from "express";
import {
  convertCurrency,
  getAllCurrenciesName,
} from "../controllers/currencyController";
const router: Router = express.Router();

router.post("/:fromCurrency/:toCurrency", convertCurrency);
router.get("/currencies", getAllCurrenciesName);

export default router;
