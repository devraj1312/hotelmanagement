// import { useState } from 'react';
import BookingFilterBar from '../components/Booking/BookingFilterBar';
import BookingTable from '../components/Booking/BookingTable';
// import Pagination from '../components/Common/Pagination';
import '../styles/booking.scss';


const Booking = () => {
  return (
    <div className="booking-overview">
      <h2>Booking Overview</h2>
      <BookingFilterBar />
      <BookingTable />
    </div>
  );
};

export default Booking;