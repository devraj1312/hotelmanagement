// src/components/Common/Pagination.jsx
import './Pagination.scss';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ⬅ Prev
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          className={`pagination-btn ${currentPage === num ? 'active' : ''}`}
          onClick={() => handleClick(num)}
        >
          {num}
        </button>
      ))}

      <button
        className="pagination-btn"
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next ➡
      </button>
    </div>
  );
};

export default Pagination;
