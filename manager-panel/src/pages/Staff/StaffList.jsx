import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import '../../styles/staff.scss';

const dummyStaff = [
  { id: 1, name: 'Rahul', role: 'Receptionist', salary: 15000 },
  { id: 2, name: 'Priya', role: 'Manager', salary: 25000 },
];

const StaffList = () => {
  const [staffList, setStaffList] = useState(dummyStaff);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      setStaffList(staffList.filter(staff => staff.id !== id));
    }
  };

  return (
    <div className="staff-container">
      <div className="staff-header">
        <h2>Staff Management</h2>
        <Link to="/manager/staff/add" className="btn btn-success">+ Add Staff</Link>
      </div>

      <Table bordered striped hover responsive className="text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Salary (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map(staff => (
            <tr key={staff.id}>
              <td>{staff.name}</td>
              <td>{staff.role}</td>
              <td>{staff.salary}</td>
              <td>
                <Link to={`/manager/staff/edit/${staff.id}`} className="btn btn-info me-2">Edit</Link>
                <Button variant="danger" onClick={() => handleDelete(staff.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StaffList;
