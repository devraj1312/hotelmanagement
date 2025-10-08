const MaintenanceStatusBadge = ({ status }) => {
  let badgeClass = '';
  if (status === 'Pending') badgeClass = 'badge-pending';
  else if (status === 'In Progress') badgeClass = 'badge-progress';
  else if (status === 'Resolved') badgeClass = 'badge-resolved';

  return <span className={`maintenance-badge ${badgeClass}`}>{status}</span>;
};

export default MaintenanceStatusBadge;
