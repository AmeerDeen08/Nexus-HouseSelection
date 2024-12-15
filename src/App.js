import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StudentProvider } from "./components/StudentContext";
import StudentForm from "./components/StudentForm";


const App = () => {
  return (
    <StudentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StudentForm />} />
        </Routes>
      </Router>
    </StudentProvider>
  );
};

export default App;
