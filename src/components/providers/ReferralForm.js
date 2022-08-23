import React, { useState, useEffect, useCallback } from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  Label,
  Button,
  Form,
  Input,
  InputGroup,
  CardHeader,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
// import DatePicker from "./DatePicker";
import axiosInstance from "../../api/TelePsyAPI";
import moment from "moment";
// let oneDay = 60 * 60 * 24 * 1000;
// let todayTimestamp =
//   Date.now() -
//   (Date.now() % oneDay) +
//   new Date().getTimezoneOffset() * 1000 * 60;

const specialties = [
  "Psychiatry",
  "Neurology",
  "Child and Adolescent Psychiatry",
  "Adult Psychiatry",
  "Geriatric Psychiatry",
  "Addiction Psychiatry",
  "Emergency Psychiatry",
  "Neurology",
  "Child and Adolescent Psychiatry",
  "Adult Psychiatry",
  "Geriatric Psychiatry",
  "Addiction Psychiatry",
  "Emergency Psychiatry",
  "Psychiatry",
  "Psychology",
];

const ReferralForm = (props) => {
  const [doctorColleagues, setDoctorColleagues] = useState([]);
  const [doctorColleague, setDoctorColleague] = useState("");
  // const [colleague, setColleague] = useState("");
  // const [secondColleague, setSecondColleague] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [patient, setPatient] = useState(
    props.referralData.patient_full_name || ""
  );
  const [time, setTime] = useState(props.referralData.requested_time || "");
  const [date, setDate] = useState(
    new Date(props.referralData.requested_date) || ""
  );
  const [requestedSpecialty, SetRequestedSpecialty] = useState(
    props.referralData.specialty || ""
  );
  const [newProviderEmail, setNewProviderEmail] = useState("");
  const [newProviderEmail2, setNewProviderEmail2] = useState("");
  const [reasonTitle, setReasonTitle] = useState(
    props.referralData.reason_for_request || ""
  );
  const [details, setDetails] = useState(props.referralData.details || "");
  const [newProviderInvited, setNewProviderInvited] = useState(false);
  // const [reasonTitle, setReasonTitle] = useState("");
  // const [details, setDetails] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const consultToRefer = props.consultRequestid;

  const fetchDoctorColleagues = async () => {
    const response = await axiosInstance.get(`accounts/doctors/accepting/`);
    setDoctorColleagues(response.data);
    console.log("Get Colleages by Accepting: ", response.data);
  };

  const getDoctorColleagues = useCallback(
    async (arg) => {
      console.log(arg);
      // console.log("Get Colleages by Specialty: ", doctorColleagues);
      const response = await axiosInstance.get(
        `accounts/doctors/?board_certified_speciality=${arg}&accepting_new_patients=true`
        // accounts/doctors/?board_certified_speciality=${arg}&accepting_new_patients=true
      );
      console.log("Get Colleages by Specialty: ", response.data);
      setDoctorColleagues(response.data);
      // return  fetchDoctorColleagues(arg);
      // setDoctorColleagues(arg)
    },
    [setDoctorColleagues, doctorColleagues]
  );

  useEffect(() => {
    fetchDoctorColleagues();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      sender: user.id,
      // NEEDS TO BE CONDITIONAL doctors needs to be an array or single id
      doctors: doctorColleague,
      doctors: doctorColleague,
      
      // PATIENT NEEDS TO BE AN ID??
      patient: patient,

// TIME AND DATE MAY NEED TO BE REDONE
      requested_time: time,
      requested_date: date,

      requested_specialty: requestedSpecialty,
      chosen_specialty: speciality,

      // OUTSIDE EMAIL NEEDS TO BE CONDITIONAL
      outside_provider_invited: newProviderInvited,
      outside_provider_email: newProviderEmail,

      reasonTitle: reasonTitle,
      details: details,
      status: 'Pending'
    };

    console.log(payload);
    axiosInstance
      .post(`accounts/referral_requests/`, payload)
      .then(function (response) {
        console.log(`Axios response: ${response.status}`);
        console.log("Your referral has been sent.");
      });
    props.onClose();

    //   Clear the form when the message is saved
    const resetForm = () => {
      setDate("");
      setTime("");
      setPatient("");
      setSpeciality("");
      SetRequestedSpecialty("");
      setSecondColleague("");
      setColleague("");
      setNewProviderEmail("");
      setReasonTitle("");
      setDetails("");
      console.log("Form cleared");
    };
    resetForm();
  };

  console.log(props.referralData, "props.referralData");

  return (
    <Row>
      <Col lg={12}>
        <Card style={{ backgroundColor: "#b2eff1", borderRadius: 15 }}>
          <CardBody>
            <CardHeader className="mb-4" tag="h4">
              Referral Form
            </CardHeader>
            <Form>
              <Row>
                <Col lg={4}>
                  <div className="md-3">
                    <Label htmlFor="formrow-email-Input">Patient</Label>
                    <Input
                      value={patient}
                      type="text"
                      onChange={(e) => {
                        setPatient(e.target.value);
                      }}
                      className="form-control"
                      id="formrow-email-Input"
                      placeholder="Patient Full Name"
                      disabled={Object.keys(props.referralData).length !== 0}
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-time-Input">Requested Time</Label>
                    <Input
                      value={time}
                      type="text"
                      onChange={(e) => {
                        setTime(e.target.value);
                      }}
                      className="form-control"
                      id="formrow-email-Input"
                      placeholder="From Consult Req"
                      disabled={Object.keys(props.referralData).length !== 0}
                    />
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-date-Input">
                      Date
                    </Label>
                    <Flatpickr
                      className="form-control d-block"
                      id="formrow-date-Input"
                      placeholder="From Consult Req"
                      value={date}
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                      }}
                      onChange={(value) => {
                        const formattedDate = moment(value[0]).format(
                          "YYYY-MM-DD"
                        );
                        setDate(formattedDate);
                      }}
                      disabled={Object.keys(props.referralData).length !== 0}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-duration">
                      Requested Speciality
                    </Label>
                    {Object.keys(props.referralData).length === 0 ? (
                      <select
                        id="formrow-duration"
                        className="form-select form-control"
                        onChange={(e) => {
                          SetRequestedSpecialty(e.target.value);
                          //   console.log("Duration:", e.target.value);
                        }}
                      >
                        {/* <option>Select</option> */}
                        <option>Neurology</option>
                        {/* <option>1 hour</option>
                      <option>2 hours</option> */}
                      </select>
                    ) : (
                      <Input
                        value={requestedSpecialty}
                        type="text"
                        onChange={(e) => {
                          SetRequestedSpecialty(e.target.value);
                        }}
                        className="form-control"
                        id="formrow-email-Input"
                        placeholder="From Consult Req"
                        disabled={Object.keys(props.referralData).length !== 0}
                      />
                    )}
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-duration">Needed Specialty</Label>
                    <input
                      id="formrow-duration"
                      value={speciality}
                      className="form-input form-control"
                      placeholder="Enter Your Recommended"
                      onChange={(e) => {
                        setSpeciality(e.target.value);
                        getDoctorColleagues(e.target.value);
                      }}
                    ></input>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-duration">Colleagues</Label>
                    <select
                      id="formrow-duration"
                      className="form-select form-control"
                      // value={doctorColleague}
                      onChange={(e) => {
                        setDoctorColleague(e.target.value);
                        //   console.log(
                        //     "Colleage:",
                        //     e.target.options[e.target.selectedIndex]
                        //   );
                      }}
                    >
                      <option>Select Colleage</option>
                      {doctorColleagues.map((doctorColleague) => (
                        <option
                          key={doctorColleague.id}
                          value={doctorColleague.id}
                        >
                          {doctorColleague.first_name}{" "}
                          {doctorColleague.last_name}
                        </option>
                      ))}
                      <option>Refer Outside TelePsycRX</option>
                    </select>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-duration">2nd Colleague</Label>
                    <select
                      id="formrow-duration"
                      className="form-select form-control"
                      // value={doctorColleague}
                      onChange={(e) => {
                        setDoctorColleague(e.target.value);
                      }}
                    >
                      <option>Select Second Colleage</option>
                      {doctorColleagues.map((doctorColleague) => (
                        <option
                          key={doctorColleague.id}
                          value={doctorColleague.id}
                        >
                          {doctorColleague.first_name}{" "}
                          {doctorColleague.last_name}
                        </option>
                      ))}
                      <option>Refer Outside TelePsycRX</option>
                    </select>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-email-Input">
                      Practitioner Email
                    </Label>
                    <Input
                      value={newProviderEmail}
                      type="text"
                      className="form-control"
                      id="formrow-email-Input"
                      onChange={(e) => {
                        setNewProviderEmail(e.target.value);
                        //   console.log("New Provider:", e.target.value);
                      }}
                      placeholder="If Out of Network"
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-email-Input">
                      Reason for Request
                    </Label>
                    <Input
                      value={reasonTitle}
                      type="text"
                      className="form-control"
                      id="formrow-email-Input"
                      onChange={(e) => {
                        setReasonTitle(e.target.value);
                      }}
                      placeholder="Type a Brief Title"
                      disabled={Object.keys(props.referralData).length !== 0}
                    />
                  </div>
                </Col>

                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-details-Input">Details</Label>
                    <Input
                      type="textarea"
                      maxLength="225"
                      className="form-control"
                      rows="3"
                      value={details}
                      onChange={(e) => {
                        setDetails(e.target.value);
                      }}
                      placeholder="Type a brief description here of what the patient needs."
                    />
                  </div>
                </Col>
              </Row>
              <div>
                <button
                  className="btn w-md buttonBoxShadow"
                  style={{
                    backgroundColor: "#ac2ce7e0",
                    color: "white",
                    borderRadius: 40,
                    marginRight: 10,
                  }}
                  onClick={handleSubmit}
                >
                  Send Referral
                </button>
                <Button
                  className="btn w-md buttonBoxShadow"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: 40,
                  }}
                  onClick={() => props.onClose()}
                >
                  Close Modal
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ReferralForm;
