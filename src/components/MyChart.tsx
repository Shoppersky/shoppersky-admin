import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Jan', uv: 400 },
  { name: 'Feb', uv: 300 },
  { name: 'Mar', uv: 500 },
];

export function MyChart() {
  return (
    <ResponsiveContainer width="100%" height={300} debounce={200}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}