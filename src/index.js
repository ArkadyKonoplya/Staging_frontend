import "react-loader-spinner/dist/loader/css/cradleLoader.css";
import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App";

// import { ThemeProvider } from "styled-components";
// import {
//   MeetingProvider,
//   lightTheme,
// } from "amazon-chime-sdk-component-library-react";

const Root = () => {
  return (
    <>
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

window.addEventListener("load", () => {
  ReactDOM.render(Root(), document.getElementById("root"));
});
