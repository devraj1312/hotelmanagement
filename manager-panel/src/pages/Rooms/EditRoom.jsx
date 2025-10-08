import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import '../../styles/room.scss';

const EditRoom = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    number: '101',
    type: 'Standard',
    price: 1200,
    capacity: 2,
    status: 'Available',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Room:', formData);
  };

  return (
    <div className="room-form-container">
      <h2>Edit Room #{id}</h2>
      <Form className="room-form" onSubmit={handleSubmit}>
        <Form.Group controlId="roomNumber">
          <Form.Label>Room Number</Form.Label>
          <Form.Control
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="roomType">
          <Form.Label>Type</Form.Label>
          <Form.Select name="type" value={formData.type} onChange={handleChange}>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="roomCapacity">
          <Form.Label>Capacity</Form.Label>
          <Form.Control
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="roomPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="roomStatus">
          <Form.Label>Status</Form.Label>
          <Form.Select name="status" value={formData.status} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" className="btn-update mt-3">
          Update Room
        </Button>
      </Form>
    </div>
  );
};

export default EditRoom;
