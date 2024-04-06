import React, { useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {useSelector } from "react-redux";
function ChartComponent() {
  const [data, setData] = useState([]);
  const chart = useSelector((state) => state.revenue.chart);
  useEffect(() => {

    const groupedData = chart.reduce((acc, item) => {
      const date = parseISO(item.createdAt);
      const month = format(date, 'yyyy-MM');

      if (!acc[month]) {
        acc[month] = [];
      }

      acc[month].push(item);
      return acc;
    }, {});


    const chartData = Object.entries(groupedData).map(([month, values]) => {
      const totalRevenue = values.reduce((sum, item) => sum + item.revenue, 0);
      const totalSale = values.reduce((sum, item) => sum + item.sale, 0); // Thêm phần này
      return { month, totalRevenue, totalSale }; // Thêm totalSale vào đây
    });

    setData(chartData);
  }, []);

  return (
    <div>
      <h2>Doanh số bán hàng theo tháng</h2>
      <LineChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" activeDot={{ r: 8 }} name="Doanh số tháng" />
  <Line type="monotone" dataKey="totalSale" stroke="white" activeDot={{ r: 8 }} name="Số lượng đơn hàng" /> 
</LineChart>
    </div>
  );
}

export default ChartComponent;