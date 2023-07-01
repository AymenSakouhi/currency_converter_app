"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCurrenciesName = exports.convertCurrency = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const currencies_1 = __importDefault(require("../data/currencies"));
const apiKey = process.env.API_KEY;
/**
 * @method  POST
 * @function convertCurrency
 * @param   {string}  toCurrency
 * @param   {string}  fromCurrency
 * @route   GET /api/:fromCurrency/:toCurrency //e.g. /api/USD/EUR
 * @description Convert currency based on the number provided in a text input by the API and return the exchange rate
 */
const convertCurrency = (req, res, next) => {
    const { fromCurrency, toCurrency } = req.params;
    const apiUrl = `https://free.currconv.com/api/v7/convert?q=${fromCurrency}_${toCurrency}&compact=ultra&apiKey=${apiKey}`;
    axios_1.default
        .get(apiUrl)
        .then((response) => {
        const exchangeRate = response.data[`${fromCurrency}_${toCurrency}`];
        res.status(200).json({
            message: `1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`,
            value: exchangeRate,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            Date: new Date(),
        });
    })
        .catch((error) => {
        res.status(500).json({ message: "Error fetching exchange rate", error });
    });
};
exports.convertCurrency = convertCurrency;
/**
 * @method  GET
 * @function getAllCurrenciesName
 * @route   GET /api/currencies
 * @description Get all currencies names from the API
 */
const getAllCurrenciesName = (req, res, next) => {
    const apiUrl = `https://free.currconv.com/api/v7/currencies?apiKey=${apiKey}`;
    const convertCurrenciesToArray = (currencies) => {
        const currencyArray = Object.keys(currencies.results).map((key) => {
            const { currencyName, currencySymbol, id } = currencies.results[key];
            return { id, currencyName, currencySymbol };
        });
        return currencyArray;
    };
    /**
     * @desc: As I had all the currencies in a file, I didn't need to fetch them from the API
     * @desc: But if you want to try it, uncomment the code below and comment the code above
     */
    /* axios
      .get(apiUrl)
      .then((response) => {
        const currencies = response.data;
        res.status(200).json(convertCurrenciesToArray(currencies));
      })
      .catch((error) => {
        res.status(500).json({ message: "Error fetching currency list:", error });
      }); */
    //in case you want to try locally
    res.status(200).json(convertCurrenciesToArray(currencies_1.default));
};
exports.getAllCurrenciesName = getAllCurrenciesName;
