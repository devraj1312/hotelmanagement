// src/components/DashboardWidgets/MaintenanceIssues.jsx

const MaintenanceIssues = () => {
  const issues = [
    { room: '201', issue: 'AC not working', reportedAt: '2 hours ago', assignedTo: 'Rajesh' },
    { room: '305', issue: 'Leaky faucet', reportedAt: '5 hours ago', assignedTo: 'Suresh' },
    { room: '112', issue: 'TV remote missing', reportedAt: '1 day ago', assignedTo: 'Amit' },
    { room: '201', issue: 'AC not working', reportedAt: '2 hours ago', assignedTo: 'Rajesh' },
    { room: '305', issue: 'Leaky faucet', reportedAt: '5 hours ago', assignedTo: 'Suresh' },
  ];

  return (
    <div className="dashboard-box-container">
      <h4>Pending Maintenance</h4>
      <ul className="maintenance-list">
        {issues.map((item, i) => (
          <li key={i}>
            <strong>Room {item.room}</strong> — {item.issue}<br />
            <small>🕒 {item.reportedAt} • 👷 {item.assignedTo}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaintenanceIssues;
