import React from 'react';

const cards = [
  { label: 'Total Rooms', value: 80 },
  { label: 'Available Rooms', value: 24 },
  { label: 'Total Staff', value: 12 },
  { label: 'Total Staff', value: 12 },
  { label: 'Today\'s Revenue', value: '₹7,800' },
];

const SummaryCards = () => (
  <div className="summary-cards">
    {cards.map((card, i) => (
      <div className="card-box" key={i}>
        <h4>{card.label}</h4>
        <p>{card.value}</p>
      </div>
    ))}
  </div>
);

export default SummaryCards;
