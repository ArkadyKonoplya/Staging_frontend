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
import DatePicker from "./DatePicker";
import moment from "moment";
let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp =
  Date.now() -
  (Date.now() % oneDay) +
  new Date().getTimezoneOffset() * 1000 * 60;

// const recurringAppoints = ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Bi-Monthly', 'Annually', 'No']
// const appointmentTypes = ['New Consult', 'Wellness Check', 'Adult Patient', 'Minor Child', 'Perscription Refill', 'Test Order'];

const ProvRescheduleForm = (props) => {
  const fullName =
    `${props.rescheduledData?.patient?.first_name} ${props.rescheduledData?.patient?.last_name}`.includes(
      undefined
    ) === true
      ? null
      : `${props.rescheduledData?.patient?.first_name} ${props.rescheduledData?.patient?.last_name}`;
  const [patient, setPatient] = useState(fullName || "");
  const [originalTime, setOriginalTime] = useState(
    moment(props.rescheduledData?.date).format("hh:mm:ss a") || ""
  );
  const [originalDate, setOriginalDate] = useState(
    new Date(props.rescheduledData?.date) || ""
  );
  const [originalDuration, setOriginalDuration] = useState(
    props.rescheduledData?.duration || ""
  );
  const [selectedTime, SetSelectedTime] = useState("8:00am");
  const [selectedDate, SetSelectedDate] = useState(todayTimestamp);
  const [selectedDuration, SetSelectedDuration] = useState("30");
  const [firstSelectedDuration, SetFirstSelectedDuration] = useState("30");
  const [secondSelectedTime, SetSecondSelectedTime] = useState("8:00am");
  const [secondSelectedDate, SetSecondSelectedDate] = useState(todayTimestamp);
  const [secondSelectedDuration, SetSecondSelectedDuration] = useState("30");

  const [appointmentStartDTime, SetAppointmentStartDTime] = useState();
  const [appointmentEndDTime, SetAppointmentEndDTime] = useState();
  const [details, setDetails] = useState("");
  const [provider, setProvider] = useState(
    `${props.user.first_name} ${props.user.last_name}`
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ appointmentStartDTime, appointmentEndDTime });

    const payload = {
      patient: patient,
      originalTime: originalTime,
      originalDate: originalDate,
      originalDuration: originalDuration,
      selectedDate: selectedDate,
      selectedTime: selectedTime,
      firstSelectedDuration: firstSelectedDuration,
      secondSelectedTime: secondSelectedTime,
      secondSelectedDate: secondSelectedDate,
      secondSelectedDuration: secondSelectedDuration,
      details: details,
      provider: provider,
    };
    console.log(payload, 'payload');
    props.onClose();

    const resetForm = () => {
      setOriginalDate("");
      setOriginalTime("");
      setPatient("");
      setOriginalDuration("");
      setDetails("");
      console.log("Form cleared");
    };
    props.setRescheduledStatus()
    resetForm();
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
  return (
    <Row>
      <Col lg={12}>
        <Card
          style={{ backgroundColor: "rgb(250, 228, 199)", borderRadius: 15 }}
        >
            <CardHeader className="mb-4" tag="h4">
              Reschedule
            </CardHeader>
          <CardBody>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label>Patient</Label>
                    <Input
                      type="text"
                      value={patient}
                      className="form-control"
                      placeholder="Full Name"
                      onChange={({ target }) => setPatient(target.value)}
                      disabled={props.rescheduledStatus}
                    />
                  </div>
                </Col>
                <Col lg={2}>
                  <div className="mb-3">
                    <Label>Original Time</Label>
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Enter Time"
                      value={originalTime}
                      onChange={({ target }) => setOriginalTime(target.value)}
                      disabled={props.rescheduledStatus}
                    />
                  </div>
                </Col>
                <Col lg={2}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-date-Input">
                      Original Date
                    </Label>
                    <Flatpickr
                      className="form-control d-block"
                      id="formrow-date-Input"
                      placeholder="Enter Date"
                      value={originalDate}
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                      }}
                      onChange={(value) => {
                        const formattedDate = moment(value[0]).format(
                          "DD/MM/YYYY"
                        );
                        setOriginalDate(formattedDate);
                      }}
                      disabled={props.rescheduledStatus}
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label>Duration</Label>
                    <Input
                      type="text"
                      value={originalDuration}
                      className="form-control"
                      placeholder="Enter Dur."
                      onChange={({ target }) =>
                        setOriginalDuration(target.value)
                      }
                      disabled={props.rescheduledStatus}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-date-Input">
                      First Request Date
                    </Label>
                    <Flatpickr
                      className="form-control d-block"
                      id="formrow-date-Input"
                      placeholder="Click to find a date"
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                      }}
                      onChange={(value) => {
                        const formattedDate = moment(value[0]).format(
                          "DD/MM/YYYY"
                        );
                        SetSelectedDate(formattedDate);
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
                      onChange={({ target }) => SetSelectedTime(target.value)}
                    >
                      <option value="0">Choose...</option>
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
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-duration">
                      First Requested Duration
                    </Label>
                    <select
                      id="formrow-duration"
                      className="form-select form-control"
                      onChange={({ target }) =>
                        SetFirstSelectedDuration(target.value)
                      }
                    >
                      <option>Select</option>
                      <option value={30}>1/2 hour</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-date-Input">
                      Second Request Date
                    </Label>
                    <Flatpickr
                      className="form-control d-block"
                      id="formrow-date-Input"
                      placeholder="Click to find a date"
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                      }}
                      onChange={(value) => {
                        const formattedDate = moment(value[0]).format(
                          "DD/MM/YYYY"
                        );
                        SetSecondSelectedDate(formattedDate);
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
                      onChange={({ target }) =>
                        SetSecondSelectedTime(target.value)
                      }
                    >
                      <option value="0">Choose...</option>
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
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-duration">
                      Second Requested Duration
                    </Label>
                    <select
                      id="formrow-duration"
                      className="form-select form-control"
                      onChange={({ target }) =>
                        SetSecondSelectedDuration(target.value)
                      }
                    >
                      <option>Select</option>
                      <option value={30}>1/2 hour</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-email-Input">Provider</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="formrow-email-Input"
                      placeholder="Provider Name"
                      value={provider}
                      onChange={({ target }) => setProvider(target.value)}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-details-Input">
                      Why Reschedule is Needed:
                    </Label>
                    <Input
                      type="textarea"
                      maxLength="225"
                      rows="3"
                      placeholder="Why Reschedule is Needed:"
                      onChange={({ target }) => setDetails(target.value)}
                    />
                  </div>
                </Col>
              </Row>
              <div>
                <button
                  className="btn w-md buttonBoxShadow"
                  style={{
                    backgroundColor: "#4583f0",
                    color: "white",
                    borderRadius: 40,
                    marginRight: 10,
                  }}
                  onClick={handleSubmit}
                >
                  Send Reschedule Request
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

export default ProvRescheduleForm;
