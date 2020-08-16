import React from "react";

const Leaderboard = ({ leaderboards }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  return (
    <div>
      <h2>Leaderboard</h2>
      <br />

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Date</th>
            <th>Answers</th>
          </tr>
        </thead>
        <tbody>
          {leaderboards.map((user, i) => (
            <tr key={i}>
              <td>{user.username}</td>
              <td>{formatDate(user.date)}</td>
              <td>{user.answers}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="btn btn-primary"
        onClick={() => (window.location = "/")}
      >
        Play Again
      </button>
    </div>
  );
};

export default Leaderboard;
