import '../styles/dashboard.scss';

// Components
import TopDashboardRow from '../components/DashboardWidgets/TopDashboardRow';
import MaintenanceIssues from '../components/DashboardWidgets/MaintenanceIssues';
import RecentFeedback from '../components/DashboardWidgets/RecentFeedback';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      {/* Top Row: Charts + Summary Cards */}
      <TopDashboardRow />

      {/* Bottom Row: Maintenance and Feedback */}
      <div className="dashboard-bottom-row">
        <MaintenanceIssues />
        <RecentFeedback />
      </div>
    </div>
  );
};

export default Dashboard;
