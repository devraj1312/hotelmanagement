import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import '../../styles/booking.scss';

const dummyBookings = [
  { id: 1, customer: 'Amit Sharma', room: '101', checkIn: '2025-08-01', checkOut: '2025-08-04', status: 'Pending' },
  { id: 2, customer: 'Priya Verma', room: '102', checkIn: '2025-08-02', checkOut: '2025-08-05', status: 'Confirmed' },
  { id: 3, customer: 'Rahul Singh', room: '103', checkIn: '2025-08-03', checkOut: '2025-08-06', status: 'Cancelled' },
];

const BookingList = () => {
  const [bookings, setBookings] = useState(dummyBookings);

  const updateStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  return (
    <div className="booking-container">
      <h2>📘 Booking Overview</h2>

      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Room No.</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.customer}</td>
              <td>{b.room}</td>
              <td>{b.checkIn}</td>
              <td>{b.checkOut}</td>
              <td>{b.status}</td>
              <td>
                {b.status === 'Pending' && (
                  <>
                    <Button variant="success" size="sm" className="me-2" onClick={() => updateStatus(b.id, 'Confirmed')}>Approve</Button>
                    <Button variant="danger" size="sm" onClick={() => updateStatus(b.id, 'Rejected')}>Reject</Button>
                  </>
                )}
                {b.status === 'Confirmed' && (
                  <Button variant="warning" size="sm" onClick={() => updateStatus(b.id, 'Cancelled')}>Cancel</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BookingList;
