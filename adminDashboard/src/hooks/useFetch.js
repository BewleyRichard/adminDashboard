/* This is a custom hook which takes a URL and returns an object with data, loading, error,
and reFetch properties.

The data property stores the response data fetched from the given URL,
loading indicates whether the data is still being fetched, and error indicates if there was an error in the process.

The reFetch function can be used to refetch the data from the same URL. 
This hook uses the useState and useEffect hooks from React and axios to fetch the data from the given URL. */

import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url);
        setData(res.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export default useFetch;