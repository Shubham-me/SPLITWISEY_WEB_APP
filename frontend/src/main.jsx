import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import RegisterPage from "./components/RegisterPage.jsx"
import LoginPage from "./components/LoginPage.jsx"
import WelcomePage from "./components/WelcomePage.jsx"
import HomePage from "./components/HomePage.jsx"
import './index.css'

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  </>
);

