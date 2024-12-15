import React from "react";
import { StudentProvider } from "./components/StudentContext";
import StudentForm from "./components/StudentForm";


const App = () => {
  return (
    <StudentProvider>


     <StudentForm />


    </StudentProvider>
  );
};

export default App;
