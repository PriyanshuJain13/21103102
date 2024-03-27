const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());

const WINDOW_SIZE = 10;
let storedNumbers = [];


const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
};

const fetchNumbersFromServer = async (numberid) => {
  const url = `http://20.244.56.144/test/${numberid}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzExNTMxMzM0LCJpYXQiOjE3MTE1MzEwMzQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkyNjRlMmVhLTczZTctNGIzMC1hMjVhLTIwNGYwOTFmM2NhZiIsInN1YiI6InBqc3RseWVzMTNAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiI5MjY0ZTJlYS03M2U3LTRiMzAtYTI1YS0yMDRmMDkxZjNjYWYiLCJjbGllbnRTZWNyZXQiOiJJbXBtcWhESE5KU2FjaXBLIiwib3duZXJOYW1lIjoiUHJpeWFuc2h1Iiwib3duZXJFbWFpbCI6InBqc3RseWVzMTNAZ21haWwuY29tIiwicm9sbE5vIjoiMjExMDMxMDIifQ.pDOaVQLgW9Nn76zJ9s99_SPjl0mqsOeaduimKvhkZGw",
      },
    });
    return response.data.numbers;
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    return [];
  }
};

const updateStoredNumbers = (newNumbers) => {
  storedNumbers = [
    ...newNumbers,
    ...storedNumbers.slice(0, WINDOW_SIZE - newNumbers.length),
  ];
};

// Routes
app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;

  const responseTimeLimit = 500; // ms

  const startTime = Date.now();
  const fetchedNumbers = await Promise.race([
    fetchNumbersFromServer(numberid),
    new Promise((resolve) => setTimeout(resolve, responseTimeLimit, [])),
  ]);

  const endTime = Date.now();
  const responseTime = endTime - startTime;

  if (responseTime > responseTimeLimit) {
    res.status(500).send("Response time exceeded");
    return;
  }

  const uniqueNewNumbers = [...new Set(fetchedNumbers)];
  updateStoredNumbers(uniqueNewNumbers);

  const average = calculateAverage(storedNumbers.slice(0, WINDOW_SIZE));

  res.json({
    windowPrevState: storedNumbers.slice(
      0,
      WINDOW_SIZE - uniqueNewNumbers.length
    ),
    windowCurrState: storedNumbers.slice(0, WINDOW_SIZE),
    numbers: uniqueNewNumbers,
    avg: average.toFixed(2),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
