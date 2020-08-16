import React from "react";

const Footer = ({ currentQuestionIndex, questionsLength }) => {
  return (
    <footer>
      <p id="progress">
        Question {currentQuestionIndex + 1} of {questionsLength}
      </p>
    </footer>
  );
};

export default Footer;
