import DefaultImg from "../../Images/TelePsycRXicon.jpg";
import { useState } from "react";
import * as qs from "query-string";
import { useHistory } from "react-router-dom";
import ConsultDetails from "./DetailsConsult";
import axiosInstance from "../../api/TelePsyAPI";
import moment from "moment-timezone";

function ConsultRequestsBox(props) {
  const history = useHistory();

  const consultAccept = (id) => (event) => {
    event.preventDefault();
    console.log("consultAccept");
    axiosInstance
      .post(`accounts/consult_requests/${id}/accept/`)
      .then(function (response) {
        console.log(`Axios response: ${response.status}`);
        console.log("Your patient has been accepted.");
      })
      .then(props.fetchRequests);

    // history.push("/provider-appointments");
  };

  const handleRefer = (consult) => (event) => {
    event.preventDefault();
    console.log(consult, "handleRefer");
    consult.is_referred = true;
    axiosInstance
      .post(`accounts/consult_requests/${consult.id}/refer/`)
      .then(function (response) {
        console.log(`Axios response: ${response.status}`);
        console.log("Your patient has been referred.");
      })
      .then(props.fetchRequests);
    history.push(`/provider-appointments?from=dashboard_consult&${qs.stringify(consult)}`);
  };

  const handleReferReject = (id) => (event) => {
    event.preventDefault();
    console.log("handleReject");
    axiosInstance
      .post(`accounts/referral_requests/${id}/reject/`)
      .then(function (response) {
        console.log(`Axios response: ${response.status}`);
        console.log("Your patient has been rejected.");
      })
      .then(props.fetchRequests);

    // history.push("/provider-appointments");
  };

  const handleReferAccept = (id) => (event) => {
    // history.push(`/provider-appointments/${props.consultRequest.id}`);
    event.preventDefault();
    console.log("handleReject");
    axiosInstance
      .post(`accounts/referral_requests/${id}/accept/`)
      .then(function (response) {
        console.log(`Axios response: ${response.status}`);
        console.log("Your patient has been accepted.");
      })
      .then(props.fetchRequests);
  };
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="consult-reqs">
      <div className="Card">
        <div className="card-header">
          <h3>Consult Requests</h3>
        </div>
        <div className="card-body">
          {props.is_approved === false ? (
            <h5 className="current-PatRecH1">
              This feature can only be available to approved users.{" "}
            </h5>
          ) : (
            <>
              {!props.consultRequests && (
                <h5 className="current-PatRecH1">Loading consult requests.</h5>
              )}

              {props.consultRequests && props.consultRequests.length === 0 ? (
                <h5 className="current-PatRecH1">
                  No pending Consult Requests at this time.
                </h5>
              ) : null}

              {props.consultRequests &&
                props.consultRequests.map((consultRequest) => {
                  return (
                    <div key={consultRequest.id} className="newConsult">
                      <div className="info">
                        <img
                          src={consultRequest.image || DefaultImg}
                          height="40px"
                          width="40px"
                          alt="patient"
                        ></img>
                        <div>
                          <h4>{consultRequest.patient_full_name}</h4>
                          <small>{consultRequest.reason_for_request}</small>
                        </div>
                      </div>
                      <div className="contact">
                        <span
                          onClick={() =>
                            props.is_partner
                              ? null
                              : props.is_approved
                              ? props.onClickDe(consultRequest)
                              : null
                          }
                          className="las la-user-circle details"
                        ></span>
                        <span
                          onClick={
                            props.is_partner
                              ? null
                              : props.is_approved
                              ? consultAccept(consultRequest.id)
                              : null
                          }
                          className="las la-thumbs-up accept"
                        ></span>
                        <span
                          onClick={
                            props.is_partner
                              ? null
                              : props.is_approved
                              ? handleRefer(consultRequest)
                              : null
                          }
                          className="las la-exchange-alt refer"
                        ></span>
                      </div>
                    </div>
                  );
                })}
              {!props.referralRequests && (
                <h5 className="current-PatRecH1">Loading referral requests.</h5>
              )}
              {props.referralRequests && props.referralRequests.length === 0 ? (
                <h5 className="current-PatRecH1">
                  No pending Referral Requests at this time.
                </h5>
              ) : null}

              {props.referralRequests &&
                props.referralRequests.map((referralRequest) => {
                  return (
                    <div key={referralRequest.id} className="newConsult">
                      <div className="info">
                        <img
                          src={referralRequest.sender.image || DefaultImg}
                          height="40px"
                          width="40px"
                          alt="patient"
                        ></img>
                        <div>
                          <h4>
                            {referralRequest.sender.first_name}{" "}
                            {referralRequest.sender.last_name}
                          </h4>
                          <small>
                            {/* {moment(referralRequest.requested_time).format("LT")} */}
                            {moment(
                              referralRequest.requested_date +
                                " " +
                                referralRequest.requested_time
                            ).format("LLL")}
                          </small>
                        </div>
                      </div>
                      <div className="contact">
                        <span
                          onClick={() =>
                            props.is_partner
                              ? null
                              : props.is_approved
                              ? props.onClickDe(referralRequest)
                              : null
                          }
                          className="las la-user-circle details"
                        ></span>
                        <span
                          onClick={
                            props.is_partner
                              ? null
                              : props.is_approved
                              ? handleReferAccept(referralRequest.id)
                              : null
                          }
                          className="las la-thumbs-up accept"
                        ></span>
                        <span
                          onClick={
                            props.is_partner
                              ? null
                              : props.is_approved
                              ? handleReferReject(referralRequest.id)
                              : null
                          }
                          className="las la-times-circle reject"
                        ></span>
                      </div>
                    </div>
                  );
                })}
            </>
          )}

          {/* <div className="newConsult">
            <div className="info">
              <img
                src={AliceMackey}
                height="40px"
                width="40px"
                alt="colleague"
              ></img>
              <div>
                <h4>Alice Mackey</h4>
                <small>Childhood Trauma</small>
              </div>
            </div>
            <div className="contact">
              <span className="las la-user-circle details"></span>
              <span
                onClick={handleRouteA}
                className="las la-thumbs-up accept"
              ></span>
              <span className="las la-times-circle reject"></span>
            </div>
          </div> */}
          {/* <div className="newConsult">
            <div className="info">
              <img
                src={jaseMurph}
                height="40px"
                width="40px"
                alt="patient"
              ></img>
              <div>
                <h4>Jase Murph</h4>
                <small>Childhood Trauma</small>
              </div>
            </div>
            <div className="contact">
              <span className="las la-user-circle details"></span>
              <span
                onClick={handleRouteA}
                className="las la-thumbs-up accept"
              ></span>
              <span
                onClick={handleRouteRefer}
                className="las la-exchange-alt refer"
              ></span>
            </div>
          </div> */}
          {/* <div className="newConsult">
            <div className="info">
              <img
                src={jaseMurph}
                height="40px"
                width="40px"
                alt="patient"
              ></img>
              <div>
                <h4>Jase Murph</h4>
                <small>Childhood Trauma</small>
              </div>
            </div>
            <div className="contact">
              <span className="las la-user-circle details"></span>
              <span
                onClick={handleRouteA}
                className="las la-thumbs-up accept"
              ></span>
              <span
                onClick={handleRouteRefer}
                className="las la-exchange-alt refer"
              ></span>
            </div>
          </div> */}
        </div>
      </div>
      {showDetails ? <ConsultDetails /> : null}
    </div>
  );
}

export default ConsultRequestsBox;
