import StarRating from './StarRating';

const reviews = [
  {
    id: 1,
    guest: 'Aman Sharma',
    rating: 5,
    review: 'Excellent service and clean rooms!',
    relatedTo: 'Room 101',
    date: '2025-08-04',
  },
  {
    id: 2,
    guest: 'Pooja Mehta',
    rating: 4,
    review: 'Reception staff was very helpful.',
    relatedTo: 'Reception - Staff',
    date: '2025-08-03',
  },
  {
    id: 3,
    guest: 'Rahul Verma',
    rating: 3,
    review: 'Food was okay, could be better.',
    relatedTo: 'Cafeteria',
    date: '2025-08-01',
  },
];

const ReviewList = () => {
  return (
    <div className="review-list">
      {reviews.map((r) => (
        <div key={r.id} className="review-card">
          <div className="review-header">
            <strong>{r.guest}</strong>
            <span>{r.date}</span>
          </div>
          <StarRating rating={r.rating} />
          <p>{r.review}</p>
          <small>Related to: {r.relatedTo}</small>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
