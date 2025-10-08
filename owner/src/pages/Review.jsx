import React from 'react';
import ReviewList from '../components/Reviews/ReviewList';
import '../styles/reviews.scss';

const Review = () => {
  return (
    <div className="reviews-page">
      <h2>Ratings & Reviews</h2>
      <ReviewList />
    </div>
  );
};

export default Review;
