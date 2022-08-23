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
import DatePicker from "../../components/DatePicker";
import moment from "moment";
let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp =
  Date.now() -
  (Date.now() % oneDay) +
  new Date().getTimezoneOffset() * 1000 * 60;

// const recurringAppoints = ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Bi-Monthly', 'Annually', 'No']
// const appointmentTypes = ['New Consult', 'Wellness Check', 'Adult Patient', 'Minor Child', 'Perscription Refill', 'Test Order'];

const PaRescheduleForm = (props) => {
  const originalDateValue =
    props.rescheduledData?.start === undefined
      ? null
      : props.rescheduledData?.start[0];
  const [practitioner, setPractitioner] = useState(
    props.rescheduledData?.title || ""
  );
  const [selectedOriginalTime, setSelectedOriginalTime] = useState(
    props.rescheduledData?.time || ""
  );
  const [selectedOriginalDate, setSelectedOriginalDate] = useState(
    originalDateValue || todayTimestamp
  );
  const [selectedDuration, setSelectedDuration] = useState("30");
  const [firstDate, setFirstDate] = useState("");
  const [secondDate, setSecondDate] = useState(todayTimestamp);
  const [firstRequestDuration, setFirstRequestDuration] = useState("");
  const [secondRequestDuration, setSecondRequestDuration] =
    useState(todayTimestamp);
  const [patientName, setPatientName] = useState("");
  const [rescheduleTime, SetRescheduleTime] = useState("");
  const [rescheduleReasons, SetRescheduleReasons] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      {
        practitioner,
        selectedDuration,
        selectedOriginalTime,
        selectedOriginalDate,
        selectedOriginalDate,
        firstDate,
        secondDate,
        firstRequestDuration,
        secondRequestDuration,
        patientName,
        rescheduleTime,
        rescheduleReasons,
      },
      "Submit payload here"
    );
    props.setRescheduledStatus();
    props.onClose();
  };
  // useEffect(() => {
  //   const momentTime = moment(selectedTime, "h:mma");
  //   const newStartTime = moment(selectedDate)
  //     .hour(momentTime.hour())
  //     .minute(momentTime.minute())
  //     .utc();
  //   SetAppointmentStartDTime(newStartTime.format());
  //   SetAppointmentEndDTime(
  //     newStartTime.add(parseInt(selectedDuration), "minutes").format()
  //   );
  // }, [selectedTime, selectedDate, selectedDuration]);

  return (
    <Row>
      <Col lg={12}>
        <Card
          style={{ backgroundColor: "rgb(250, 228, 199)", borderRadius: 15 }}
        >
          <CardBody>
            <CardHeader className="mb-4" tag="h4">
              Reschedule
            </CardHeader>

            <Form>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label>Practitioner</Label>
                    <Input
                      type="text"
                      value={practitioner}
                      className="form-control"
                      placeholder="Autofill Practitioner Name"
                      onChange={({ target }) => setPractitioner(target.value)}
                      disabled={props.rescheduledStatus}
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label>Original Time</Label>
                    <Input
                      type="text"
                      value={selectedOriginalTime}
                      className="form-control"
                      placeholder="Autofill Original Time"
                      onChange={({ target }) =>
                        setSelectedOriginalTime(target.value)
                      }
                      disabled={props.rescheduledStatus}
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-date-Input">
                      Original Date
                    </Label>
                    <Flatpickr
                      className="form-control d-block"
                      id="formrow-date-Input"
                      placeholder="Autofill Original Date"
                      value={selectedOriginalDate}
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                      }}
                      onChange={(value) => {
                        const formattedDate = moment(value[0]).format(
                          "DD/MM/YYYY"
                        );
                        setSelectedOriginalDate(formattedDate);
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
                      className="form-control"
                      placeholder="Autofill Duration"
                      onChange={({ target }) =>
                        setSelectedDuration(target.value)
                      }
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-date-Input">
                      First Request Date
                    </Label>
                    <Flatpickr
                      className="form-control d-block"
                      id="formrow-date-Input"
                      placeholder="First Request Date"
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                      }}
                      onChange={(value) => {
                        const formattedDate = moment(value[0]).format(
                          "DD/MM/YYYY"
                        );
                        setFirstDate(formattedDate);
                      }}
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label htmlFor="form-control formrow-date-Input">
                      Second Request Date
                    </Label>
                    <Flatpickr
                      className="form-control d-block"
                      id="formrow-date-Input"
                      placeholder="Second Request Date"
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                      }}
                      onChange={(value) => {
                        const formattedDate = moment(value[0]).format(
                          "DD/MM/YYYY"
                        );
                        setSecondDate(formattedDate);
                      }}
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-duration">
                      First Requested Duration
                    </Label>
                    <select
                      id="formrow-duration"
                      className="form-select form-control"
                      onChange={({ target }) =>
                        setFirstRequestDuration(target.value)
                      }
                    >
                      <option>Select</option>
                      <option value={30}>1/2 hour</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-duration">
                      Second Requested Duration
                    </Label>
                    <select
                      id="formrow-duration"
                      className="form-select form-control"
                      onChange={({ target }) =>
                        setSecondRequestDuration(target.value)
                      }
                    >
                      <option>Select</option>
                      <option value={30}>1/2 hour</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-email-Input">Patient Name</Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="formrow-email-Input"
                      placeholder=" Autofill Patient Name making the request."
                      onChange={({ target }) => setPatientName(target.value)}
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-time-Input">Select a Time</Label>
                    <select
                      id="formrow-time-Input"
                      className="form-select form-control"
                      onChange={({ target }) => SetRescheduleTime(target.value)}
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
              </Row>

              <Row></Row>

              <Row>
                <Col md={12}>
                  <div className="mb-3">
                    <Label htmlFor="formrow-details-Input">
                      Why Reschedule is Needed:
                    </Label>
                    <Input
                      type="textarea"
                      maxLength="225"
                      rows="3"
                      placeholder="Why Reschedule is Needed:"
                      onChange={({ target }) =>
                        SetRescheduleReasons(target.value)
                      }
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
                  className="btn w-md buttonBoxShadow "
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: 40,
                  }}
                  onClick={() =>
                    props.onClose()
                  }
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

export default PaRescheduleForm;
