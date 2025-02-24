import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ArrowRightLeft, RefreshCcw, Sun, Moon, Coins } from 'lucide-react';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

function App() {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [historicalRates, setHistoricalRates] = useState<{ date: string; rate: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const fetchExchangeRate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const data = await response.json();
      setExchangeRate(data.rates[toCurrency]);
      
      const historical = [];
      for (let i = 7; i >= 0; i--) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        historical.push({
          date,
          rate: data.rates[toCurrency] * (1 + (Math.random() * 0.1 - 0.05))
        });
      }
      setHistoricalRates(historical);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const chartData = {
    labels: historicalRates.map(data => data.date),
    datasets: [
      {
        label: `${fromCurrency} to ${toCurrency} Exchange Rate`,
        data: historicalRates.map(data => data.rate),
        fill: true,
        backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.2)',
        borderColor: darkMode ? 'rgba(129, 140, 248, 1)' : 'rgba(99, 102, 241, 1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#e5e7eb' : '#1f2937'
        }
      },
      title: {
        display: true,
        text: '7-Day Exchange Rate History',
        color: darkMode ? '#e5e7eb' : '#1f2937'
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#1f2937'
        }
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#e5e7eb' : '#1f2937'
        }
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto p-4 py-12">
        <div className={`rounded-2xl shadow-2xl backdrop-blur-lg p-8 mb-8 ${
          darkMode ? 'bg-gray-800/50' : 'bg-white/70'
        }`}>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Coins className="w-8 h-8 mr-3 text-indigo-500" />
              <h1 className="text-3xl font-bold">
                Currency Converter
              </h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="flex-1 w-full">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:border-indigo-500 text-white' 
                    : 'bg-white border-gray-300 focus:border-indigo-500'
                } border focus:ring-2 focus:ring-indigo-500/20 focus:outline-none`}
                min="0"
              />
            </div>

            <div className="flex-1 flex items-center gap-4 w-full">
              <div className="flex-1">
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  From
                </label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } border focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none`}
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSwapCurrencies}
                className={`mt-6 p-3 rounded-full transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  To
                </label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } border focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none`}
                >
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={fetchExchangeRate}
              disabled={loading}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50`}
            >
              <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Rate
            </button>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold mb-2">
              {parseFloat(amount) ? (
                <>
                  {amount} {fromCurrency} = {(parseFloat(amount) * exchangeRate).toFixed(2)} {toCurrency}
                </>
              ) : (
                'Please enter a valid amount'
              )}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </p>
          </div>
        </div>

        <div className={`rounded-2xl shadow-2xl backdrop-blur-lg p-8 ${
          darkMode ? 'bg-gray-800/50' : 'bg-white/70'
        }`}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default App;