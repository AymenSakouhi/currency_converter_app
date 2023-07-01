import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { converCurrencyActionTypes, edges } from "../types/models";
import { reducer, VerifyInput } from "../utils/config";
import { uniqBy } from "lodash";
import Accordion from "./assets/Accordion";

const CurrencyConverter: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [state, dispatch] = useReducer(reducer, {
    conversionsList: [], //list of the last 10 conversions
    currencyList: [], //list of currencies
    fromCurrencyAmount: 0, //the value of the input adjacent to the first select
    toCurrencyAmount: 0, //the value of the input adjacent to the second select
    selectFrom: "", //the string value of the first select
    selectTo: "", //the string value of the second select
  });

  /**
   * @function convert
   * @description convert the currency and update history list
   * @param type {"from" | "to"} : //e.g: from first select to second or the opposite
   * @param value {string} : //e.g: the value of the input adjacent to the select
   */

  let timeoutId: NodeJS.Timeout | null = null;

  const handleCurrencyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    direction: "from" | "to"
  ) => {
    //We might get rid of checking the lenfth of the input
    //Nothing but numbers can be typed in the input
    if (VerifyInput(e.target.value)) {
      return;
    }
    //update the state with the new value of the input
    dispatch({
      type:
        direction === "from"
          ? converCurrencyActionTypes.UPDATE_FROM_CURRENCY
          : converCurrencyActionTypes.UPDATE_TO_CURRENCY,
      payload: Number(e.target.value),
    });
    //convert the currency and update history list
    //a debounce before converting
    //to avoid the case where the user types too fast
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const value = e.target.value;
      const lastNumber = value.match(/\d+$/) || [""];
      const selectedCurrency =
        direction === "from" ? state.selectFrom : state.selectTo;
      convert(direction, lastNumber[0], selectedCurrency);
      timeoutId = null; // Reset the timeoutId to null after the conversion is triggered
    }, 500);
  };

  const convert = (type: "from" | "to", value: string, currency: string) => {
    axios
      .post(
        `/api/${
          type === "from"
            ? currency + "/" + state.selectTo
            : currency + "/" + state.selectFrom
        }`
      )
      .then((res) => {
        const convertedData = {
          ...res.data,
          fromCurrencyAmount:
            type === "from" ? Number(value) : Number(value) * res.data.value,
          toCurrencyAmount:
            type === "from" ? Number(value) * res.data.value : Number(value),
        };

        dispatch({
          type: converCurrencyActionTypes.CONVERT_CURRENCY,
          payload: convertedData,
        });

        // Filter the conversionsList to hold only unique objects based on date of conversion and reorder them from the most recent to the oldest
        //only the last 10 conversions are kept

        const updatedConversionsList = uniqBy(
          [convertedData, ...state.conversionsList],
          "Date"
        )
          .sort((a, b) => b.date - a.date)
          .slice(0, 10);

        // const updatedConversionsList = uniqBy(
        //   [convertedData, ...state.conversionsList],
        //   "Date"
        // ).sort((a, b) => b.date - a.date);

        // Update the state with the filtered conversionsList
        dispatch({
          type: converCurrencyActionTypes.UPDATE_CONVERSIONS_LIST,
          payload: updatedConversionsList,
        });
      });
  };

  useEffect(() => {
    //get the list of currencies
    axios.get("/api/currencies").then((res) => {
      //update the state with the list of currencies
      dispatch({
        type: converCurrencyActionTypes.GET_CURRENCIES_LIST,
        payload: res.data,
      });
      //update the state with the first currency of the list
      dispatch({
        type: converCurrencyActionTypes.UPDATE_SELECT_FROM,
        payload: res.data[0].id,
      });
      //update the state with the second currency of the list
      dispatch({
        type: converCurrencyActionTypes.UPDATE_SELECT_TO,
        payload: res.data[1].id,
      });
      setIsLoading(false);

      //unsubscribe from the list of currencies
      return () => {
        setIsLoading(true);
      };
    });
  }, []);

  return (
    <>
      <main className="flex flex-col items-center justify-between p-4">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <h1 className="text-4xl p-4 text-center text-white">
            Currency Converter
          </h1>
          <div className="bg-slate-800 p-4 rounded-lg">
            <form className="grid grid-cols-6 items-center text-black">
              <input
                id="currencyFrom"
                name="currencyFrom"
                className="col-span-3 p-3 rounded-lg"
                type="number"
                placeholder="To convert from ..."
                onChange={(e) => {
                  handleCurrencyChange(e, "from");
                }}
                value={state.fromCurrencyAmount || ""}
                min={edges.MINIMUM}
                max={edges.MAXIMUM}
              />
              <select
                className="col-span-3 p-3 rounded-lg mx-1 border"
                name="from"
                id="from"
                value={state.selectFrom}
                onChange={(e) => {
                  dispatch({
                    type: converCurrencyActionTypes.UPDATE_SELECT_FROM,
                    payload: e.target.value,
                  });
                  console.log(state.fromCurrencyAmount.toString());
                  console.log(e.target.value);
                  convert(
                    "from",
                    state.fromCurrencyAmount.toString(),
                    e.target.value
                  );
                }}
              >
                {!isLoading ? (
                  state.currencyList.map((currency) => {
                    return (
                      <option
                        key={Math.random().toString(26).slice(2)}
                        value={currency.id}
                      >
                        {currency.id} - {currency.currencyName}
                      </option>
                    );
                  })
                ) : (
                  <option value="Waiting for the list">
                    Waiting for the list
                  </option>
                )}
              </select>

              <input
                type="number"
                name="currencyTo"
                id="currencyTo"
                className="
                col-span-3 p-3 rounded-lg my-4"
                placeholder={"To convert to ..."}
                onChange={(e) => {
                  handleCurrencyChange(e, "to");
                }}
                value={state.toCurrencyAmount || ""}
                min={edges.MINIMUM}
                max={edges.MAXIMUM}
              />

              <select
                className="col-span-3 p-3 rounded-lg mx-1 border"
                name="to"
                id="to"
                value={state.selectTo}
                onChange={(e) => {
                  dispatch({
                    type: converCurrencyActionTypes.UPDATE_SELECT_TO,
                    payload: e.target.value,
                  });
                  convert(
                    "to",
                    state.toCurrencyAmount.toString(),
                    e.target.value
                  );
                }}
              >
                {!isLoading ? (
                  state.currencyList.map((currency) => {
                    return (
                      <option
                        key={Math.random().toString(26).slice(2)}
                        value={currency.id}
                      >
                        {currency.id} - {currency.currencyName}
                      </option>
                    );
                  })
                ) : (
                  <option value="Waiting for the list">
                    Waiting for the list
                  </option>
                )}
              </select>
            </form>
            <Accordion conversionsList={state.conversionsList} state={state} />
          </div>
        </div>
      </main>
    </>
  );
};

export default CurrencyConverter;
