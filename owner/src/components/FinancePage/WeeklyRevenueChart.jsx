import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const WeeklyRevenueChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Weekly Revenue',
      data: [21000, 25000, 23000, 27000, 26000, 30000, 28000],
      fill: true,
      borderColor: '#1f2f46',
      backgroundColor: 'rgba(0,191,166,0.1)',
      tension: 0.4,
      pointBackgroundColor: '#00bfa6',
    }]
  };

  return (
    <div className="finance-box">
      <h5><i className="bi bi-graph-up"></i> Weekly Revenue</h5>
      <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
    </div>
  );
};

export default WeeklyRevenueChart;
