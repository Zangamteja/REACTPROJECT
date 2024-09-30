import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//components
import App from "./components/App";
import Schedule from "./components/schedule";
import Interviews from "./components/Interviews";
import UpdateInterview from "./components/updateInterview";

export default function Rootes() {
  return (
    <Router>
      <ToastContainer theme="dark" />
      <Routes>
        <Route exact path="/" element={<App />}></Route>
        <Route exact path="/schedule" element={<Schedule />}></Route>
        <Route exact path="/interviews" element={<Interviews />}></Route>
        <Route
          exact
          path="/interview/update"
          element={<UpdateInterview />}
        ></Route>
      </Routes>
    </Router>
  );
}
