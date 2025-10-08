import React from 'react';

const activities = [
  'Room 203 booked by Aman - ₹2500',
  'AC maintenance requested in Room 301',
  'Ravi Sharma added as Housekeeping',
  '2 tickets resolved today',
];

const ActivityList = () => (
  <div className="activity-list">
    <h5>📋 Recent Activities</h5>
    <ul>
      {activities.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  </div>
);

export default ActivityList;
