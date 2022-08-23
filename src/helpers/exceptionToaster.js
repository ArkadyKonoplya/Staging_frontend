import { toast } from "react-toastify";

/**
 * Handles the error message display to the browser
 *
 * @param {string} errorType - type of error - success, error - more info here: https://fkhadra.github.io/react-toastify/introduction/
 * @param {string} message - message that will be displayed to the user
 * @returns a toast on the browser
 */
const exceptionToaster = (errorType, message) =>
  toast[errorType](message, {
    position: "bottom-right",
    autoClose: 10000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

export { exceptionToaster };
