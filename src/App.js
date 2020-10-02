import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import fx from "money";

function App() {

  const [baseSymbol, setBaseSymbol] = useState("$");
  const [equivalentSymbol, setEquivalentSymbol] = useState("€");
  const [baseCode, setBaseCode] = useState("USD");
  const [equivalentCode, setEquivalentCode] = useState("EUR");
  const [baseCurrency, setBaseCurrency] = useState("");
  const [equivalentCurrency, setEquivalentCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  const fetchRates = useCallback((code) => {
    if (code === undefined) code = baseCode;
    fx.base = code;
    fetch(`https://api.exchangeratesapi.io/latest?base=${code}`)
      .then(res => res.json())
      .then(data => fx.rates = data.rates);

  }, [baseCode])


  useEffect(() => {
    fetch("https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json")
      .then(res => res.json())
      .then(data => {
        setCurrencies(Object.values(data));
        setLoadingCurrencies(false);
        fetchRates();
      });
  }, [fetchRates])


  let tempString = "";


  useEffect(() => {
    // validate inputs 
    if (baseCurrency !== "") {
      let converted = fx(Number(baseCurrency)).from(baseCode).to(equivalentCode);
      setEquivalentCurrency(converted.toFixed(2))
    }

  }, [baseCurrency, baseCode, equivalentCode])


  const currencyChangeHandler = (evt) => {
    let evtCode = evt.target.value;
    let currency = currencies.find(({ code }) => code === evtCode);
    if (evt.target.id === "baseDropDown") {
      setBaseCode(evtCode);
      setBaseSymbol(currency.symbol);
    }
    if (evt.target.id === "equivalentDropDown") {
      setEquivalentCode(evtCode);
      setEquivalentSymbol(currency.symbol);
    }
  }

  const handleBaseChange = (event) => {
    let value = String(event.target.value).replace(".", "");
    if (event.target.validity.valid) {
      tempString += value;
      let formattedValue = formatInput(tempString);
      setBaseCurrency(formattedValue);
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
          pattern="^-?[0-9]\d*\.?\d*$"
        />
        <i>{baseSymbol}</i>
        <select id="baseDropDown" onChange={currencyChangeHandler} disabled={loadingCurrencies} value={baseCode}>
          {currencies.map((curr, i) => (
            <option key={i} value={curr.code} >
              {curr.code}
            </option>
          ))}
        </select>
      </div>
      <div>
        <div className="input-currency">
          <input type="text" value={equivalentCurrency} readOnly={true} />
          <i>{equivalentSymbol}</i>
          <select id="equivalentDropDown" onChange={currencyChangeHandler} disabled={loadingCurrencies} value={equivalentCode} >
            {currencies.map((curr, i) => (
              <option key={i} value={curr.code} >
                {curr.code}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
