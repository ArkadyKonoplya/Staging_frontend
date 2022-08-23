import { useState } from "react";
import moment from "moment";
import axiosInstance from "../../api/TelePsyAPI";
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
// import AppointmentForm from "./PatientAppointmentForm";

const ConsultForm = (props) => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  // const [consultRequest, setConsultRequest] = useState()


  const specialties = [
    "Psychiatry",
    "Neurology",
    "Child and Adolescent Psychiatry",
    "Adult Psychiatry",
    "Geriatric Psychiatry",
    "Addiction Psychiatry",
    "Emergency Psychiatry",
  ];

  const [consultDetails, setConsultDetails] = useState();
  const [requestDate, setRequestDate] = useState();
  const [requestTime, setRequestTime] = useState();
  const [speciality, setSpeciality] = useState();
  const [appointmentFor, setAppointmentFor] = useState();
  const [availableDoctors, setAvailableDoctors] = useState(2);
  const [patientEmail, setPatientEmail] = useState();
  const [reason, setReason] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      requester: user.patient_id,
      patient_id: user.patient_id,
      patient_full_name: `${user.first_name}, ${user.last_name}`,
      details: consultDetails,
      requested_date: requestDate,
      requested_time: requestTime,
      specialty: speciality,
      sent_to: parseInt(availableDoctors),
      appointment_for: appointmentFor,
      patient_email: patientEmail,
    };

    console.log(payload);

    axiosInstance
      .post("accounts/consult_requests/", {
        requester: user.patient_id,
        patient_id: user.patient_id,
        patient_full_name: `${user.first_name}, ${user.last_name}`,
        patient_email: patientEmail,
        details: consultDetails,
        requested_date: requestDate,
        reason_for_request: reason,
        requested_time: requestTime,
        specialty: speciality,
        appointment_for: appointmentFor,
        sent_to: parseInt(availableDoctors),
      })
      .then((response) => {
        // Show success message:
        if (response.status === 201) {
          // exceptionToaster("Your Consult Request was Sent!");
          props.resetFormFields();
          // setLoadButton(false);
        }
      })
      .catch((error) => {
        console.log(error);
        // setLoadButton(false);
        // exceptionToaster(
        //   "error",
        //   "We could not send you consult request at the moment, please try again"
        // );
      });

      props.onClose();
  };

  return (
    <Row>
      <Col lg={12}>
        <Card style={{ backgroundColor: "#b2eff1", borderRadius: 15 }}>
          <CardBody>
            <CardHeader className="mb-4" tag="h4">
              Consult Request Form (patient side)
            </CardHeader>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-duration">Specialty</Label>
                    <select
                      id="formrow-duration"
                      className="form-select form-control"
                      value={speciality}
                      onChange={(e) => {
                        setSpeciality(e.target.value);
                        // console.log(
                        //   "Specialty:",
                        //   e.target.options[e.target.selectedIndex]
                        // );
                      }}
                    >
                      <option>Select Speciality</option>
                      {specialties.map((specialty) => (
                        <option value={speciality}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-date-Input">
                      Date
                    </Label>

                    <Flatpickr
                      className="form-control d-block"
                      // value={requestDate}
                      onChange={(requestDate) => {
                        // let selectedDate = requestDate[0];
                        // let currentDate = new Date();

                        // let sendDate = new Date(
                        //   selectedDate.setHours(
                        //     currentDate.getMonth(),
                        //     currentDate.getDay(),
                        //     currentDate.getFullYear()
                        //   )
                        // );
                        const formattedDate = moment(requestDate[0]).format(
                          "DD/MM/YYYY"
                        );
                        setRequestDate(formattedDate);
                      }}
                      id="formrow-date-Input"
                      placeholder="Click to Select"
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                      }}
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-time-Input">Select a Time</Label>
                    <select
                      id="formrow-time-Input"
                      className="form-select form-control"
                      value={requestTime}
                      onChange={(e) => {
                        setRequestTime(e.target.value);
                      }}
                    >
                      <option value={"0"}>Choose...</option>
                      <option value={"15:16:00"}>8:00am</option>
                      <option value={"16:16:00"}>8:30am</option>
                      <option value={"17:16:00"}>9:00am</option>
                      <option>9:30am</option>
                      <option>10:00am</option>
                      <option>10:30am</option>
                      <option>11:00am</option>
                    </select>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-doctors-Input">
                      Available Doctors
                    </Label>
                    <select
                      defaultValue="0"
                      className="form-select form-control"
                      // onChange={setAvailableDoctors}
                      value={props.availableDoctors}
                    >
                      <option value={2}>Choose...</option>
                      {/* {availableDoctors.map((res) => (
                        <option value={availableDoctors}>{res.name}</option>
                      ))} */}
                    </select>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-appointmentType">
                      Whom the Appointment is for
                    </Label>
                    <select
                      id="formrow-appointmentType"
                      className="form-select form-control"
                      onChange={(e) => {
                        setAppointmentFor(e.target.value);
                      }}
                    >
                      <option>Select From Choices...</option>
                      <option value="self">Self</option>
                      <option value="minor child">Minor Child</option>
                      <option value="Family Member">Family Member</option>
                    </select>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-request-reason">
                      Reason for Request?
                    </Label>
                    <select
                      id="formrow-request-reason"
                      className="form-select form-control"
                      onChange={(e) => {
                        setReason(e.target.value);
                      }}
                    >
                      <option>Select</option>
                      <option value={"Childhood Trauma"}>
                        {" "}
                        Childhood Trauma
                      </option>
                      <option value={"Just Not Feeling Like Myself"}>
                        Just Not Feeling Like Myself
                      </option>
                      <option value={"Post Traumatic Stress Disorder"}>
                        Post Traumatic Stress Disorder
                      </option>
                      <option>Depression</option>
                      <option>Bi-Polar Disorder</option>
                      <option>Anxiety</option>
                    </select>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-email-Input">
                      Enter Your Email
                    </Label>
                    <Input
                      value={patientEmail}
                      onChange={(e) => {
                        setPatientEmail(e.target.value);
                      }}
                      type="text"
                      className="form-control"
                      id="formrow-email-Input"
                      placeholder=" Enter Your Email"
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-details-Input">
                      Please Enter Details of the Care You are Needing:
                    </Label>
                    <Input
                      value={consultDetails}
                      onChange={(e) => {
                        setConsultDetails(e.target.value);
                      }}
                      type="textarea"
                      maxLength="225"
                      className="form-control"
                      rows="3"
                      placeholder="Please Enter Details of the Care You are Needing:"
                    />
                  </div>
                </Col>
              </Row>
              <div>
                <button
                  type="submit"
                  className="btn w-md buttonBoxShadow"
                  style={{
                    backgroundColor: "#ac2ce7e0",
                    color: "white",
                    borderRadius: 40,
                    marginRight: 10,
                  }}
                >
                  Submit Consult Request
                </button>
                <Button
                  className="btn w-md buttonBoxShadow "
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

export default ConsultForm;
