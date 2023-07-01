export type CurrencyConvertedItem = {
  fromCurrency: string;
  toCurrency: string;
  value: number;
  message: string;
  fromCurrencyAmount: number;
  toCurrencyAmount: number;
  Date?: Date;
};

export type currencyDetails = {
  currencyName: string;
  currencySymbol: string;
  id: string;
};

export type CurrencyHistory = {
  conversionsList: CurrencyConvertedItem[];
  currencyList: currencyDetails[];
  fromCurrencyAmount: number;
  toCurrencyAmount: number;
  selectFrom: string;
  selectTo: string;
};

export enum converCurrencyActionTypes {
  UPDATE_FROM_CURRENCY = "UPDATE_FROM_CURRENCY",
  UPDATE_TO_CURRENCY = "UPDATE_TO_CURRENCY",
  CONVERT_CURRENCY = "CONVERT_CURRENCY",
  GET_CURRENCIES_LIST = "GET_CURRENCIES_LIST",
  UPDATE_SELECT_FROM = "UPDATE_SELECT_FROM",
  UPDATE_SELECT_TO = "UPDATE_SELECT_TO",
  UPDATE_CONVERSIONS_LIST = "UPDATE_CONVERSIONS_LIST",
}

export type Actions =
  | {
      type: converCurrencyActionTypes.CONVERT_CURRENCY;
      payload: CurrencyConvertedItem;
    }
  | {
      type: converCurrencyActionTypes.GET_CURRENCIES_LIST;
      payload: currencyDetails[];
    }
  | {
      type: converCurrencyActionTypes.UPDATE_FROM_CURRENCY;
      payload: number;
    }
  | {
      type: converCurrencyActionTypes.UPDATE_TO_CURRENCY;
      payload: number;
    }
  | {
      type: converCurrencyActionTypes.UPDATE_SELECT_FROM;
      payload: string;
    }
  | {
      type: converCurrencyActionTypes.UPDATE_SELECT_TO;
      payload: string;
    }
  | {
      type: converCurrencyActionTypes.UPDATE_CONVERSIONS_LIST;
      payload: CurrencyConvertedItem[];
    };

export enum edges {
  MINIMUM = 1,
  MAXIMUM = 999999999999,
}
