import { useState } from "react";
import AliceMackey from "../../Images/Profile Pic.jpg";
import telePsycRxIcon from "../../Images/TelePsycRXicon.jpg";
import DefaultImg from "../../Images/TelePsycRXicon.jpg";
import moment from "moment";

function ConsultDetails(props) {
  console.log("Referral being passed: ", props.referralRequest);
  console.log("Consult being passed: ", props.consultRequest);
  // const [requestDate, setRequestDate] = useState(); ${props.requestDate}
  // const [appointmentFor, setAppointmentFor] = useState(); ${props.appointmentFor}
  // const [requestTime, setRequestTime] = useState();  ${props.requestTime}
  // const [consultDetails, setConsultDetails] = useState();  ${props.consultDetails}
  // const [speciality, setSpeciality] = useState();  ${props.speciality}
  // const [patientEmail, setPatientEmail] = useState();  ${props.patientEmail}
  // const [patientName, setPatientName] = useState();  ${props.patientName}
  // const [consultDetails] = useState([
  {
    /* <h4>{ props.consultRequest.patient_full_name ? props.consultRequest.patient_full_name : { props.referralRequest.sender.first_name &&  props.referralRequest.sender.last_name ? (props.referralRequest.sender.first_name  props.referralRequest.sender.first_name)  :  "no name"} }</h4> */
  }

  {
    /* <small>{props.consultRequest.reason_for_request ? props.consultRequest.reason_for_request :  {props.referralRequest.requested_date && props.referralRequest.requested_time ? (props.referralRequest.requested_date props.referralRequest.requested_time) : "nothing"}  }</small> */
  }

  //

  return (
    <div className="detailsCard">
      <div className="Card">
        <div className="card-header">
          <h3>Consult Details</h3>
        </div>
        <div className="card-body">
          <div>
            <div className="info">
              <img
                // || props.referralRequest.sender.image
                src={
                  props.consultRequest.image ||
                  props.consultRequest.sender.image ||
                  DefaultImg
                }
                height="40px"
                width="40px"
                alt="colleague"
              ></img>
              <div>
                {/* || {props.referralRequest.sender.first_name} {props.referralRequest.sender.last_name} */}
                {/* || {props.referralRequest.requested_date} {props.referralRequest.requested_time} */}
                <h4>
                  {props.consultRequest.patient_full_name ||
                    `${props.consultRequest.sender.first_name} ${props.consultRequest.sender.last_name}`}
                </h4>
                <small>
                  {props.consultRequest.reason_for_request ||
                    props.consultRequest.requested_specialty}
                </small>
                {/* <h4>{props.consultRequest.patient_full_name}</h4>
                <small>{props.consultRequest.reason_for_request}</small> */}
              </div>
            </div>
            <br />
            <div>
              <>
                <p>
                  <b className="consult-details">Patient Name:</b>{" "}
                  <small className="consult-details-small">
                    {props.consultRequest?.patient_full_name ||
                      `${props.consultRequest.patient.first_name} ${props.consultRequest.patient.last_name}`}
                  </small>
                </p>
                <p>
                  <b className="consult-details">Requested Date:</b>{" "}
                  <small className="consult-details-small">
                    {moment(props.consultRequest.requested_date).format(
                      "dddd, MMMM Do YYYY"
                    )}
                  </small>
                </p>
                <p>
                  <b className="consult-details">Requested time:</b>{" "}
                  <small className="consult-details-small">
                    {moment(
                      props.consultRequest.requested_time,
                      "HH:mm:ss"
                    ).format("hh:mm: A")}
                  </small>
                </p>
                <p>
                  <b className="consult-details">Appointment For:</b>{" "}
                  <small className="consult-details-small">
                    {props.consultRequest.appointment_for}
                  </small>
                </p>
                <p>
                  <b className="consult-details">Reason for Request:</b>{" "}
                  <small className="consult-details-small">
                    {props.consultRequest?.reason_for_request}
                  </small>
                </p>
                <p>
                  <b className="consult-details">Patient Email:</b>{" "}
                  <small className="consult-details-small">
                    {props.consultRequest.patient_email ||
                      props.consultRequest.patient.email}
                  </small>
                </p>
              </>
            </div>
            {props.patientDash ? null : (
              <div className="detailsCardBody">
                <p>{props.consultRequest?.details}</p>
              </div>
            )}
            <div className="detailsCardBtn">
              <button onClick={props.onClickDe} className="dCBtn">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultDetails;
