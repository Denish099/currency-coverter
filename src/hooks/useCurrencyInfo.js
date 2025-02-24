import { useState, useEffect } from "react";

const BASE_URL = 'https://v6.exchangerate-api.com/v6/b515331ed31092717d9ef7a1';

function useCurrencyInfo(currency) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch current rates
    fetch(`${BASE_URL}/latest/${currency}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.result === "success") {
          setData(res.conversion_rates);
          setLoading(false);
        } else {
          setError(res.message || 'Failed to fetch rates');
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching rates:', error);
        setError('Failed to fetch rates');
        setLoading(false);
      });
  }, [currency]);

  return { 
    currentRates: data, 
    loading, 
    error 
  };
}

export default useCurrencyInfo;