import React from 'react';

const BookingTable = () => {
  const dummyBookings = [
    { id: 1, guest: 'John Doe', room: '101', status: 'Confirmed', date: '2025-08-01' },
    { id: 2, guest: 'Jane Smith', room: '202', status: 'Pending', date: '2025-08-02' },
    { id: 3, guest: 'Raj Mehra', room: '303', status: 'Cancelled', date: '2025-08-03' },
  ];

  return (
    <table className="booking-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Guest</th>
          <th>Room</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {dummyBookings.map((booking) => (
          <tr key={booking.id}>
            <td>{booking.id}</td>
            <td>{booking.guest}</td>
            <td>{booking.room}</td>
            <td>{booking.status}</td>
            <td>{booking.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookingTable;