import React, { useEffect, useState } from 'react';
import '../styles/styles.scss';

const Header = () => {
  const [dateTime, setDateTime] = useState({
    date: '',
    time: ''
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const formattedTime = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      setDateTime({ date: formattedDate, time: formattedTime });
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 60000); // update every 1 minute

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="header">
      <h3 className="hotel-name">🏨 Hotel Grand Palace</h3>

      <div className="header-right">
        <span className="datetime">{dateTime.date} | {dateTime.time}</span>
        <span className="manager-name">🧑 Manager: Rajesh</span>
        <button className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Header;
