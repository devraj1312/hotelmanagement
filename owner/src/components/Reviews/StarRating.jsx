import { Fragment } from 'react';

const StarRating = ({ rating }) => {
  const totalStars = 5;

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => (
        <Fragment key={index}>
          {index < rating ? (
            <i className="bi bi-star-fill filled"></i>
          ) : (
            <i className="bi bi-star"></i>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default StarRating;
