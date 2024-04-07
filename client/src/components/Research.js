import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the chart.js components we will use
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = ({ data }) => {
  // Mocking data similar to a yfinance API call
  const history_price = [100, 101, 102, 103, 102, 101, 102]; // Example stock prices
  const curr_price = 102; // Current price of the stock
  const datetime = ['2024-04-01', '2024-04-02', '2024-04-03', '2024-04-04', '2024-04-05', '2024-04-06', '2024-04-07']; // Example dates
  const ticker = 'GOOG'; // Stock ticker symbol
  const pe_ratio = 30; // P/E Ratio, just as an example

  const chartData = {
    labels: datetime,
    datasets: [
      {
        label: `${ticker} Price`,
        data: history_price,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Stock Price Chart for ${ticker}`,
      },
    },
  };

  return (
    <div>
      <h2>Stock Chart for {ticker}</h2>
      <p>Last Price: {curr_price} (P/E Ratio: {pe_ratio})</p>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart;
