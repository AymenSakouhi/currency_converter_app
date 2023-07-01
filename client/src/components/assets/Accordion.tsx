import React from "react";

interface IState {
  conversionsList: {
    fromCurrency: string;
    toCurrency: string;
    fromCurrencyAmount: number;
    toCurrencyAmount: number;
    message: string;
  }[];
  state: {
    selectFrom: string;
    selectTo: string;
  };
}

const Accordion: React.FC<IState> = ({ conversionsList, state }) => {
  return (
    <div className="grid grid-cols-6 rounded-lg">
      <div className="col-span-6 bg-white w-full border border-gray-200 divide-y divide-gray-200 rounded-md">
        <details>
          <summary className=" py-3 px-4 cursor-pointer select-none w-full outline-none">
            Click here to see the Last 10 conversions
          </summary>
          <div className="pt-1 pb-3 px-4">
            {conversionsList.map((item, index) => (
              <div key={index} className="my-4">
                <div>
                  Your Conversion is {item.fromCurrency} {"---> "}{" "}
                  {item.toCurrency}
                </div>
                The amount of {item.fromCurrencyAmount} {state.selectFrom} is
                equal to {item.toCurrencyAmount} {state.selectTo}
                <p className="underline">Note: ${item.message}</p>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default Accordion;
