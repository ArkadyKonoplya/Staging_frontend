import { useEffect, useState } from "react";
import { localStorageHelper } from "../../helpers";
import JaseMurph from "../../Images/20210313_102602.jpg";
import DefaultImg from "../../Images/TelePsycRXicon.jpg";
import Logout from "../Logout";

function HeaderPatient({ imageUpdate }) {
  const [image, setImage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const image = localStorageHelper.load("profileImage");
    setImage(image);
  }, [imageUpdate]);

  return (
    <header>
      <h2>
        <label htmlFor="nav-toggle">
          <span className="las la-bars"></span>
        </label>
        Patient Dashboard
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
          onerror={DefaultImg}
        />
        {/* <img src={DefaultImg} width="50px" height="50px" alt="profile" /> */}
        <div>
          <h4>
            {user.first_name} {user.last_name}
          </h4>
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

export default HeaderPatient;
