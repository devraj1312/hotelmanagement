import React, { useState } from 'react';
import '../styles/Subscriptions.scss';
import { Modal, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, plan: 'Basic', price: '$100', duration: '1 Month', expiry: '2025-09-15' },
    { id: 2, plan: 'Standard', price: '$250', duration: '3 Months', expiry: '2025-11-01' },
    { id: 3, plan: 'Premium', price: '$900', duration: '12 Months', expiry: '2026-08-01' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newSub, setNewSub] = useState({ plan: '', price: '', duration: '', expiry: '' });

  const handleAddSubscription = () => {
    setSubscriptions([...subscriptions, { ...newSub, id: Date.now() }]);
    setNewSub({ plan: '', price: '', duration: '', expiry: '' });
    setShowModal(false);
  };

  const handleRemoveSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  return (
    <div className="subscriptions-page container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>💼 Subscriptions</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>Add Subscription</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Expiry</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.plan}</td>
              <td>{sub.price}</td>
              <td>{sub.duration}</td>
              <td>{sub.expiry}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleRemoveSubscription(sub.id)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Subscription Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-2">
            <label>Plan</label>
            <input
              type="text"
              className="form-control"
              value={newSub.plan}
              onChange={(e) => setNewSub({ ...newSub, plan: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Price</label>
            <input
              type="text"
              className="form-control"
              value={newSub.price}
              onChange={(e) => setNewSub({ ...newSub, price: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Duration</label>
            <input
              type="text"
              className="form-control"
              value={newSub.duration}
              onChange={(e) => setNewSub({ ...newSub, duration: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Expiry</label>
            <input
              type="date"
              className="form-control"
              value={newSub.expiry}
              onChange={(e) => setNewSub({ ...newSub, expiry: e.target.value })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleAddSubscription}>Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Subscriptions;
