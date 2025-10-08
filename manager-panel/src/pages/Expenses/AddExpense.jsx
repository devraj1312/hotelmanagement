import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../../styles/expenses.scss';

const AddExpense = () => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Expense:', formData);
    // Save to backend later
  };

  return (
    <div className="expense-form-container">
      <h2>Add Expense</h2>
      <Form onSubmit={handleSubmit} className="expense-form">
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select name="category" required onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Electricity">Electricity</option>
            <option value="Salaries">Salaries</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            placeholder="Enter amount"
            required
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            required
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit" variant="primary">Save Expense</Button>
      </Form>
    </div>
  );
};

export default AddExpense;
