import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import '../../styles/book-room.scss';

const BookRoom = () => {
  const [roomType, setRoomType] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);

  const roomData = {
    Single: ['101', '102', '103'],
    Double: ['201', '202'],
    Suite: ['301'],
  };

  const handleRoomTypeChange = (e) => {
    const type = e.target.value;
    setRoomType(type);
    setAvailableRooms(roomData[type] || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Room booked successfully!');
  };

  return (
    <div className="book-room-container">
      <h2>Room Booking</h2>
      <Form className="book-room-form" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Control type="text" placeholder="Customer Name" required />
          </Col>
          <Col>
            <Form.Control type="number" placeholder="Phone Number" required />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Control type="email" placeholder="Email" required />
          </Col>
          <Col>
            <Form.Select value={roomType} onChange={handleRoomTypeChange} required>
              <option value="">Select Room Type</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Select required>
              <option value="">Select Room Number</option>
              {availableRooms.map(room => (
                <option key={room} value={room}>{room}</option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Control type="date" placeholder="Check-in Date" required />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Control type="date" placeholder="Check-out Date" required />
          </Col>
        </Row>

        <Button type="submit" variant="success">Book Room</Button>
      </Form>
    </div>
  );
};

export default BookRoom;
