import React from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const MultiStepProgressBar = (props) => {
  return (
    <ProgressBar
      percent={(props.step + 1) * 33.33}
      filledBackground="#664de5"
      height="2px"
      style={{ margin: "auto" }}
    >
      <Step transition="scale">
        {({ accomplished }) => (
          <div
            style={{
              height: "15px",
              width: "15px",
              border: "1px solid lightgray",
              borderRadius: "50%",
              background: "green",
              backgroundColor: `${accomplished ? "#664de5" : null}`
            }}
            className={`step ${accomplished ? "completed" : null}`}
          >
           
           <span className="progress-step"> Payment<br></br>Initiated</span>
          </div>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <div
            style={{
              height: "15px",
              width: "15px",
              border: "1px solid lightgray",
              borderRadius: "50%",
              background: "green",
              backgroundColor: `${accomplished ? "#664de5" : null}`
            }}
            className={`step ${accomplished ? "completed" : null}`}
          >
              <span className="progress-step">Payment<br></br>Processing</span>
          </div>
        )}
      </Step>
      <Step transition="scale">
        {({ accomplished }) => (
          <div
            style={{
              height: "15px",
              width: "15px",
              background: "green",
              border: "1px solid lightgray",
              borderRadius: "50%",
              backgroundColor: `${accomplished ? "#664de5" : null}`
            }}
            className={`step ${accomplished ? "completed" : null}`}
          >
            <span className="progress-step">Payment<br></br>Completed</span>
          </div>
        )}
      </Step>
    </ProgressBar>
  );
};

export default MultiStepProgressBar;
