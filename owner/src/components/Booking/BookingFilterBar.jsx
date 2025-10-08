import React from 'react';

const BookingFilterBar = () => {
  return (
    <div className="booking-filter-bar">
      <input type="text" placeholder="Search by guest name..." />
      <select>
        <option value="all">All Status</option>
        <option value="confirmed">Confirmed</option>
        <option value="pending">Pending</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
};

export default BookingFilterBar;