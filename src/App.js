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
  const [validSymbols, setValidSymbols] = useState([])
  const [hasError, setError] = useState(false)
  const fetchRates = useCallback((code) => {
    if (code === undefined) code = baseCode;
    fx.base = code;
    fetch(`https://api.exchangeratesapi.io/latest?base=${code}`)
      .then(res => res.json())
      .then(data => fx.rates = data.rates);

  }, [baseCode])


  // api key d0948b2dbfc72d3feb88df186790bcd4
  useEffect(() => {
    Promise.all([
      fetch("https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json"),
      fetch(`http://data.fixer.io/api/symbols?access_key=d0948b2dbfc72d3feb88df186790bcd4`)])
      .then(responses => {
        return Promise.all(responses.map(function (res) {
          return res.json();
        }))
      })
      .then(data => {
        console.log("data :" + data);
        setCurrencies(Object.values(data[0]));
        setLoadingCurrencies(false);
        fetchRates();
        setValidSymbols(Object.keys(data[1].symbols));
      })
  }, [fetchRates])


  let tempString = "";


  useEffect(() => {
    if (baseCurrency !== "") {
      // validate codes 
      let toCode = validSymbols.find(item => item === equivalentCode);
      let fromCode = validSymbols.find(item => item === baseCode);
      if (fromCode !== undefined && toCode !== undefined) {
        console.log(`from ${fromCode} to ${toCode}`);
        try {
          let converted = fx(Number(baseCurrency)).from(fromCode).to(toCode);
          setEquivalentCurrency(converted.toFixed(2))
          setError(false)
        }
        catch (e) {
          setError(true)
          console.log("conversion not supported")
        }
      } else {
        setError(true)
      }
    }

  }, [baseCurrency, baseCode, equivalentCode, hasError, validSymbols])


  const currencyChangeHandler = (evt) => {
    let evtCode = evt.target.value;
    let currency = currencies.find(({ code }) => code === evtCode);

    let symbol = currency !== undefined ? currency.symbol : "";
    if (evt.target.id === "baseDropDown") {
      setBaseCode(evtCode);
      setBaseSymbol(symbol);
    }
    if (evt.target.id === "equivalentDropDown") {
      setEquivalentCode(evtCode);
      setEquivalentSymbol(symbol);
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
      <h1>Currency Converter</h1>
      <div className="input-currency">
        <i>{baseSymbol}</i>
        <input
          type="text"
          value={baseCurrency}
          onChange={handleBaseChange}
          onFocus={focusBaseHandler}
          pattern="^-?[0-9]\d*\.?\d*$"
        />
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
          <i>{equivalentSymbol}</i>
          <input type="text" value={equivalentCurrency} readOnly={true} />

          <select id="equivalentDropDown" onChange={currencyChangeHandler} disabled={loadingCurrencies} value={equivalentCode} >
            {currencies.map((curr, i) => (
              <option key={i} value={curr.code} >
                {curr.code}
              </option>
            ))}
          </select>
        </div>
        {hasError &&
          <div >
            <h3 >The selected currency is not available!</h3>
          </div>
        }
      </div>
    </div >
  );
}

export default App;
