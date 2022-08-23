import React, { useState, useEffect } from "react";
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
import moment from "moment";
import axiosInstance from "../api/TelePsyAPI";

let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp =
  Date.now() -
  (Date.now() % oneDay) +
  new Date().getTimezoneOffset() * 1000 * 60;

const recurringAppoints = [
  "Daily",
  "Weekly",
  "Bi-Weekly",
  "Monthly",
  "Bi-Monthly",
  "Annually",
  "No",
];
const appointmentTypes = [
  "New Consult",
  "Wellness Check",
  "Adult Patient",
  "Minor Child",
  "Perscription Refill",
  "Test Order",
];

const AppointmentForm = (props) => {
  const [selectedTime, SetSelectedTime] = useState("8:00am");
  const [loader, setLoader] = useState(false);
  const [doctorTimeSlots, setDoctorTimeSlots] = useState([]);
  const [selectedDate, SetSelectedDate] = useState(todayTimestamp);
  const [appointmentStartDTime, SetAppointmentStartDTime] = useState();
  const [selectedDuration, SetSelectedDuration] = useState(30);
  const [appointmentEndDTime, SetAppointmentEndDTime] = useState();
  const [selectedRecurringType, setSelectedRecurringType] = useState();
  const [selectedAppointmentType, setSelectedAppointmentType] = useState();
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoader(true);
    // props.onClose();
    const time = moment(selectedTime, "HH:mma");
    const timeStamp = moment(selectedDate[0]).set({
      hour: time.get("hour"),
      minute: time.get("minute"),
      second: time.get("second"),
    });
    console.log({ time, selectedTime, timeStamp, selectedDate });
    const payload = {
      requested_by: props.user.id,
      requester_type: props.user.type,
      doctor_id: user.doctor_id,
      patient_id: parseInt(props.patient),
      date: timeStamp.tz("UTC").format("YYYY-MM-DDTHH:mm:ss+00:00"),
      duration: parseInt(selectedDuration),
      recurring: selectedRecurringType,
      appointment_type: selectedAppointmentType,
    };
    console.log(payload);

    // All submitted appointments go to the appointments table until "is_confirmed" is true. At that point the appointment can be referenced in the meetings app.
    axiosInstance
      .post(`accounts/appointments/`, payload)
      .then(function (response) {
        console.log(`Axios response: ${response.status}`);
        console.log("Your appointment request has been sent.");
        props.onClose();
        setLoader(false);
      });
  };

  const fetchDoctorTimeSlots = async () => {
    const response = await axiosInstance.get(
      `accounts/doctors/${user.doctor_id}/available_times_by_day/?date=${moment(
        selectedDate[0]
      ).format("YYYY-MM-DD")}`
    );
    setDoctorTimeSlots(response.data);
    console.log("Doc Time Slots: ", response.data);
  };

  useEffect(() => {
    fetchDoctorTimeSlots();
  }, [selectedDate]);

  useEffect(() => {
    const momentTime = moment(selectedTime, "h:mma");
    const newStartTime = moment(selectedDate)
      .hour(momentTime.hour())
      .minute(momentTime.minute())
      .utc();
    SetAppointmentStartDTime(newStartTime.format());
    SetAppointmentEndDTime(
      newStartTime.add(parseInt(selectedDuration), "minutes").format()
    );
  }, [selectedTime, selectedDate, selectedDuration]);

  return (
    <Row>
      <Col lg={12}>
        <Card style={{ backgroundColor: "#219c7194", borderRadius: 15 }}>
          <CardBody>
            <CardHeader className="mb-4" tag="h4">
              Appointment Form
            </CardHeader>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-provider-Input">Patient Name</Label>
                    <select
                      // id={errColorP}
                      name="patient"
                      value={props.patient}
                      onChange={(e) => {
                        props.setPatient(e.target.value);
                        console.log(
                          "PatientObjectEMAIL:",
                          e.target.options[e.target.selectedIndex].title
                        );
                        setPatientName(
                          e.target.options[e.target.selectedIndex].textContent
                        );
                        setPatientEmail(
                          e.target.options[e.target.selectedIndex].title
                        );
                      }}
                      id="formrow-provider-Input"
                      className="form-select form-control"
                      // id="inputEmail4"
                      placeholder="Patient Dropdown"
                    >
                      <option>Select Patient</option>
                      {Object.entries(props.doctorPatients).map(
                        ([doctorPatient]) => (
                          <option
                            key={props.doctorPatients[doctorPatient].id}
                            value={props.doctorPatients[doctorPatient].id}
                            name={
                              props.doctorPatients[doctorPatient].first_name
                            }
                            title={props.doctorPatients[doctorPatient].email}
                          >
                            {props.doctorPatients[doctorPatient].first_name}{" "}
                            {props.doctorPatients[doctorPatient].last_name}
                          </option>
                        )
                      )}
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
                      id="formrow-date-Input"
                      onChange={SetSelectedDate}
                      placeholder="Click to find a date"
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
                      onChange={(e) => {
                        SetSelectedTime(e.target.value);
                      }}
                      value={selectedTime}
                    >
                      {doctorTimeSlots.map((time) => (
                        <option key={time}>{moment(time, "HH:mm:ss").format("LT")}</option>
                      ))}
                    </select>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-duration">Duration</Label>
                    <select
                      id="formrow-duration"
                      className="form-select form-control"
                      onChange={(e) => {
                        SetSelectedDuration(e.target.value);
                      }}
                      value={selectedDuration}
                    >
                      <option>Select</option>
                      <option value={30}>1/2 hour</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-appointmentType">
                      Appointment Type
                    </Label>
                    <select
                      id="formrow-appointmentType"
                      onChange={(e) => {
                        setSelectedAppointmentType(e.target.value);
                      }}
                      value={selectedAppointmentType}
                      className="form-select form-control"
                    >
                      <option>Select Type</option>
                      {appointmentTypes.map((appointmentType) => (
                        <option>{appointmentType}</option>
                      ))}
                    </select>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-recurring">
                      Recurring
                    </Label>
                    <select
                      id="formrow-recurring"
                      onChange={(e) => {
                        setSelectedRecurringType(e.target.value);
                      }}
                      value={selectedRecurringType}
                      className="form-select form-control"
                    >
                      <option>Select</option>
                      {recurringAppoints.map((recurringAppoint) => (
                        <option>{recurringAppoint}</option>
                      ))}
                      {/* <option>No</option> */}
                    </select>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-tending-practitioner-Input">
                      Practitioner/RN
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="formrow-tending-practitioner-Input"
                      placeholder="Tending Practitioner or RN"
                      // key={props.userDoctors.id}
                      // value={`${props.user.first_name} ${props.user.last_name}`}
                    />
                  </div>
                </Col>

                <Col md={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-patient-email-Input">
                      Patient Email
                    </Label>
                    <Input
                      type="email"
                      className="form-control"
                      id="formrow-patient-email-Input"
                      placeholder="Enter Patient Email"
                      value={patientEmail}
                      key={props.doctorPatients.id}
                    />
                  </div>
                </Col>

                <Col md={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-patient-email-Input">Email</Label>
                    <Input
                      type="email"
                      className="form-control"
                      id="formrow-patient-email-Input"
                      placeholder="Enter Email"
                      value={props.user.email}
                    />
                  </div>
                </Col>
              </Row>
              <div style={{ padding: 10 }}>
                {loader ? (
                  <h5>Saving appointment...</h5>
                ) : (
                  <>
                    <button
                      className="btn w-md buttonBoxShadow"
                      style={{
                        backgroundColor: "#ac2ce7e0",
                        color: "white",
                        borderRadius: 40,
                        marginRight: 10,
                      }}
                    >
                      Schedule Appointment
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
                  </>
                )}
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
    /* <div class="rbc-toolbar"><span class="rbc-btn-group"><button type="button">Today</button><button type="button">Back</button><button type="button">Next</button></span><span class="rbc-toolbar-label">{label}</span><span class="rbc-btn-group"><button type="button" class="rbc-active">Month</button><button type="button" class="">Week</button><button type="button" class="">Day</button><button type="button" class="">Agenda</button></span></div> */
  );
};

export default AppointmentForm;

// date = models.DateTimeField()
// duration = models.IntegerField(null=True)
// type = models.CharField(max_length=50, null=True)
// recurring = models.CharField(max_length=50, null=True)
// notes = models.JSONField(null=True, blank=True)
// questionnaires = models.JSONField(null=True, blank=True)
// status = models.CharField(max_length=20, choices=AppointmentStatus.choices, default=AppointmentStatus.REQUESTED)
// sent = models.BooleanField(default=False)

// doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
// patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
// pharmacy = models.ForeignKey(Pharmacy, null=True, on_delete=models.SET_NULL, default='FakePharm')
