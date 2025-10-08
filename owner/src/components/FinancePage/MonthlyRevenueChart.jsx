import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const MonthlyRevenueChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Revenue',
      data: [120000, 135000, 150000, 180000, 175000, 190000],
      backgroundColor: '#00bfa6',
      borderRadius: 6
    }]
  };

  return (
    <div className="finance-box">
      <h5><i className="bi bi-bar-chart-line"></i> Monthly Revenue</h5>
      <Bar data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
    </div>
  );
};

export default MonthlyRevenueChart;
