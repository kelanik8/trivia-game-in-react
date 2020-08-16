import React from "react";

const AnswersGiven = ({ answers }) => (
  <button className="score-btn" style={{ top: "30px" }}>
    Answered: {answers}
  </button>
);

export default AnswersGiven;
