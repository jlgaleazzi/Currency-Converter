import React, { useState } from "react";
import "./App.css";

function App() {
  const lcurr = [
    { value: 1, label: "USD", symbol: "$" },
    { value: 2, label: "EURO", symbol: "&euro" },
  ];
  const [baseSymbol, setBaseSymbol] = "$";
  const [equivalentSymbol, setEquivalentSymbol] = "€";
  const [baseCurrency, setBaseCurrency] = useState("");
  const [equivalentCurrency, setEquivalentCurrency] = useState("");
  const [currencies, setCurrencies] = useState(lcurr);
  var tempString = "";

  const handleBaseChange = (event) => {
    let value = String(event.target.value).replace(".", "");

    if (event.target.validity.valid) {
      tempString += value;
      setBaseCurrency(formatInput(tempString));
    }
  };

  const focusBaseHandler = (event) => {
    event.preventDefault();
    let pos = event.target.value.length;
    event.target.setSelectionRange(pos, pos);
  };

  const formatInput = (input) => {
    return Number(input / 100).toFixed(2);
  };

  return (
    <div className="App">
      <div className="input-currency">
        <input
          type="text"
          value={baseCurrency}
          onChange={handleBaseChange}
          onFocus={focusBaseHandler}
          //pattern="^-?[0-9]*$"
          pattern="^-?[0-9]\d*\.?\d*$"
        />
        <i>{baseSymbol}</i>
        <select>
          {currencies.map((curr) => (
            <option key={curr.value} value={curr.value}>
              {curr.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className="input-currency">
          <input type="text" value={equivalentCurrency} readOnly={true} />
          <i>{equivalentSymbol}</i>
          <select>
            {currencies.map((curr) => (
              <option key={curr.value} value={curr.value}>
                {curr.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
