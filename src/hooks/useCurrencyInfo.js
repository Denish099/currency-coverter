import { useState, useEffect } from "react";

const API_KEY = 'fca_live_PvWoPcymzhQUSKD8RA49mLi5t3kjaUMF5tqeNyZO'; 
const BASE_URL = 'https://api.freecurrencyapi.com/v1';

function useCurrencyInfo(currency) {
  const [data, setData] = useState({});
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    // Fetch current rates
    fetch(`${BASE_URL}/latest?apikey=${API_KEY}&base_currency=${currency}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          setData(res.data);
        }
      })
      .catch((error) => console.error('Error fetching current rates:', error));

    // Fetch historical data for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    fetch(
      `${BASE_URL}/historical?apikey=${API_KEY}&base_currency=${currency}&date_from=${startDate.toISOString().split('T')[0]}&date_to=${endDate.toISOString().split('T')[0]}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          const histData = Object.entries(res.data).map(([date, rates]) => ({
            date,
            ...rates,
          }));
          setHistoricalData(histData);
        }
      })
      .catch((error) => console.error('Error fetching historical data:', error));
  }, [currency]);

  return { currentRates: data, historicalData };
}

export default useCurrencyInfo;