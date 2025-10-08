// src/components/DashboardWidgets/RecentFeedback.jsx

const RecentFeedback = () => {
  const feedbacks = [
    { name: 'Rohit S.', rating: 4.5, comment: 'Very clean room and polite staff.' },
    { name: 'Meena K.', rating: 3.0, comment: 'AC was noisy, but service was fast.' },
    { name: 'Aditya P.', rating: 5.0, comment: 'Great experience, will visit again.' },
    { name: 'Priya R.', rating: 4.0, comment: 'Nice location, food was okay.' },
    { name: 'Karan J.', rating: 2.5, comment: 'Bathroom wasn’t clean.' },
  ];

  const average = (
    feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length
  ).toFixed(1);

  return (
    <div className="dashboard-box-container">
      <h4>Recent Feedback</h4>
      <p className="avg-rating">⭐ Average: {average}/5</p>
      <ul className="feedback-list">
        {feedbacks.map((item, i) => (
          <li key={i}>
            <strong>{item.name}</strong>: <span>⭐ {item.rating}</span><br />
            <small>{item.comment}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentFeedback;
