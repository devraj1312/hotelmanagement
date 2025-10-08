import React from 'react';
import '../styles/dashboard.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

// Chart.js imports
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// Summary Card
const SummaryCard = ({ title, value, icon, color }) => (
  <div className="summary-card border-start border-4" style={{ borderColor: color }}>
    <div className="card-icon">{icon}</div>
    <div className="card-info">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  </div>
);

const Dashboard = () => {
  // Dummy data for charts
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [5000, 7000, 4000, 9000, 6000, 8000],
        borderColor: '#00bfa6',
        backgroundColor: 'rgba(0,191,166,0.2)',
        tension: 0.3
      }
    ]
  };

  const hotelsData = {
    labels: ['Hotel A', 'Hotel B', 'Hotel C', 'Hotel D', 'Hotel E'],
    datasets: [
      {
        label: 'Hotels Joined',
        data: [5, 3, 2, 4, 1],
        backgroundColor: '#1f2f46'
      }
    ]
  };

  return (
    <div className="dashboard-page container-fluid">
      {/* Top Row: Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <SummaryCard title="Total Hotels" value="25" icon="🏨" color="#00bfa6" />
        </div>
        <div className="col-md-3">
          <SummaryCard title="Active Subscriptions" value="18" icon="📄" color="#1f2f46" />
        </div>
        <div className="col-md-3">
          <SummaryCard title="Open Tickets" value="7" icon="🎫" color="#ef4444" />
        </div>
        <div className="col-md-3">
          <SummaryCard title="Total Revenue" value="$45,000" icon="💰" color="#22c55e" />
        </div>
      </div>

      {/* Graphs Row */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="chart-card card p-3 mb-3">
            <h5>Monthly Revenue</h5>
            <Line data={revenueData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="chart-card card p-3 mb-3">
            <h5>Hotels Joined</h5>
            <Bar data={hotelsData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activities */}
      <div className="row">
        <div className="col-md-6">
          <div className="activity-box card p-3 mb-3">
            <h5>Recent Tickets</h5>
            <ul className="list-unstyled">
              <li>Ticket #1023 - AC not working</li>
              <li>Ticket #1022 - Room cleaning pending</li>
              <li>Ticket #1021 - Payment issue</li>
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="activity-box card p-3 mb-3">
            <h5>Recent Feedback</h5>
            <ul className="list-unstyled">
              <li>Hotel Sunshine - ⭐⭐⭐⭐</li>
              <li>Hotel Blue Sky - ⭐⭐⭐</li>
              <li>Hotel Grand Palace - ⭐⭐⭐⭐⭐</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
