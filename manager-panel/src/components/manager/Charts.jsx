import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Charts = () => {
  const occupancyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Occupied Rooms',
      data: [15, 22, 18, 25, 30, 28, 20],
      backgroundColor: '#00d1b2',
    }],
  };

  const revenueData = {
    labels: ['Room', 'Food', 'Laundry', 'Other'],
    datasets: [{
      data: [5500, 1800, 400, 300],
      backgroundColor: ['#00d1b2', '#1f2f46', '#4e2c13', '#708238'],
    }],
  };

  const bookingTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Bookings',
        data: [40, 55, 30, 65],
        fill: false,
        borderColor: '#708238',
        tension: 0.3,
        backgroundColor: '#f5b400',
        pointBorderColor: '#b88b4a',
      },
    ],
  };

  return (
    <div className="chart-section">
      <div className="chart-box">
        <h5>📊 Weekly Occupancy</h5>
        <Bar data={occupancyData} />
      </div>

      <div className="chart-box">
        <h5>💰 Revenue Split</h5>
        <Doughnut data={revenueData} />
      </div>

      <div className="chart-box">
        <h5>📈 Booking Trend</h5>
        <Line data={bookingTrendData} />
      </div>
    </div>
  );
};

export default Charts;
