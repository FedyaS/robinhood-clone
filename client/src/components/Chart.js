import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PriceChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Open" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="High" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Low" stroke="#ffc658" />
        <Line type="monotone" dataKey="Close" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
