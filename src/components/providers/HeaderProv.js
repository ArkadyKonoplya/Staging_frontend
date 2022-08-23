import { useEffect, useState } from "react";
import JamieDoe from "../../Images/Screenshot 2021-06-20 142408.jpg";
import DefaultImg from "../../Images/TelePsycRXicon.jpg";
import Logout from "../Logout";
// import { localStorageHelper } from "../../helpers";
import { useLocation } from "react-router-dom";

function Header({ imageUpdate }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    let currentLocation = location.pathname
    let newHeader = currentLocation.slice(10)
    setActivePage(newHeader)
  }, []);

  // const [user] = useState(JSON.parse(localStorage.getItem("user")));
  // useEffect(() => {
  //   const image = localStorageHelper.load("profileImage");
  //   setImage(image);
  // }, [imageUpdate]);

  // const onError = () => {
  //   setImageUrl(DefaultImg);
  // };

  return (
    <header>
      <h2>
        <label for="nav-toggle">
          <span className="las la-bars"></span>
        </label>
        Provider <span style={{textTransform: "capitalize"}}>{activePage && activePage}</span>
      </h2>
      {/* <div className="search-wrapper">
        <span className="las la-search"></span>
        <input type="search" placeholder="Search your Records" />
      </div> */}
      <div className="user-wrapper">
        <img
          src={user.image || DefaultImg}
          width="50px"
          height="50px"
          alt="profile"
          objectFit="cover"
        />
        <div>
          <h4>
            {user.first_name} {user.last_name}
          </h4>
          <small>{user.doctor_title}</small>
          <small>{user.type}</small>
          <div>
            <small className="logout">
              <Logout />
            </small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
