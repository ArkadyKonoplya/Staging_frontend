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
// import DatePicker from "../../components/DatePicker";
// import axiosInstance from "../api/TelePsyAPI";
import moment from "moment";

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
  "Wellness Check",
  "Adult Patient",
  "Minor Child",
  "Perscription Refill",
  "Test Order",
];

const AppointmentForm = (props) => {
  const [selectedTime, SetSelectedTime] = useState("8:00am");
  const [loader, setLoader] = useState(false);
  const [selectedDate, SetSelectedDate] = useState(todayTimestamp);
  const [appointmentStartDTime, SetAppointmentStartDTime] = useState();
  const [selectedDuration, SetSelectedDuration] = useState("30");
  const [appointmentEndDTime, SetAppointmentEndDTime] = useState();
  const [selectedRecurringType, setSelectedRecurringType] = useState();
  const [selectedAppointmentType, setSelectedAppointmentType] = useState();
  const [providerName, setProviderName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoader(true);
    console.log({ appointmentStartDTime, appointmentEndDTime });

    // All submitted appointments go to the appointments table until "is_confirmed" is true. At that point the appointment can be referenced in the meetings app.
    // axiosInstance
    //   .post("accounts/appointments/", {
    //     patient_id: "1",
    //     doctor_id: "3",
    //     selectedTime: selectedTime,
    //     date: selectedDate,
    //     selectedDuration: parseInt(selectedDuration),
    //   })
    //   .then(function (response) {
    //     console.log(`Axios response: ${response.status}`);
    //     console.log("Your appointment request has been sent.")
    //   });

    props.receiveCalData({
      title: providerName,
      time: selectedTime,
      allDay: false,
      start: selectedDate,
      end: selectedDate,
    });

    const payload = {
      user: props.user.id,
      type: props.user.type,
      provider: props.provider,
      selectedTime: selectedTime,
      selectedDate: selectedDate,
      // selectedProvEmail: selectedDate,
      selectedDuration: parseInt(selectedDuration),
      appointmentStartDTime: appointmentStartDTime,
      appointmentEndDTime: appointmentEndDTime,
      selectedRecurringType: selectedRecurringType,
      selectedAppointmentType: selectedAppointmentType,
    };
    console.log(payload);
    props.onClose();
    setLoader(false);
  };
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

  console.log(props.userDoctors);
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
                    <Label htmlFor="formrow-provider-Input">
                      Choose Provider
                    </Label>
                    <select
                      name="doctors"
                      id="formrow-provider-Input"
                      value={props.provider}
                      onChange={(e) => {
                        props.setProvider(e.target.value);
                        setProviderName(
                          e.target.options[e.target.selectedIndex].textContent
                        );
                      }}
                      className="form-select form-control"
                    >
                      <option>Providers</option>
                      {Object.entries(props.userDoctors).map(([provider]) => (
                        <option
                          key={provider}
                          value={props.userDoctors[provider].id}
                        >
                          {console.log(
                            "Doctors related to patient: ",
                            props.userDoctors[provider].id

                            //   "Provider Email:", props.userDoctors[provider].email
                          )}
                          {props.userDoctors[provider].first_name}{" "}
                          {props.userDoctors[provider].last_name}
                        </option>
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
                      id="formrow-date-Input"
                      onChange={SetSelectedDate}
                      placeholder="dd M,yyyy"
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
                      <option>8:00am</option>
                      <option>8:30am</option>
                      <option>9:00am</option>
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
                    <Label htmlFor="formrow-tending-practitioner-Input">
                      Tending Practitioner
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="formrow-tending-practitioner-Input"
                      placeholder="Tending Practitioner"
                      key={props.userDoctors.id}
                      value={
                        props.provider &&
                        typeof props.userDoctors[props.provider] === "object"
                          ? `${props.userDoctors[props.provider].first_name} ${
                              props.userDoctors[props.provider].last_name
                            }`
                          : ""
                      }
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-patient-email-Input">
                      Patient Email
                    </Label>
                    <Input
                      type="email"
                      className="form-control"
                      id="formrow-patient-email-Input"
                      placeholder="Enter Patient Email"
                      value={props.user.email}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-practitioner-email-Input">
                      Practitioner Email
                    </Label>
                    <Input
                      type="email"
                      className="form-control"
                      id="formrow-practitioner-email-Input"
                      placeholder="Practitioner Email"
                      key={props.userDoctors.id}
                      value={
                        props.provider &&
                        typeof props.userDoctors[props.provider] === "object"
                          ? props.userDoctors[props.provider].email
                          : ""
                      }
                    />
                  </div>
                </Col>
              </Row>
              <div>
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
                      Request Appointment
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
                  </>
                )}
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AppointmentForm;
// Use this as an appointment request from patient:
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
