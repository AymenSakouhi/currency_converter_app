import {
  Actions,
  converCurrencyActionTypes,
  CurrencyHistory,
} from "../types/models";

/**
 * @function reducer // Reducer function for the currency converter
 * @param state { CurrencyHistory } // a history of details of the currency converter e.g. latest conversions from and where to and the values.
 * @param action { Actions } // Action type and payload
 * @returns { CurrencyHistory } // Returns the updated state
 */

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

/**
 * @function VerifyInput // Verifies the input value
 * @param value { string } // The value to be verified
 * @returns { void } // Returns nothing
 * @description // If the value is greater than 12 or not a number, return nothing
 */
export const VerifyInput = (value: string) => {
  return value.length > 12 || isNaN(Number(value)) ? true : false;
};
