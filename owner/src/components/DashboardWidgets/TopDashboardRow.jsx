// src/components/DashboardWidgets/TopDashboardRow.jsx

import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const TopDashboardRow = () => {
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [120000, 150000, 180000, 170000, 200000],
        backgroundColor: '#00bfa6',
        borderRadius: 6,
      },
    ],
  };

  const occupancyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Occupancy (%)',
        data: [78, 85, 90, 87, 92],
        borderColor: '#1f2f46',
        backgroundColor: 'rgba(31,47,70,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00bfa6',
      },
    ],
  };

  return (
    <div className="dashboard-row-inline">
      {/* Revenue Chart */}
      <div className="chart-box small">
        <h4>Revenue</h4>
        <Bar data={revenueData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>

      {/* Occupancy Line Chart */}
      <div className="chart-box small">
        <h4>Occupancy</h4>
        <Line data={occupancyData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>

      {/* Summary Cards */}
      <div className="card-grid-2x2">
        <div className="summary-card small">
          <i className="bi bi-building"></i>
          <h5>Total Hotels</h5>
          <p>18</p>
        </div>
        <div className="summary-card small">
          <i className="bi bi-credit-card"></i>
          <h5>Subscriptions</h5>
          <p>14</p>
        </div>
        <div className="summary-card small">
          <i className="bi bi-exclamation-diamond"></i>
          <h5>Open Tickets</h5>
          <p>5</p>
        </div>
        <div className="summary-card small">
          <i className="bi bi-cash-stack"></i>
          <h5>Total Revenue</h5>
          <p>₹12.8L</p>
        </div>
      </div>
    </div>
  );
};

export default TopDashboardRow;
