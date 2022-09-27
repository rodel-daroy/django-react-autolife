import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Notifications = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={8000}
      hideProgressBar={false}
      newestOnTop={false}
      className="react-toast-container"
      toastClassName="react-toast"
      closeOnClick
      pauseOnHover
      closeButton={
        <button type="button" className="btn btn-link dark">
          <span className="icon icon-x" />
        </button>
      }
    />
  );
};
export default Notifications;
