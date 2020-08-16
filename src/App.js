import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import PointsContainer from "./components/PointsContainer";
import AnswersGiven from "./components/AnswersGiven";
import FormContainer from "./components/FormContainer";
import PaginationContainer from "./components/PaginationContainer";
import Leaderboard from "./components/Leaderboard";
import QuestionContainer from "./components/QuestionContainer";
import Footer from "./components/Footer";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import API from "./API";
import "./App.css";

function App() {
  const [questions, setQuestion] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [points, setPoints] = useState(24);
  const [leaderboards, setLeaderBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    isLoaded: false,
  });

  const fetchQuestions = async () => {
    try {
      setIsLoading(() => true);
      const response = await API.get("/api.php?amount=10");
      setIsLoading(() => false);
      formatQuestions(response.data.results);
    } catch (error) {
      setIsLoading(() => false);
      alert("An Error Occured, Try Refreshing");
    }
  };

  const formatQuestions = (response) => {
    let formattedQuestions = [];
    response.forEach((el, i) => {
      let options = [
        {
          text: el.correct_answer,
          correct: true,
          active: false,
        },
      ];
      el.incorrect_answers.forEach((el) => {
        options.push({
          text: el,
          correct: false,
          active: false,
        });
      });
      options.sort(() => Math.random() - 0.5);
      formattedQuestions.push({ ...el, options, answered: false, index: i });
    });
    setQuestion(formattedQuestions);
    setCurrentQuestion(formattedQuestions[0]);
  };

  const handleOptions = async (option, difficulty) => {
    setCurrentQuestion({
      ...currentQuestion,
      answered: true,
      seletedOption: option.text,
      correct: option.correct,
    });
    setQuestion((prevQsts) => {
      prevQsts[currentQuestion.index].answered = true;
      prevQsts[currentQuestion.index].seletedOption = option.text;
      prevQsts[currentQuestion.index].correct = option.correct;
      return prevQsts;
    });

    difficulty = difficulty.toLowerCase();

    if (option.correct && difficulty === "easy") {
      setPoints((prevPoint) => prevPoint - 2);
    }

    if (option.correct && difficulty === "medium") {
      setPoints((prevPoint) => prevPoint - 4);
    }

    if (option.correct && difficulty === "hard") {
      setPoints((prevPoint) => prevPoint - 8);
    }

    if (!option.correct && difficulty === "easy") {
      setPoints((prevPoint) => prevPoint + 2);
    }

    if (!option.correct && difficulty === "medium") {
      setPoints((prevPoint) => prevPoint + 4);
    }

    if (!option.correct && difficulty === "hard") {
      setPoints((prevPoint) => prevPoint + 8);
    }

    if (points <= 0) {
      setQuizFinished(true);
    }

    if (currentQuestionIndex >= questions.length) {
      setQuizFinished(true);
    }
  };

  const handleNextQuestion = () => {
    let qstIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setCurrentQuestion(() => questions[qstIndex]);
  };

  const handlePrevQuestion = () => {
    let qstIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    setCurrentQuestion(() => questions[qstIndex]);
  };

  const formatAnswersGiven = () => {
    let count = 0;
    questions.forEach((qst) => {
      qst.correct && count++;
    });
    return count;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let users = localStorage.getItem("users");
    if (users) {
      users = JSON.parse(users);
      const user = users.find((user, i) => {
        if (user.username === form.username) {
          return i;
        }
      });

      if (user) {
        users[user] = {
          date: new Date(),
          answers: formatAnswersGiven(),
          points,
          ...form,
        };
      } else {
        users.push({
          date: new Date(),
          answers: formatAnswersGiven(),
          points,
          ...form,
        });
      }

      localStorage.setItem("users", JSON.stringify(users));
    } else {
      users = [];
      users.push({
        date: new Date(),
        answers: formatAnswersGiven(),
        points,
        ...form,
      });

      localStorage.setItem("users", JSON.stringify(users));
    }

    setLeaderBoards(users.slice(0, 10));

    setForm({
      ...form,
      isLoaded: true,
    });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="page-container">
      <div id="quiz" className="centered w-8">
        <h1 className="headline">Welcome to TrustLayer Trivia</h1>
        <div className="score-container">
          <PointsContainer points={points} />
        </div>
        {isLoading ? (
          <Loader
            className="text-center"
            type="RevolvingDot"
            color="#00BFFF"
            height={100}
            width={100}
          />
        ) : (
          <>
            {currentQuestion && points ? (
              <>
                <QuestionContainer
                  currentQuestion={currentQuestion}
                  onOptions={handleOptions}
                />

                {questions.length && (
                  <PaginationContainer
                    currentQuestionIndex={currentQuestion.index}
                    onPrevQuestion={handlePrevQuestion}
                    onNextQuestion={handleNextQuestion}
                  />
                )}
              </>
            ) : (
              <>
                <h2>Game Over</h2>
                <div className="score-container">
                  <AnswersGiven answers={formatAnswersGiven()} />
                </div>
                <br />
                <br />
                <br />
                {!form.isLoaded ? (
                  <FormContainer
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                  />
                ) : (
                  <Leaderboard leaderboards={leaderboards} />
                )}
              </>
            )}
          </>
        )}

        <Footer
          currentQuestionIndex={currentQuestionIndex}
          questionsLength={questions.length}
        />
      </div>
    </div>
  );
}

export default App;
