import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import '../../styles/tickets.scss';

const dummyTickets = [
  { id: 1, subject: 'Room not cleaned', message: 'Room 205 has not been cleaned properly.', guest: 'Ravi', status: 'Open' },
  { id: 2, subject: 'AC not working', message: 'AC in room 101 is not cooling.', guest: 'Anita', status: 'Resolved' },
];

const TicketList = () => {
  const [tickets, setTickets] = useState(dummyTickets);

  const handleStatusChange = (id, newStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="ticket-container">
      <h2>🎟 Support Tickets</h2>

      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Message</th>
            <th>Guest</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.subject}</td>
              <td>{ticket.message}</td>
              <td>{ticket.guest}</td>
              <td>{ticket.status}</td>
              <td>
                {ticket.status === 'Open' && (
                  <Button 
                    variant="warning" 
                    size="sm"
                    onClick={() => handleStatusChange(ticket.id, 'Resolved')}
                  >
                    Mark Resolved
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TicketList;
