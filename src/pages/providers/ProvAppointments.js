import React, { useState, useEffect, useContext } from "react";
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
  Modal as ModalBootstrap,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import * as qs from "query-string";
import { useParams } from "react-router-dom";
import OfficeHours from "../../components/providers/OfficeHours";
import Sidebar from "../../components/providers/ProvSidebar";
import Header from "../../components/providers/HeaderProv";
import RecordedAppointmentsProv from "../../components/providers/RecordedAppointProv";
import axiosInstance from "../../api/TelePsyAPI";
import AppointmentForm from "../../components/AppointmentForm";
import ReferralForm from "../../components/providers/ReferralForm";
import ConsultForm from "../../components/providers/ConsultForm";
import RescheduleForm from "../../components/RescheduleForm";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { SubscriptionContext } from "../../helpers/subscriptionContext";
import { id } from "date-fns/locale";
import IsApprovedMessage from "../../components/IsApprovedMessage";
import IsPartnerMessage from "../../components/IsPartnerMessage";

let MyCustomHeader = ({ label, onNavigate, onView }) => (
  <div className="rbc-toolbar">
    <span className="rbc-btn-group"></span>
    <button
      onClick={() => {
        onNavigate("PREV");
      }}
      type="button"
    >
      Back
    </button>
    <span className="rbc-toolbar-label">{label}</span>
    <button
      onClick={() => {
        onNavigate("NEXT");
      }}
      type="button"
    >
      Next
    </button>
    <span className="rbc-btn-group">
      {" "}
      <button
        onClick={() => {
          onNavigate("TODAY");
        }}
        type="button"
      >
        Today
      </button>
      <button
        type="button"
        onClick={() => {
          onView("month");
        }}
        className="rbc-active"
      >
        Month
      </button>
      <button
        onClick={() => {
          onView("week");
        }}
        type="button"
        className=""
      >
        Week
      </button>
      <button
        onClick={() => {
          onView("day");
        }}
        type="button"
        className=""
      >
        Day
      </button>
      <button
        onClick={() => {
          onView("agenda");
        }}
        type="button"
        className=""
      >
        Agenda
      </button>
    </span>
  </div>
);

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function ProvAppointments() {
  const { consultRequestid } = useParams();
  const [selectedEvent, setSelectedEvent] = useState(undefined);
  const [modalState, setModalState] = useState(false);
  const [nestedModalState, setNestedModalState] = useState(false);
  const [showAppoint, setShowAppoint] = useState(false);
  const [showRefer, setShowRefer] = useState(false);
  const [showResch, setShowResch] = useState(false);
  const [showConsult, setShowConsult] = useState(false);
  const [doctorPatients, setDoctorPatients] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [events, setEvents] = useState([]);
  const [patient, setPatient] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [officeIsActive, setOfficeIsActive] = useState(true);
  const [rescheduledData, setRescheduledData] = useState({});
  const [rescheduledStatus, setRescheduledStatus] = useState(false);

  const [referralData, setReferralData] = useState([]);

  const onClickA = () => {
    setShowAppoint(!showAppoint);
    setShowRefer(false);
    setShowResch(false);
  };

  const onClickConsult = () => {
    setShowConsult(!showConsult);
    setShowAppoint(false);
    setShowRefer(false);
    setShowResch(false);
  };

  const onClickR = () => {
    setShowRefer(!showRefer);
    setShowResch(false);
    setShowAppoint(false);
  };
  const onClickRe = () => {
    setShowResch(!showResch);
    setShowAppoint(false);
    setShowRefer(false);
    setRescheduledData({});
    setRescheduledStatus(false);
  };

  const [hoursData, setHoursData] = useState({
    monday: {
      open: "8:00am",
      closed: "4:00pm",
      isClosed: false,
    },
    tuesday: {
      open: "8:00am",
      closed: "4:00pm",
      isClosed: false,
    },
    wednesday: {
      open: "8:00am",
      closed: "4:00pm",
      isClosed: false,
    },
    thursday: {
      open: "8:00am",
      closed: "4:00pm",
      isClosed: false,
    },
    friday: {
      open: "8:00am",
      closed: "4:00pm",
      isClosed: false,
    },
    saturday: {
      open: "8:00am",
      closed: "4:00pm",
      isClosed: false,
    },
    sunday: {
      open: "8:00am",
      closed: "4:00pm",
      isClosed: false,
    },
  });

  let MyMonthDateHeader = (props) => {
    const isDisabled =
      hoursData[moment(props.date).format("dddd").toLowerCase()].isClosed ||
      (moment(props.date).isAfter(moment()) && !officeIsActive);

    return <div style={{ opacity: isDisabled ? 0.3 : 1 }}>{props.label}</div>;
  };

  // const receiveCalData = (createNewEvent) => {
  //   console.log("New Event data:", createNewEvent);
  //   setEvents((prev) => {
  //     return [...prev, createNewEvent];
  //   });
  // };

  // const fetchReferrals = async () => {
  //   const response = await axiosInstance.get(`accounts/referral_requests/`);
  //   setReferrals(response.data);
  //   console.log("Get Referrals: ", response.data);
  // };

  const fetchDoctorPatients = async () => {
    const response = await axiosInstance.get(
      `accounts/users/${user.id}/get_doctor_patients/`
    );
    setDoctorPatients(response.data);
    console.log("Get DocPatients: ", response.data);
  };

  const fetchEvents = async () => {
    const response = await axiosInstance.get(`accounts/appointments/`);
    const newEvents = response.data.map((item) => ({
      ...item,
      title: `${item.patient.first_name} ${item.patient.last_name}`,
      time: new Date(item.date),
      allDay: false,
      start: new Date(item.date),
      end: new Date(item.date),
    }));
    setEvents(newEvents);
    console.log("Appointments of Doc: ", response.data);
  };

  useEffect(() => {
    const parsed = qs.parse(location.search);

    if (parsed?.from && parsed?.from === "dashboard") {
      const { first_name, last_name, date, duration, id } = parsed;
      setRescheduledData({
        patient: {
          first_name,
          last_name,
        },
        date,
        duration,
        id,
      });
      setShowResch(true);
    }

    if (parsed?.from && parsed?.from === "dashboard_consult") {
      const {
        patient_full_name,
        requested_time,
        requested_date,
        specialty,
        id,
        details,
        reason_for_request,
      } = parsed;

      setReferralData({
        patient_full_name,
        requested_time,
        requested_date,
        specialty,
        id,
        details,
        reason_for_request,
      });
      setShowRefer(true);
    }
  }, []);

  useEffect(() => {
    fetchDoctorPatients();
    // fetchReferrals();
    fetchEvents();
  }, [showAppoint, showResch, modalState]);

  const rescheduleEvent = (event) => {
    event.is_rescheduled = true;
    setRescheduledData(event);
    setRescheduledStatus(true);
    setModalState(false);
    setShowResch(true);
  };

  const cancelEvent = (event) => {
    event.is_cancelled = true;
    setNestedModalState(false);
    setModalState(false);
  };

  const Modal = () => {
    return (
      <ModalBootstrap
        size="lg"
        centered
        style={{
          maxWidth: "350px",
          width: "50%",
        }}
        isOpen={modalState}
        backdrop={false}
        contentClassName="modal-calendar-style"
      >
        <ModalBody
          style={{
            backgroundColor: "cadetblue",
            borderRadius: "0.8rem",
            borderColor: "black",
            borderWidth: 5,
          }}
        >
          <Row form>
            <Col className="col-12 mb-3">
              <h4>{selectedEvent.title}</h4>
              <Label className="form-label">
                {moment.utc(selectedEvent.time).local().format("LT")}
              </Label>
            </Col>
          </Row>
          <Row>
            <Col className="col-12 mb-3">
              <div>
                {selectedEvent.status === "Confirmed" && (
                  <button
                    type="button"
                    className="btn me-2 mb-3 startBtns"
                    onClick={() => {
                      /*  Backup appt: https://zoom.us/s/97094290126?zak=eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMSIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6IjhoLUw5enoxVGpxMHljN1lRa1A3VkEiLCJpc3MiOiJ3ZWIiLCJzayI6IjAiLCJzdHkiOjk5LCJ3Y2QiOiJhdzEiLCJjbHQiOjAsIm1udW0iOiI5NzA5NDI5MDEyNiIsImV4cCI6MTY1OTQ2MDM3MiwiaWF0IjoxNjUxNjg0MzcyLCJhaWQiOiJqRTM3UUpWZFJEQ3kwd21qQjhQX0p3IiwiY2lkIjoiIn0.nEAVLr3AoijRDEbjPESbYLBoXpkOP421BUWMqoTYIRs */

                      /*  Audra's appt: */
                      window.open(
                        "https://zoom.us/s/97965074667?zak=eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMSIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6IjhoLUw5enoxVGpxMHljN1lRa1A3VkEiLCJpc3MiOiJ3ZWIiLCJzayI6IjAiLCJzdHkiOjk5LCJ3Y2QiOiJhdzEiLCJjbHQiOjAsIm1udW0iOiI5Nzk2NTA3NDY2NyIsImV4cCI6MTY1OTQ1OTk0NiwiaWF0IjoxNjUxNjgzOTQ2LCJhaWQiOiJqRTM3UUpWZFJEQ3kwd21qQjhQX0p3IiwiY2lkIjoiIn0.DPNfzc7z9kqhEza5inxTE9HvWJg_6It1Nl3660UagLY"
                      );
                    }}
                    style={{
                      borderRadius: 10,
                      borderColor: "black",
                      borderWidth: 1,
                    }}
                  >
                    Start Session
                  </button>
                )}

                <button
                  type="button"
                  className={`btn me-2 ${
                    selectedEvent.status === "Confirmed" && "mb-3"
                  } cancelBtn`}
                  onClick={() => setNestedModalState(true)}
                  style={{
                    borderRadius: 10,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn me-2 calBtns"
                  onClick={() => rescheduleEvent(selectedEvent)}
                  style={{
                    borderRadius: 10,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                >
                  Reschedule
                </button>
                <button
                  onClick={() => setModalState(false)}
                  type="button"
                  className="btn me-2 closeBtn"
                  style={{
                    borderRadius: 10,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                >
                  Close
                </button>
              </div>
            </Col>
          </Row>

          <ModalBootstrap centered isOpen={nestedModalState}>
            <ModalBody>
              Are you sure you would like to cancel this appointment?
            </ModalBody>
            <ModalFooter>
              <Button
                color="success"
                onClick={() => cancelEvent(selectedEvent)}
              >
                Yes
              </Button>{" "}
              <Button color="danger" onClick={() => setNestedModalState(false)}>
                No
              </Button>
            </ModalFooter>
          </ModalBootstrap>
        </ModalBody>
      </ModalBootstrap>
    );
  };

  const handleSelectedEvent = (event) => {
    console.log(event, "event");
    setSelectedEvent(event);
    setModalState(true);
  };

  // console.log(contextData.sub, "value");
  const { userContext } = useContext(SubscriptionContext);

  return (
    <section>
      <Sidebar />
      <div className="main-content">
        <Header />
        {userContext?.is_approved === true ? null : <IsApprovedMessage />}

        {userContext?.is_approved === false ? null : (
          <>
            {userContext?.is_partner_account === false ? null : (
              <IsPartnerMessage />
            )}
          </>
        )}

        <main
          className="provider-dash"
          style={{
            filter:
              userContext?.is_partner_account === true
                ? "blur(2px)"
                : userContext?.is_approved === true
                ? null
                : "blur(2px)",
          }}
        >
          <Container fluid={true}>
            <Row>
              <Col lg={6}>
                <CardBody>
                  <div className="row cal">
                    {selectedEvent && <Modal />}
                    <Calendar
                      components={{
                        toolbar: MyCustomHeader,
                        month: { dateHeader: MyMonthDateHeader },
                        // dateCellWrapper: MyCustomDay,
                      }}
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ width: "100%", height: 500, margin: "10px" }}
                      onSelectEvent={(e) => handleSelectedEvent(e)}
                    />
                  </div>
                </CardBody>
              </Col>
              <Col
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30,
                }}
              >
                <Row>
                  <Col lg={6}>
                    <div className="" style={{ alignContents: "center" }}>
                      <Button
                        className="mb-2 btn waves-effect waves-light"
                        onClick={
                          userContext?.is_approved === true ? onClickA : null
                        }
                        style={{
                          backgroundColor: "#059c67",
                          textAlign: "center",
                        }}
                      >
                        Appointment Form
                      </Button>

                      <Button
                        className="mb-2 btn waves-effect waves-light"
                        onClick={
                          userContext?.is_approved === true ? onClickR : null
                        }
                        style={{
                          backgroundColor: "#ab8c91",
                        }}
                      >
                        Referral Form
                      </Button>
                      <Button
                        className="mb-2 btn waves-effect waves-light"
                        onClick={
                          userContext?.is_approved === true ? onClickRe : null
                        }
                        style={{
                          backgroundColor: "#03442d",
                        }}
                      >
                        Reschedule Form
                      </Button>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <p>
                      <b>
                        Schedule a consult with
                        <br />
                        collaborator physician
                      </b>
                    </p>
                    <Button
                      className="btn waves-effect waves-light"
                      onClick={
                        userContext?.is_approved === true
                          ? onClickConsult
                          : null
                      }
                      style={{
                        backgroundColor: "#CCCCB2",
                        color: "#000",
                        textAlign: "center",
                      }}
                    >
                      Consult Request
                    </Button>
                  </Col>
                </Row>

                {/* Appointment form */}
                <ModalBootstrap
                  isOpen={showAppoint}
                  toggle={() => {
                    onClickA();
                  }}
                  centered
                  size="lg"
                  contentClassName="modal-calendar-style"
                >
                  <AppointmentForm
                    doctorPatients={doctorPatients}
                    patient={patient}
                    setPatient={setPatient}
                    user={user}
                    onClose={() => setShowAppoint(false)}
                  />
                </ModalBootstrap>

                {/* Consult form */}
                <ModalBootstrap
                  isOpen={showConsult}
                  toggle={() => {
                    onClickConsult();
                  }}
                  centered
                  size="lg"
                  contentClassName="modal-calendar-style"
                >
                  <ConsultForm
                    doctorPatients={doctorPatients}
                    patient={patient}
                    setPatient={setPatient}
                    user={user}
                    onClose={() => setShowConsult(false)}
                  />
                </ModalBootstrap>

                {/* referral form */}
                <ModalBootstrap
                  isOpen={showRefer}
                  toggle={() => {
                    onClickR();
                  }}
                  centered
                  size="lg"
                  contentClassName="modal-calendar-style"
                >
                  <ReferralForm
                    patient={patient}
                    setPatient={setPatient}
                    user={user}
                    onClose={() => {
                      setShowRefer(false);
                      setReferralData({});
                    }}
                    referralData={referralData}
                  />
                </ModalBootstrap>

                {/* Reschedule Form */}
                <ModalBootstrap
                  isOpen={showResch}
                  toggle={() => {
                    onClickRe();
                  }}
                  centered
                  size="xl"
                  contentClassName="modal-calendar-style"
                >
                  <RescheduleForm
                    consultRequestid={consultRequestid}
                    doctorPatients={doctorPatients}
                    patient={patient}
                    setPatient={setPatient}
                    user={user}
                    onClose={() => {
                      setShowResch(false);
                      setRescheduledData({});
                      setRescheduledStatus(false);
                    }}
                    rescheduledData={rescheduledData}
                    rescheduledStatus={rescheduledStatus}
                    setRescheduledStatus={setRescheduledStatus}
                  />
                </ModalBootstrap>

                <Row>
                  <Col lg={12}>
                    <div className="OHours">
                      <OfficeHours
                        officeIsActive={officeIsActive}
                        setOfficeIsActive={setOfficeIsActive}
                        hoursData={hoursData}
                        setHoursData={setHoursData}
                        isApproved={userContext?.is_approved}
                        isPartner={userContext?.is_partner_account}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
              <RecordedAppointmentsProv isApproved={userContext?.is_approved} />
            </Row>
          </Container>
        </main>
      </div>
    </section>
  );
}

export default ProvAppointments;
