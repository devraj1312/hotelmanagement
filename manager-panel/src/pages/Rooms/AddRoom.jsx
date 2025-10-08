import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import '../../styles/room.scss';

const AddRoom = () => {
  const [formData, setFormData] = useState({
    number: '',
    type: '',
    price: '',
    capacity: '',
    status: 'Available',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Room Data:', formData);
  };

  return (
    <div className="room-form-container">
      <h2>Add New Room</h2>
      <Form onSubmit={handleSubmit} className="room-form">
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formNumber">
              <Form.Label>Room Number</Form.Label>
              <Form.Control
                type="text"
                name="number"
                placeholder="Enter room number"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="formType">
              <Form.Label>Room Type</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Room Type</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formCapacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                placeholder="Enter capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formStatus">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="success">Save Room</Button>
      </Form>
    </div>
  );
};

export default AddRoom;
