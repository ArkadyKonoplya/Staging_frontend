import { Alert } from "reactstrap";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import nameWlogo from "../../Images/TelePsycRXnameWicon500by300.jpg";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { SubscriptionContext } from "../../helpers/subscriptionContext";
import CheckoutModal from "../../components/CheckoutModal";

function SidebarPatient({ active }) {
  // const [subscribed] = useState(false);
  const [subscribemodal, setSubscribemodal] = useState(false);
  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const tog_scroll = () => {
    setSubscribemodal(!subscribemodal);
    removeBodyCss();
  };
  const {userContext} = useContext(SubscriptionContext);
  return (
    <Fragment>
      <input type="checkbox" id="nav-toggle"></input>
      <div className="sidebar">
        <div className="sidebar-brand">
          <span className="lab la-telePsycRX">
            <img className="sidebarlogo" src={nameWlogo} alt="logoName"></img>
          </span>
        </div>

        {userContext?.user_type ===
        "Doctor" ? null : userContext?.is_subscribed === false ? (
          <>
            <Alert color="danger">
              Your Subscription has expired.{" "}
              <Link
                to="#"
                onClick={() => {
                  tog_scroll();
                }}
                className="alert-link"
              >
                Upgrade now to continue
              </Link>
            </Alert>
            <CheckoutModal
              setSubscribemodal={() => setSubscribemodal(!subscribemodal)}
              subscribemodal={subscribemodal}
            />
          </>
        ) : null}

        <div className="sidebar-menu">
          <ul>
            <li>
              <NavLink
                to="/patient-dashboard"
                className={`${active === "Dashboard" ? "active" : null} Prov`}
              >
                <span className="las la-home"></span>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patient-entryArchives"
                className={`${active === "Archives" ? "active" : null} Prov`}
              >
                <span className="las la-cloud-upload-alt"></span>
                <span>Journal Archives</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patient-appointments"
                className={`${active === "Appointment" ? "active" : null} Prov`}
              >
                <span className="las la-calendar-check"></span>
                <span>Appointments</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patient-personalJournal"
                className={`${active === "Journal" ? "active" : null} Prov`}
              >
                <span className="las la-book"></span>
                <span>Personal Journal</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patient-documents"
                className={`${active === "Documents" ? "active" : null} Prov`}
              >
                <span className="las la-file-alt"></span>
                <span>Documents</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patient-resources"
                className={`${active === "Resources" ? "active" : null} Prov`}
              >
                <span className="las la-clipboard"></span>
                <span>Resources</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/patient-profile"
                className={`${active === "Profile" ? "active" : null} Prov`}
              >
                <span className="las la-id-card"></span>
                <span>Profile</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default SidebarPatient;
