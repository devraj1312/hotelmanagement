import React, { useState } from 'react';
import '../styles/Tickets.scss';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Tickets = () => {
  const [tickets, setTickets] = useState([
    { id: 101, client: 'Hotel Sunshine', subject: 'AC not working', status: 'Open', message: 'AC in room 203 is not cooling', reply: '' },
    { id: 102, client: 'Hotel Blue Sky', subject: 'Payment issue', status: 'Pending', message: 'Customer payment failed', reply: '' },
    { id: 103, client: 'Hotel Grand Palace', subject: 'Room cleaning delay', status: 'Resolved', message: 'Cleaning not done on time', reply: 'Issue fixed by staff' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.reply);
    setShowModal(true);
  };

  const handleReply = () => {
    setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, reply: replyText, status: 'Resolved' } : t));
    setShowModal(false);
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="tickets-page container-fluid p-4">
      <h2 className="mb-4">🎫 Tickets</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.client}</td>
              <td>{ticket.subject}</td>
              <td>
                <Form.Select 
                  value={ticket.status} 
                  onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                  size="sm"
                >
                  <option>Open</option>
                  <option>Pending</option>
                  <option>Resolved</option>
                </Form.Select>
              </td>
              <td>
                <Button variant="primary" size="sm" onClick={() => openModal(ticket)}>Reply</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Reply Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Ticket #{selectedTicket?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Client:</strong> {selectedTicket?.client}</p>
          <p><strong>Subject:</strong> {selectedTicket?.subject}</p>
          <p><strong>Message:</strong> {selectedTicket?.message}</p>

          <Form.Group>
            <Form.Label>Reply</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4} 
              value={replyText} 
              onChange={(e) => setReplyText(e.target.value)} 
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleReply}>Send Reply</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tickets;
