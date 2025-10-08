import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import '../../styles/staff.scss';

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    salary: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Staff:", formData);
  };

  return (
    <div className="staff-form-container">
      <h2>Add Staff Member</h2>
      <Form onSubmit={handleSubmit} className="staff-form">
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="staffName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Staff Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="staffRole">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Manager">Manager</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="staffSalary">
          <Form.Label>Salary</Form.Label>
          <Form.Control
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="success">Add Staff</Button>
      </Form>
    </div>
  );
};

export default AddStaff;
