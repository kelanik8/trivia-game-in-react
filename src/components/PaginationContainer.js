import React from "react";

const PaginationContainer = ({
  currentQuestionIndex,
  onPrevQuestion,
  onNextQuestion,
}) => {
  return (
    <div className="pagination-container">
      {currentQuestionIndex !== 0 && (
        <button className="btn btn-primary" onClick={onPrevQuestion}>
          Prev
        </button>
      )}
      <button
        style={{ marginLeft: "auto" }}
        className="btn btn-primary"
        onClick={onNextQuestion}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationContainer;
