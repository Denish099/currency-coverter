import { useState } from "react";
import { InputBox } from "./components";
import useCurrencyInfo from "./hooks/useCurrencyInfo";

function App() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [showResult, setShowResult] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState(0);

  const { currentRates, loading, error } = useCurrencyInfo(from);
  const options = currentRates ? Object.keys(currentRates) : [];

  const convert = () => {
    if (currentRates && currentRates[to]) {
      setConvertedAmount(amount * currentRates[to]);
      setShowResult(true);
    }
  };

  const reset = () => {
    setAmount("");
    setShowResult(false);
    setConvertedAmount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {!showResult ? (
          <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center mb-8">
              Currency Converter
            </h1>
            
            {error && (
              <div className="bg-red-500/80 text-white p-4 rounded-xl mb-6 text-center">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <InputBox
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={setFrom}
                selectCurrency={from}
                onAmountChange={setAmount}
                disabled={loading}
              />

              <div className="relative">
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-4 flex items-center border border-white/10">
                  <select
                    className="w-full bg-transparent text-4xl md:text-5xl text-white outline-none appearance-none cursor-pointer"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  >
                    {options.map((currency) => (
                      <option key={currency} value={currency} className="bg-indigo-900 text-white text-2xl">
                        {currency}
                      </option>
                    ))}
                  </select>
                  <div className="text-white/50 text-xl">▼</div>
                </div>
              </div>

              <button
                onClick={convert}
                disabled={loading || !amount}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xl font-medium px-6 py-4 rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:hover:from-blue-500 disabled:hover:to-purple-500"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  "Get Exchange Rate"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                {amount} {from} =
              </h2>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
                {convertedAmount.toFixed(2)}
                <span className="text-2xl ml-2 text-blue-400">{to}</span>
              </div>
              <p className="text-white/60">
                1 {from} = {currentRates[to]?.toFixed(4)} {to}
              </p>
              <button
                onClick={reset}
                className="mt-8 w-full bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-4 rounded-2xl transition-colors"
              >
                Convert Another Amount
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
