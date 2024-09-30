import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div className="App">
        <div className="wrapper">
          <h1 className="header">I-Schedule</h1>
          <div className="work" onClick={() => navigate("/schedule")}>
            Schedule an Interview
          </div>
          <div className="work" onClick={() => navigate("/interviews")}>
            show all interviews
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
