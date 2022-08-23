import axiosInstance from "../api/TelePsyAPI";
import { useHistory } from "react-router-dom";

// logging out a user
export default function Logout() {
  const history = useHistory();

  function handleLogout() {
    const response = axiosInstance.post("/accounts/logout/blacklist/", {
      refresh_token: localStorage.getItem("refresh_token"),
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_type");
    axiosInstance.defaults.headers["Authorization"] = null;
    history.push("");
  }
  return (
    <div onClick={handleLogout}>
      {/* <span className="las la-id-card"></span> */}
      <span>Logout</span>
    </div>
  );
}
