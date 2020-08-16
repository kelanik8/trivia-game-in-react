import React from "react";
import ReactHtmlParser from "react-html-parser";

const QuestionContainer = ({ currentQuestion, onOptions }) => {
  return (
    <>
      <p>
        Category: {currentQuestion.category} | Difficulty{" "}
        {currentQuestion.difficulty}
      </p>
      <h2 id="question" className="question-headline">
        {ReactHtmlParser(currentQuestion.question)}
      </h2>
      <br />

      {currentQuestion.options.map((opt, i) => (
        <button
          key={i}
          disabled={currentQuestion.answered}
          className={`btn btn-primary br-50 ${
            currentQuestion.answered &&
            currentQuestion.seletedOption === opt.text &&
            opt.correct &&
            "correct"
          } ${
            currentQuestion.answered &&
            currentQuestion.seletedOption === opt.text &&
            !opt.correct &&
            "wrong"
            }`}
          onClick={() => onOptions(opt, currentQuestion.difficulty)}
        >
          {ReactHtmlParser(opt.text)}
        </button>
      ))}
    </>
  );
};

export default QuestionContainer;