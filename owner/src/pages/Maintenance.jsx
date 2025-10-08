import React from 'react';
import MaintenanceList from '../components/Maintenance/MaintenanceList';
import '../styles/maintenance.scss';

const Maintenance = () => {
  return (
    <div className="maintenance-page">
      <h2>Maintenance Logs</h2>
      <MaintenanceList />
    </div>
  );
};

export default Maintenance;
