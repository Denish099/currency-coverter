import { useState } from "react";
import { InputBox } from "./components";
import useCurrencyInfo from "./hooks/useCurrencyInfo";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(0);

  const { currentRates, historicalData } = useCurrencyInfo(from);
  const options = currentRates ? Object.keys(currentRates) : [];

  const swap = () => {
    setFrom(to);
    setTo(from);
    setConvertedAmount(amount);
    setAmount(convertedAmount);
  };

  const convert = () => {
    if (currentRates && currentRates[to]) {
      setConvertedAmount(amount * currentRates[to]);
    }
  };

  // Process historical data for the chart
  const chartData = historicalData.map(day => ({
    date: new Date(day.date).toLocaleDateString(),
    rate: day[to],
    currency: `${from} to ${to}`
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start gap-4 bg-gray-100 p-4">
      <div className="fixed w-full max-w-md top-0 bg-white rounded-lg p-5 border border-gray-200">
        <form onSubmit={(e) => {
          e.preventDefault();
          convert();
        }}>
          <div className="w-full mb-1">
            <InputBox
              label="From"
              amount={amount}
              currencyOptions={options}
              onCurrencyChange={(currency) => setFrom(currency)}
              selectCurrency={from}
              onAmountChange={(amount) => setAmount(amount)}
            />
          </div>
          <div className="relative w-full h-0.5">
            <button
              type="button"
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
              onClick={swap}
            >
              swap
            </button>
          </div>
          <div className="w-full mt-1 mb-4">
            <InputBox
              label="To"
              amount={convertedAmount}
              currencyOptions={options}
              onCurrencyChange={(currency) => setTo(currency)}
              selectCurrency={to}
              amountDisable
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg">
            Convert {from} to {to}
          </button>
        </form>
      </div>

      <div className="w-full max-w-4xl mt-[350px] bg-white rounded-lg p-4 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-center">
          Historical Exchange Rate: {from} to {to}
        </h2>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                label={{ 
                  value: `Exchange Rate (${to})`, 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                name={`${from}/${to} Rate`}
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;

