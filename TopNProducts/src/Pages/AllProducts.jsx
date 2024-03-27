import React, { useEffect, useState } from "react";
import axios from "axios";

const YourComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzExNTMxMzM0LCJpYXQiOjE3MTE1MzEwMzQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkyNjRlMmVhLTczZTctNGIzMC1hMjVhLTIwNGYwOTFmM2NhZiIsInN1YiI6InBqc3RseWVzMTNAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiI5MjY0ZTJlYS03M2U3LTRiMzAtYTI1YS0yMDRmMDkxZjNjYWYiLCJjbGllbnRTZWNyZXQiOiJJbXBtcWhESE5KU2FjaXBLIiwib3duZXJOYW1lIjoiUHJpeWFuc2h1Iiwib3duZXJFbWFpbCI6InBqc3RseWVzMTNAZ21haWwuY29tIiwicm9sbE5vIjoiMjExMDMxMDIifQ.pDOaVQLgW9Nn76zJ9s99_SPjl0mqsOeaduimKvhkZGw";

        const response = await axios.get(
          "https://cors-anywhere.herokuapp.com/http://20.244.56.144/test/companies/AMZ/categories/Laptop/products?top=10&minPrice=1&maxPrice=1000",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return <div>{data}</div>;
};

export default YourComponent;
