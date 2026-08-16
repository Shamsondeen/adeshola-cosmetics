import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((num) => num + 1);

  return (
    <div className="pagination-container">
      
      {/* Left Arrow */}
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FiChevronLeft size={26} />
      </button>

      {/* Middle Bubble Bar */}
      <div className="page-bubble-wrapper">
        {pages.map((num) => (
          <button
            key={num}
            className={`page-number ${currentPage === num ? "active" : ""}`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FiChevronRight size={26} />
      </button>
    </div>
  );
};

export default Pagination;
