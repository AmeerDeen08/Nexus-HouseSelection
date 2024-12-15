import React, { useContext, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import logo from '../assets/images/nexusLogo.png';


import { StudentContext } from './StudentContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/studentform.css';
import FinalSpinner from './Finalspinner';
import loaderGif from '../assets/images/Loader.gif'; // Path to your loader GIF

const StudentForm = () => {
  const { student, setStudent } = useContext(StudentContext); // Access student and setStudent
  const [submitted, setSubmitted] = useState(false);
  const [existingRollNumbers, setExistingRollNumbers] = useState([]);
  const [Last3Houses, setLast3Houses] = useState([]); // To store the last 3 houses
  const [rollNumberError, setRollNumberError] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  useEffect(() => {
    const fetchRollNumbers = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const response = await fetch('https://script.google.com/macros/s/AKfycbzVG69yB_RpNiOJFibi76ef6uysQg_Wy7FIpVoB0eRxqpRgo2FySr3T-KX7uRVLHMXP/exec');
        const result = await response.json();
        if (result.message === "Data retrieved successfully.") {
          setExistingRollNumbers(result.rollNumbers);
          setLast3Houses(result.last3Houses);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error('Error fetching roll numbers:', error);
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    fetchRollNumbers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Normalize the roll number to string for accurate comparison
    const rollNumberInput = student.rollno.toString().trim();
  
    // Check if the entered roll number exists in the list
    const rollNumberExists = existingRollNumbers.some(
      (existingRollno) => existingRollno.toString().trim() === rollNumberInput
    );
  
    if (rollNumberExists) {
      console.error('Roll number already registered.');
      setRollNumberError(true); // Set error state to true if roll number does not exist
    } else {
      setSubmitted(true);
      setRollNumberError(false); // Clear error state if roll number exists
      // Proceed to the spinner or any further processing
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <img src={loaderGif} alt="Loading..." />
        </div>
      ) : submitted ? (
        <FinalSpinner setSubmitted={setSubmitted} last3Houses={Last3Houses} />
      ) : (
        <div>
          <div className='headercontainer'>
            <div className='title'>
              <img src={logo} alt="Logo" />
              <h2>IBM NEXUS CLUB</h2>
            </div>
            <h5>( HOUSE SEPARATION )</h5>
          </div>
          <Form onSubmit={handleSubmit} className="p-3 formcontainer">
            <h3 className='mb-4 d-flex justify-content-center mt-3 headings'>Enter Your details</h3>
            <div className='linee'></div>

            {rollNumberError && (
              <p className='text-danger mb-3 d-flex justify-content-center mt-3'>Your Roll Number is already registered</p>
            )}

            <Form.Group controlId="formFullname" className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullname"
                placeholder="Enter your full name"
                value={student.fullname}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formRollno" className="mb-3">
              <Form.Label>Roll Number</Form.Label>
              <Form.Control
                type="text"
                name="rollno"
                placeholder="Enter your roll number"
                value={student.rollno}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={student.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPhone" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <InputGroup>
                <InputGroup.Text>+91</InputGroup.Text>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={student.phone}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </Form.Group>

            <div className='d-flex justify-content-center'>
              <Button variant="primary" type="submit" className='submitButton m-2 mt-3'>
                Proceed to <strong>Spin the wheel</strong>
              </Button>
            </div>
          </Form>
        </div>
      )}
      <p className="mt-2 watermark">@Ameerdeen08</p>
    </div>
  );
};

export default StudentForm;
