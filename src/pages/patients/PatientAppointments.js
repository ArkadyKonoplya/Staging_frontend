import Sidebar from "../../components/patients/SidebarPatient";
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
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import NewUserRequirement from "../../components/patients/NewUserRequirementModal";
import { useHistory } from "react-router-dom";
import * as qs from "query-string";
import { SubscriptionContext } from "../../helpers/subscriptionContext";
import Header from "../../components/patients/HeaderPatient";
import PatientDoctorInfo from "../../components/patients/PatientDoctorInfo";
import RecordedAppointmentsPA from "../../components/patients/RecordedAppointPA";
import axiosInstance from "../../api/TelePsyAPI";
import AppointmentForm from "../../components/patients/PatientAppointmentForm";
import CheckoutModal from "../../components/CheckoutModal";
import ConsultForm from "../../components/patients/ConsultForm";
import PaRescheduleForm from "../../components/patients/PatientRescheduleForm";
import PricingCard from "../../components/patients/PricingCard";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { requiredInformation } from "../../helpers";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import React, { useState, useEffect, useContext } from "react";

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

function PatientAppointments({ props }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [userDoctors, setUserDoctors] = useState([]);
  const [newDoctors, setNewDoctors] = useState([]);
  // const [doctorPatient, setDoctorPatient] = useState({});
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [doctorsBySpecial, setDoctorsBySpecial] = useState([]);
  const [provider, setProvider] = useState("");
  const [showAppoint, setShowAppoint] = useState(false);
  const [showRefer, setShowRefer] = useState(false);
  const [showResch, setShowResch] = useState(false);
  const [modal_center, setmodal_center] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(undefined);
  const [modalState, setModalState] = useState(true);
  const [events, setEvents] = useState([]);
  const [nestedModalState, setNestedModalState] = useState(false);
  const [rescheduledData, setRescheduledData] = useState({});
  const [rescheduledStatus, setRescheduledStatus] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("");
  // const [subscribed] = useState(false);
  const [subscribemodal, setSubscribemodal] = useState(false);

  let history = useHistory();

  const tog_scroll = () => {
    setSubscribemodal(!subscribemodal);
    removeBodyCss();
  };

  const onClickA = () => {
    setShowAppoint(!showAppoint);
    setShowRefer(false);
    setShowResch(false);
    removeBodyCss();
  };

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const onClickR = () => {
    setShowRefer(!showRefer);
    setShowResch(false);
    setShowAppoint(false);
    removeBodyCss();
  };
  const onClickRe = () => {
    setShowResch(!showResch);
    setShowAppoint(false);
    setShowRefer(false);
    setRescheduledData({});
    setRescheduledStatus(false);
    removeBodyCss();
  };

  const fetchUserDoctors = async () => {
    const response = await axiosInstance.get(
      `accounts/users/${user.id}/get_user_doctors/`
    );
    setUserDoctors(response.data);
    console.log("UserDoctors: ", response.data);
  };

  const fetchNewDoctors = async (arg, arg1, setSearchResponse) => {
    const response = await axiosInstance.get(
      `accounts/doctors/?board_certified_speciality=${arg}&state=${arg1}&accepting_new_patients=true`
      // accounts/doctors/?board_certified_speciality=Psychiatry&state=New%20York&accepting_new_patients=true
      // accounts/doctors/?board_certified_speciality=${arg}&accepting_new_patients=true
    );
    setNewDoctors(response.data);
    if (response.data.length === 0 && typeof setSearchResponse === "function") {
      setSearchResponse(
        `Currently we are interviewing Providers in ${arg1}${arg && ` that specialize in ${arg}`
        }.`
      );
    }
    console.log("NewDoctors: ", response.data);
  };

  const fetchEvents = async () => {
    const response = await axiosInstance.get(
      // `accounts/appointments/${user.id}/`
      `accounts/appointments/?doctor=${user.doctor_id}&patient=${user.patient_id}/`
    );
    const newEvents = response.data.map((item) => ({
      title: `${item.doctor.first_name} ${item.doctor.last_name}`,
      time: new Date(item.date * 1000),
      allDay: false,
      start: new Date(item.date * 1000),
      end: new Date(item.date * 1000),
    }));
    setEvents(newEvents);
    console.log("Appointments of Patient: ", response.data);
  };

  const fetchAvailableDoctors = async () => {
    const response = await axiosInstance.get(
      `accounts/doctors/?accepting_new_patients=true`
    );
    setAvailableDoctors(response.data);
    console.log("Accepting Doctors: ", response.data);
  };

  const receiveCalData = (createNewEvent) => {
    console.log("New Event data:", createNewEvent);
    setEvents((prev) => {
      return [...prev, createNewEvent];
    });
  };

  // const fetchEvents = async () => {
  //   const response = await axiosInstance.get(
  //     `accounts/appointments/${user.id}&${currentDate}`
  //   );
  //   setEvents(response.data);
  //   console.log(response.data);

  // };

  useEffect(() => {
    const parsed = qs.parse(location.search);

    if (parsed?.from && parsed?.from === "dashboard") {
      setShowResch(true);
    }
  }, []);

  useEffect(() => {
    fetchNewDoctors();
    fetchAvailableDoctors();
    fetchUserDoctors();
    fetchEvents();
  }, []);

  useEffect(() => {
    axiosInstance
      .get(`accounts/patients/${user.patient_id}/`)
      .then((response) => {
        setSubscriptionType(response?.data?.subscription_type.toLowerCase());
      });
  }, []);

  const rescheduleEvent = (event) => {
    event.is_rescheduled = true;
    setRescheduledData(event);
    setRescheduledStatus(true);
    setModalState(false);
    setShowResch(true);
    console.log(event, "reschedule selected event payload");
  };

  const cancelEvent = (event) => {
    event.is_cancelled = true;
    setNestedModalState(false);
    setModalState(false);
    console.log(event, "cancelled selected event payload");
  };

  const Modal = () => {
    return (
      <ModalBootstrap
        size="lg"
        centered
        style={{ maxWidth: "350px", width: "50%" }}
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
              <h4>{selectedEvent != undefined && selectedEvent.title}</h4>
              <Label className="form-label">{selectedEvent.time}</Label>
            </Col>
          </Row>
          <Row>
            <Col className="col-12 mb-3">
              <div>
                <button
                  type="button"
                  className="btn me-2 mb-3 startBtns"
                  onClick={() => {
                    window.open("/session-meeting");
                  }}
                  style={{
                    borderRadius: 10,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                >
                  Join Session
                </button>

                <button
                  type="button"
                  className="btn me-2 mb-3 cancelBtn"
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
    console.log("event", event);
    setSelectedEvent(event);
    setModalState(true);
  };

  const { userContext } = useContext(SubscriptionContext);

  const checkIdentityToRender = () => {
    if (userContext.is_subscribed === false) {
      return true;
    };

    if (userContext.is_identified === false) {
      return true;
    };

    return false;
  };

  return (
    <section>
      <Sidebar active="Appointment" />
      <div className="main-content">
        <Header />
        <main className="patient-dash">
          <Container fluid={true}>

            {userContext.is_identified ? (
              <>
                {userContext.is_subscribed ? null : (
                  <div className="float-box">
                    <h3>
                      This feature can only be available to subscribed users. Would
                      you like to upgrade?{" "}
                      <a
                        href="#"
                        onClick={() => {
                          tog_scroll();
                        }}
                      >
                        Yes
                      </a>
                    </h3>
                    <CheckoutModal
                      setSubscribemodal={() => setSubscribemodal(!subscribemodal)}
                      subscribemodal={subscribemodal}
                    />
                  </div>
                )}
              </>
            ) : (
              <NewUserRequirement
                requiredInformation={requiredInformation}
              />
            )}


            <Row
              style={{
                filter: userContext.is_subscribed === false || userContext.is_identified === false ? "blur(2px)" : null,
              }}
            >
              <Col sm={8}>
                <CardBody>
                  <div className="row cal">
                    {selectedEvent && <Modal />}
                    <Calendar
                      popup={userContext.is_subscribed}
                      components={{
                        toolbar: MyCustomHeader,
                        // month: { dateHeader: MyMonthDateHeader },
                      }}
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      style={{
                        width: "100%",
                        height: 500,
                        margin: "10px",
                        maxHeight: 500,
                      }}
                      onSelectEvent={(e) => handleSelectedEvent(e)}
                      disabled={checkIdentityToRender()}
                    />
                  </div>
                </CardBody>
              </Col>
              <Col
                sm={4}
                style={{
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30,
                  maxHeight: 500,
                }}
              >
                <div className="mb-2">
                  <Button
                    className="btn waves-effect waves-light"
                    onClick={() => {
                      if (subscriptionType === "pay-on-use") {
                        return history.push("/patient-checkout");
                      }

                      onClickA();
                    }}
                    style={{
                      backgroundColor: "#059c67",
                    }}
                    disabled={checkIdentityToRender()}
                  >
                    Appointment Form
                  </Button>
                  <ModalBootstrap
                    isOpen={showAppoint}
                    toggle={() => {
                      onClickA();
                    }}
                    centered
                    size="lg"
                  >
                    <AppointmentForm
                      userDoctors={userDoctors}
                      provider={provider}
                      setProvider={setProvider}
                      receiveCalData={receiveCalData}
                      user={user}
                      onClose={() => setShowAppoint(false)}
                    />
                  </ModalBootstrap>
                </div>
                <div className="mb-2">
                  <Button
                    className="btn waves-effect"
                    onClick={onClickR}
                    style={{
                      backgroundColor: "#ab8c91",
                    }}
                    disabled={checkIdentityToRender()}
                  >
                    Consult Request Form
                  </Button>

                  <ModalBootstrap
                    isOpen={showRefer}
                    toggle={() => {
                      onClickR();
                    }}
                    centered
                    size="lg"
                  >
                    <ConsultForm
                      // doctorsBySpecial={doctorsBySpecial}
                      // setDoctorsBySpecial={doctorsBySpecial}
                      availableDoctors={availableDoctors}
                      // setAvailableDoctors={setAvailableDoctors}
                      user={user}
                      onClose={() => setShowRefer(false)}
                    />
                  </ModalBootstrap>
                </div>
                <div className="mb-2">
                  <Button
                    className="btn waves-effect waves-light"
                    onClick={onClickRe}
                    style={{
                      backgroundColor: "#03442d",
                    }}
                    disabled={checkIdentityToRender()}
                  >
                    Reschedule Form
                  </Button>

                  <ModalBootstrap
                    isOpen={showResch}
                    toggle={() => {
                      onClickRe();
                    }}
                    centered
                    size="lg"
                  >
                    <PaRescheduleForm
                      userDoctors={userDoctors}
                      provider={provider}
                      setProvider={setProvider}
                      receiveCalData={receiveCalData}
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
                </div>
                <div className="OHours">
                  <PatientDoctorInfo
                    fetchNewDoctors={fetchNewDoctors}
                    newDoctors={newDoctors}
                    toggle={() => {
                      onClickR();
                    }}
                    checkIdentityToRender={checkIdentityToRender()}
                  />
                </div>
              </Col>
              <RecordedAppointmentsPA />
            </Row>
          </Container>
        </main>
      </div>
    </section>
  );
}

export default PatientAppointments;
