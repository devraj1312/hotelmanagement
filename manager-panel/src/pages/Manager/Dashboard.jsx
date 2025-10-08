import React from 'react';
import '../../styles/styles.scss';
import SummaryCards from '../../components/manager/SummaryCards';
import Charts from '../../components/manager/Charts';
import ActivityList from '../../components/manager/ActivityList';

const Dashboard = () => {
  return (
    <div className="manager-dashboard">
      {/* <h2 className="dashboard-title">👋 Welcome, Manager!</h2> */}
      <SummaryCards />
      <Charts />
      <ActivityList />
    </div>
  );
};

export default Dashboard;
