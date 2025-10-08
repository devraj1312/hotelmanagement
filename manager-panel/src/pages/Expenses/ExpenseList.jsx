// src/pages/Expenses/ExpenseList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import '../../styles/expenses.scss';

const dummyExpenses = [
  { id: 1, category: 'Maintenance', amount: 1200, date: '2025-08-01' },
  { id: 2, category: 'Food & Beverages', amount: 800, date: '2025-08-02' },
  { id: 3, category: 'Electricity', amount: 5000, date: '2025-08-03' },
];

const ExpenseList = () => {
  return (
    <div className="expense-container">
      <div className="expense-header">
        <h2>💸 Expense Management</h2>
        <Link to="/manager/expenses/add">
          <Button variant="success">+ Add Expense</Button>
        </Link>
      </div>

      <Table striped bordered hover responsive className="text-center mt-3">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount (₹)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {dummyExpenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.category}</td>
              <td>₹{exp.amount}</td>
              <td>{exp.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ExpenseList;
