import React from "react";

function InputBox({
  amount,
  onAmountChange,
  onCurrencyChange,
  currencyOptions = [],
  selectCurrency = "USD",
  disabled = false,
}) {
  return (
    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-4 flex items-center border border-white/10">
      <input
        type="number"
        placeholder="0"
        className="text-4xl md:text-5xl w-full bg-transparent outline-none text-white placeholder-white/50"
        value={amount}
        onChange={(e) => onAmountChange && onAmountChange(Number(e.target.value))}
        disabled={disabled}
      />
      <select
        className="text-lg px-4 py-2 bg-white/10 text-white rounded-xl outline-none border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
        value={selectCurrency}
        onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
        disabled={disabled}
      >
        {currencyOptions.map((currency) => (
          <option 
            key={currency} 
            value={currency}
            className="bg-indigo-900 text-white"
          >
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
}

export default InputBox;
