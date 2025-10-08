import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import '../../styles/maintenance.scss';

const dummyIssues = [
  { id: 1, room: '101', issue: 'AC not working', reportedBy: 'Rahul', status: 'Pending' },
  { id: 2, room: '203', issue: 'Water leakage', reportedBy: 'Receptionist', status: 'Approved' },
];

const MaintenanceList = () => {
  const [issues, setIssues] = useState(dummyIssues);

  const handleStatusChange = (id, newStatus) => {
    setIssues(issues.map(issue => issue.id === id ? { ...issue, status: newStatus } : issue));
  };

  return (
    <div className="maintenance-container">
      <h2>🛠 Maintenance Logs</h2>

      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th>Room</th>
            <th>Issue</th>
            <th>Reported By</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue => (
            <tr key={issue.id}>
              <td>{issue.room}</td>
              <td>{issue.issue}</td>
              <td>{issue.reportedBy}</td>
              <td>{issue.status}</td>
              <td>
                {issue.status === 'Pending' && (
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => handleStatusChange(issue.id, 'Approved')}
                  >
                    Approve
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MaintenanceList;
