import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import '../../styles/room.scss';

const dummyRooms = [
  { id: 1, number: '101', type: 'Standard', price: 1200, capacity: 2, status: 'Available' },
  { id: 2, number: '102', type: 'Deluxe', price: 1800, capacity: 3, status: 'Occupied' },
  { id: 3, number: '201', type: 'Suite', price: 2500, capacity: 4, status: 'Available' },
];

const RoomList = () => (
  <div className="room-container">
    <div className="room-header">
      <h2>Room Management</h2>
      <Link to="/manager/rooms/add">
        <Button variant="success">+ Add Room</Button>
      </Link>
    </div>

    <Table bordered striped hover responsive className="text-center">
      <thead>
        <tr>
          <th>Room No.</th>
          <th>Type</th>
          <th>Capacity</th>
          <th>Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {dummyRooms.map(room => (
          <tr key={room.id}>
            <td>{room.number}</td>
            <td>{room.type}</td>
            <td>{room.capacity}</td>
            <td>₹{room.price}</td>
            <td>{room.status}</td>
            <td>
              <Link to={`/manager/rooms/edit/${room.id}`}>
                <Button variant="primary" size="sm">Edit</Button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

export default RoomList;
