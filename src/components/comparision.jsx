import { useState, useEffect } from "react";
import axios from "axios";
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

const API_KEY = b515331ed31092717d9ef7a1;

const CurrencyComparisonChart = ({ baseCurrency, targetCurrency }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/timeseries/${baseCurrency}/${targetCurrency}/last-30-days`,
        );

        const rates = response.data.conversion_rates;
        const chartData = Object.keys(rates).map((date) => ({
          date,
          rate: rates[date],
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching exchange rate data:", error);
      }
    };

    fetchData();
  }, [baseCurrency, targetCurrency]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="rate" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CurrencyComparisonChart;
