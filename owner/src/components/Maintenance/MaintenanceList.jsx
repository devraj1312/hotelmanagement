import MaintenanceStatusBadge from './MaintenanceStatusBadge';

const maintenanceIssues = [
  {
    id: 1,
    issue: 'AC not working in Room 204',
    reportedAt: '2025-08-01',
    status: 'Pending',
  },
  {
    id: 2,
    issue: 'Water leakage in kitchen',
    reportedAt: '2025-08-02',
    status: 'In Progress',
  },
  {
    id: 3,
    issue: 'Broken window in Room 103',
    reportedAt: '2025-07-30',
    status: 'Resolved',
  },
];

const MaintenanceList = () => {
  return (
    <div className="maintenance-list-container">
      <table className="maintenance-table">
        <thead>
          <tr>
            <th>Issue</th>
            <th>Reported On</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceIssues.map((item) => (
            <tr key={item.id}>
              <td>{item.issue}</td>
              <td>{item.reportedAt}</td>
              <td><MaintenanceStatusBadge status={item.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceList;
