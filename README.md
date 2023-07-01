# Currency Converter App

This is a currency converter application built using Node.js, TypeScript, React, Docker, Tailwindcss and Nginx. The application allows users to convert between different currencies.

The app works on http://localhost:3050/ .

How the app should look like:
![folders](https://i.imgur.com/ZHsTOp8.png)

## What you need to update (.env):

There is one thing that you need to update which is your API_KEY for the currencyconverterapi.com api.
Please head to the docker-compose.yml file and change on line 25.

```shell
environment:
      PORT: 8000
      API_KEY: YOUR_KEY_HERE
```

## Technologies Used

- Node.js: A JavaScript runtime environment that allows running JavaScript on the server-side.
- TypeScript: A typed superset of JavaScript that adds static type-checking and other features to enhance developer productivity and code maintainability.
- React: A JavaScript library for building user interfaces, particularly for single-page applications.
- Docker: A containerization platform that allows packaging applications into portable, isolated containers.
- Nginx: A high-performance web server and reverse proxy server used to handle HTTP requests.
- Tailwindcss : Tailwind CSS is a utility-first CSS framework for rapidly building modern websites without ever leaving your HTML.

## Folder Structure

The project is organized into the following directories:

- `client`: Contains the frontend code built with React and TypeScript.
- `server`: Contains the backend code built with Node.js and TypeScript.
- `nginx`: Contains the Nginx configuration files.

## Important Info

You don't have to add any building scripts to start the app just run on the root folder:

```shell
   docker-compose up --build
```

### Prerequisites

Make sure you have the following dependencies installed:

- Node.js (v14 or higher)
- Docker

### Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/AymenSakouhi/currency_converter_app.git
   ```

2. Then inside the main folder where you have tha docker-compose.yml file, just write and run this command:

   ```shell
   docker-compose up --build
   ```

### More details about the app

The convertCurrency handler handles a POST request to the /api/:fromCurrency/:toCurrency route. It retrieves the fromCurrency and toCurrency parameters from the request URL, constructs an API URL using the API key, and sends a GET request to retrieve the exchange rate between the currencies. Upon receiving a successful response, it extracts the exchange rate and sends a JSON response with the rate, the currencies involved, and the current date. If an error occurs, it sends a JSON response with a status code of 500 and an error message.

The getAllCurrenciesName handler handles a GET request to the /api/currencies route. It constructs an API URL to fetch all currency names. Instead of making the actual API call, it uses a data file (currenciesList) containing a list of currencies to simulate the response. It converts the response data into a formatted array of currency objects and sends a JSON response with the array of currency objects to the client.

You can find an example of the code in file:
currencyController

```javascript
const convertCurrency: RequestHandler = (req, res, next) => {
  const { fromCurrency, toCurrency } = req.params;
  const apiUrl = `https://free.currconv.com/api/v7/convert?q=${fromCurrency}_${toCurrency}&compact=ultra&apiKey=${apiKey}`;

  axios
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
```

Now let's talk about the routes:
This code sets up the routing for currency-related API endpoints using Express.js. It defines a router, assigns the routes to the corresponding request handlers, and exports the router.

```javascript
import express, { Router } from "express";
import {
  convertCurrency,
  getAllCurrenciesName,
} from "../controllers/currencyController";

const router: Router = express.Router();

router.post("/:fromCurrency/:toCurrency", convertCurrency);
router.get("/currencies", getAllCurrenciesName);

export default router;
```

There is also a docker file for each folder:
and here is an example:

```shell
FROM node:14
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm install
CMD ["npm", "run", "start"]
#In case you want to check each build on its own:
#docker build -f Dockerfile -t server .
#docker run -it -p 8000:8000 server
```

Now if we discuss the front,
It is actually simple:
There is 3 folders:

```shell
SRC
|
|___components
|
|___utils
|
|___types
```

Here are all the types with a bit of explanation:

```javascript
// Represents a single item in the currency conversion history
export type CurrencyConvertedItem = {
  fromCurrency: string; // Currency code of the currency being converted from
  toCurrency: string; // Currency code of the currency being converted to
  value: number; // Exchange rate value for the conversion
  message: string; // Description or message about the conversion
  fromCurrencyAmount: number; // Amount of currency being converted from
  toCurrencyAmount: number; // Converted amount of currency
  Date?: Date; // Optional property for the date of the conversion
};

// Represents details about a currency
export type currencyDetails = {
  currencyName: string; // Name of the currency
  currencySymbol: string; // Currency symbol
  id: string; // Currency code
};

// Represents the overall state of the currency conversion history
export type CurrencyHistory = {
  conversionsList: CurrencyConvertedItem[]; // Array of currency conversion items
  currencyList: currencyDetails[]; // Array of currency details
  fromCurrencyAmount: number; // Value of the input adjacent to the first currency select
  toCurrencyAmount: number; // Value of the input adjacent to the second currency select
  selectFrom: string; // Selected currency code from the first currency select
  selectTo: string; // Selected currency code from the second currency select
};

// Enumerates the different types of actions that can be dispatched in the currency conversion process
export enum converCurrencyActionTypes {
  UPDATE_FROM_CURRENCY = "UPDATE_FROM_CURRENCY", // Updates the value of the input adjacent to the first currency select
  UPDATE_TO_CURRENCY = "UPDATE_TO_CURRENCY", // Updates the value of the input adjacent to the second currency select
  CONVERT_CURRENCY = "CONVERT_CURRENCY", // Performs the currency conversion and updates the conversion history
  GET_CURRENCIES_LIST = "GET_CURRENCIES_LIST", // Retrieves the list of available currencies
  UPDATE_SELECT_FROM = "UPDATE_SELECT_FROM", // Updates the selected currency code in the first currency select
  UPDATE_SELECT_TO = "UPDATE_SELECT_TO", // Updates the selected currency code in the second currency select
  UPDATE_CONVERSIONS_LIST = "UPDATE_CONVERSIONS_LIST", // Updates the conversion history list
}

// Represents the different types of actions that can be dispatched in the Redux store
export type Actions =
  | {
      type: converCurrencyActionTypes.CONVERT_CURRENCY; // Action to perform currency conversion
      payload: CurrencyConvertedItem; // Payload containing the converted currency details
    }
  | {
      type: converCurrencyActionTypes.GET_CURRENCIES_LIST; // Action to retrieve the list of available currencies
      payload: currencyDetails[]; // Payload containing the currency details list
    }
  | {
      type: converCurrencyActionTypes.UPDATE_FROM_CURRENCY; // Action to update the value of the input adjacent to the first currency select
      payload: number; // Payload containing the updated value
    }
  | {
      type: converCurrencyActionTypes.UPDATE_TO_CURRENCY; // Action to update the value of the input adjacent to the second currency select
      payload: number; // Payload containing the updated value
    }
  | {
      type: converCurrencyActionTypes.UPDATE_SELECT_FROM; // Action to update the selected currency code in the first currency select
      payload: string; // Payload containing the updated currency code
    }
  | {
      type: converCurrencyActionTypes.UPDATE_SELECT_TO; // Action to update the selected currency code in the second currency select
      payload: string; // Payload containing the updated currency code
    }
  | {
      type: converCurrencyActionTypes.UPDATE_CONVERSIONS_LIST; // Action to update the conversion history list
      payload: CurrencyConvertedItem[]; // Payload containing the updated conversion history list
    };

// Enumerates the minimum and maximum values for the currency input fields
export enum edges {
  MINIMUM = 1, // Minimum value allowed
  MAXIMUM = 999999999999, // Maximum value allowed
}
```

I used useReducer from React, as I think there is a lot of states to update each time, so one state as an object with a reducer function will be the best option.
You will find that in config.ts inside utils folder.

```javascript
export const reducer = (state: CurrencyHistory, action: Actions) => {
  switch (action.type) {
    case converCurrencyActionTypes.UPDATE_FROM_CURRENCY:
      return {
        ...state,
        fromCurrencyAmount: action.payload,
      };

    case converCurrencyActionTypes.UPDATE_TO_CURRENCY:
      return {
        ...state,
        toCurrencyAmount: action.payload,
      };

    case converCurrencyActionTypes.UPDATE_SELECT_FROM:
      return {
        ...state,
        selectFrom: action.payload,
      };

    case converCurrencyActionTypes.UPDATE_SELECT_TO:
      return {
        ...state,
        selectTo: action.payload,
      };

    case converCurrencyActionTypes.CONVERT_CURRENCY:
      // If the list is less than 10 items, add the new item to the list, else remove the first item and add the new item to the end of the list
      return {
        ...state,
        conversionsList: [
          { ...action.payload, Date: new Date() },
          ...state.conversionsList,
        ],
        fromCurrencyAmount: action.payload.fromCurrencyAmount,
        toCurrencyAmount: action.payload.toCurrencyAmount,
      };

    case converCurrencyActionTypes.GET_CURRENCIES_LIST:
      return {
        ...state,
        currencyList: [...state.currencyList, ...action.payload],
      };

    case converCurrencyActionTypes.UPDATE_CONVERSIONS_LIST:
      return {
        ...state,
        conversionsList: [...action.payload],
      };

    default:
      return state;
  }
};
```

## Contact

Please feel free to contact me in case of any request: aymenmarketer@gmail.com
