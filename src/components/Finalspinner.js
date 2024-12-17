import React, { useEffect,useCallback, useRef, useState, useContext } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import '../styles/spinner.css';
import { Button } from "react-bootstrap";

import { StudentContext } from "./StudentContext";
import arrow from '../assets/images/leftArrow.png'
import CongratsOverlay from "./CongratsOverlay";

const FinalSpinner = (props) => {
  const [FinalDetails, setFinalDetails] = useState({});
  const [house, setHouse] = useState(null); 
  const [showOverlay, setShowOverlay] = useState(false);
  const { student, setStudent } = useContext(StudentContext); // Access context properly

  const last2Houses=props.last3Houses.slice(-2)
  const last1House=props.last3Houses.slice(-1)
const newHouseCount=props.HouseCount===4 ? (1) : (props.HouseCount+1);


  const handleFinal = useCallback((houseVal) => {
    setFinalDetails({ ...student, house: houseVal,houseCount:newHouseCount });
    setHouse(houseVal);
    setShowOverlay(true);
  }, [student]);

  const chartRef = useRef(null); // Reference to the Chart instance
  const canvasRef = useRef(null); // Reference to the canvas element
  const [isChartReady, setChartReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return; // Ensure canvas is available

    // Fetch last houses from Google Sheets
    

    const wheel = canvasRef.current;
    const finalValue = document.getElementById("final-value");
    const spinBtn = document.getElementById("spin-btn");

    const rotationValues = [
      { minDegree: 0, maxDegree: 90, value: "Roadrunner" },
      { minDegree: 91, maxDegree: 180, value: "Mira" },
      { minDegree: 181, maxDegree: 270, value: "Watson" },
      { minDegree: 271, maxDegree: 360, value: "Sequoia" },
    ];

    const data = [25, 25, 25, 25];
    const pieColors = ["#214db5", "#5682e8", "#214db5", "#5682e8"];

    // Create the chart
    const myChart = new Chart(wheel, {
      plugins: [ChartDataLabels],
      type: "pie",
      data: {
        labels: ["Roadrunner", "Sequoia", "Watson", "Mira"],
        datasets: [
          {
            backgroundColor: pieColors,
            data: data,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 0 },
        plugins: {
          tooltip: false,
          legend: {
            display: false,
          },
          datalabels: {
            color: "#ffffff",
            formatter: (_, context) => context.chart.data.labels[context.dataIndex],
            font: {
              size: 16,
              family: 'Arial',
            },
            align: 'center', // Align labels horizontally
            anchor: 'middle', // Anchor labels vertically
          },
        },
      },
    });

    chartRef.current = myChart; // Store chart instance
    setChartReady(true); // Indicate chart is ready

    const valueGenerator = (angleValue) => {
      
      let remainingHouses = rotationValues.filter(house => !props.last3Houses.includes(house.value));
    
      // If only one house is not in the last three, choose it
      if (remainingHouses.length === 1) {
        finalValue.innerHTML = `<p>Congrats! Your House: ${remainingHouses[0].value}</p>`;
        spinBtn.disabled = true;
        handleFinal(remainingHouses[0].value);
        sendToGoogleSheets({...student, house: remainingHouses[0].value,houseCount:newHouseCount});
        // console.log(last1House);
        // console.log(last2Houses)
      }
      // If two houses are not in the last three, randomly select one
      else if (remainingHouses.length === 2) {
        const randomIndex = Math.floor(Math.random() * remainingHouses.length);
        const selectedHouse = remainingHouses[randomIndex];
        finalValue.innerHTML = `<p>Congrats! Your House: ${selectedHouse.value}</p>`;
        spinBtn.disabled = true;
        handleFinal(selectedHouse.value);
        sendToGoogleSheets({...student, house: selectedHouse.value,houseCount:newHouseCount});
      }
      // If all three houses are not in the last three, randomly select one
      else if (remainingHouses.length === 3) {
        const randomIndex = Math.floor(Math.random() * remainingHouses.length);
        const selectedHouse = remainingHouses[randomIndex];
        finalValue.innerHTML = `<p>Congrats! Your House: ${selectedHouse.value}</p>`;
        spinBtn.disabled = true;
        handleFinal(selectedHouse.value);
        sendToGoogleSheets({...student, house: selectedHouse.value,houseCount:newHouseCount});
      }
      else if (remainingHouses.length === 4) {
        const randomIndex = Math.floor(Math.random() * remainingHouses.length);
        const selectedHouse = remainingHouses[randomIndex];
        finalValue.innerHTML = `<p>Congrats! Your House: ${selectedHouse.value}</p>`;
        spinBtn.disabled = true;
        handleFinal(selectedHouse.value);
        sendToGoogleSheets({...student, house: selectedHouse.value,houseCount:newHouseCount});
      }
    };
    
    let count = 0;
    let resultValue = 101;
    
    const spinHandler = () => {
      spinBtn.disabled = true;
      finalValue.innerHTML = `<p>Good Luck!</p>`;
      const randomDegree = Math.floor(Math.random() * 355);
      const rotationInterval = setInterval(() => {
        myChart.options.rotation += resultValue;
        myChart.update();
        if (myChart.options.rotation >= 360) {
          count += 1;
          resultValue -= 5;
          myChart.options.rotation = 0;
        } else if (count > 15 && myChart.options.rotation === randomDegree) {
          valueGenerator(randomDegree);
          clearInterval(rotationInterval);
          count = 0;
          resultValue = 101;
        }
      }, 7);
    };

    spinBtn.addEventListener("click", spinHandler);

    // Cleanup chart and event listeners on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      spinBtn.removeEventListener("click", spinHandler);
    };
  }, [handleFinal,setStudent,FinalDetails,props.last3Houses,student]);

  const sendToGoogleSheets = async (data) => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby_l38b9R3TP3fUgEM3jm5HYtZh03u3ZOVQOv_-r1s9Tx1-P3wRcVswXoNxs9vrEKur/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            FullName: data.fullname,
            RollNumber: data.rollno,
            MobileNumber: data.phone,
            Email: data.email,
            HouseAllotted: data.house,
            HouseCount: data.houseCount,
          }),
          mode: "no-cors",
        }
      );

      if (!response.ok) throw new Error("Error sending data to Google Sheets");

    } catch (error) {
      console.error("Error:", error);
    }
  };



  return (
    <div className="spinner-wrapper">
      <h3 className="mb-5 text-center font-weight-bold">SPIN THE WHEEL TO CHOOSE YOUR HOUSE</h3>
      
      <div className='linee'></div>
      <div className="alert alert-warning" role="alert">
        <h5 className="alert-heading">Note:</h5>
        <p className="h6">Please be aware that pressing the "Spin" button will automatically submit the house selected by the wheel. There will be no second chances. Make sure to choose carefully before spinning!</p>
      </div>
      <div className="container mt-5">
        <canvas id="wheel" className="wheel" ref={canvasRef}></canvas>
        <button id="spin-btn" disabled={!isChartReady}>Spin</button>
        <img src={arrow} alt="Arrow" />
      </div>
      <div id="final-value">
        <p>Click On The Spin Button To Start</p>
      </div>
      {showOverlay && <CongratsOverlay house={house} />}
      <div className="d-flex justify-content-center mb-3 butcon">
        <Button className="submitButton" onClick={() => props.setSubmitted(false)}> Go back</Button>
     
      </div>
      
    </div>
  );
};

export default FinalSpinner;
