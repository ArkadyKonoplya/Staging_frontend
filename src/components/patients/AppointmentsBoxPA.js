import React, { useState } from "react";
import {
  Button,
  Modal as ModalBootstrap,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import * as qs from "query-string";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import { useHistory } from "react-router-dom";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import CheckoutModal from "../CheckoutModal";
import moment from "moment-timezone";

const AppointmentsBoxPA = ({ subscribed, todaysAppointments }) => {
  const [subscribemodal, setSubscribemodal] = useState(false);
  const [nestedModalState, setNestedModalState] = useState(false);
  const [appointment, setAppointment] = useState({});

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const tog_scroll = () => {
    setSubscribemodal(!subscribemodal);
    removeBodyCss();
  };

  const history = useHistory();
  const rescheduleAppointment = (appointment) => {
    appointment.is_rescheduled = true;
    console.log(appointment, "reschedule selected appointment payload");
    // appointment ID is not in this table
    history.push(
      `/patient-appointments?from=dashboard&${qs.stringify(appointment)}`
    );
  };

  const cancelAppointment = () => {
    appointment.is_cancelled = true;
    console.log(appointment, "cancelled selected appointment payload");
    setNestedModalState(false);
  };

  return (
    <div className="appointments">
      <div className="Card">
        <div className="card-header">
          <h2>Today's Appointments</h2>
          {/* <button>
            Cancel / Reschedule<span className="las la-arrow-right"></span>
          </button> */}
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table width="100%">
              <thead>
                <tr>
                  <td>Provider Name</td>
                  <td>Time</td>
                  {/* <td>Join</td> */}
                  <td>Status</td>
                  <td>Menu</td>
                </tr>
              </thead>
              {subscribed && (
                <>
                  <tbody>
                    {!todaysAppointments ? (
                      <tr>
                        <td colSpan={4}>loading</td>
                      </tr>
                    ) : (
                      todaysAppointments.map((value, i) => {
                        console.log("VALUE: ", value);
                        const { doctor, date, status } = value;
                        const providerName = `${doctor.first_name} ${doctor.last_name}`;
                        const appointmentTime = moment(date).format("LT");
                        return (
                          <tr key={value.id}>
                            <td>{providerName}</td>
                            <td>{appointmentTime}</td>
                            {/* <td>
                            <a className="las la-video"></a>
                          </td> */}
                            <td>
                              <span
                                className={`status ${
                                  status === "Full"
                                    ? "pink"
                                    : status === "Half"
                                    ? "blue"
                                    : status === "pending"
                                    ? "orange"
                                    : "purple"
                                }`}
                              ></span>
                              {status}
                            </td>
                            <td>
                              <Menu
                                menuButton={
                                  <div className="more-button">
                                    <button>More</button>
                                  </div>
                                }
                                transition
                              >
                                <MenuItem
                                  onClick={() => {
                                    setAppointment(value);
                                    setNestedModalState(true);
                                  }}
                                >
                                  Cancel
                                </MenuItem>
                                <MenuItem
                                  onClick={() => rescheduleAppointment(value)}
                                >
                                  Reschedule
                                </MenuItem>
                                <MenuItem>Join Appointment</MenuItem>
                              </Menu>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </>
              )}
            </table>
            {!subscribed && (
              <>
                <br />
                <h4
                  style={{
                    textAlign: "center",
                  }}
                >
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
                </h4>
                <CheckoutModal
                  setSubscribemodal={() => setSubscribemodal(!subscribemodal)}
                  subscribemodal={subscribemodal}
                />
              </>
            )}

            <ModalBootstrap centered isOpen={nestedModalState}>
              <ModalBody>
                Are you sure you would like to cancel this appointment?
              </ModalBody>
              <ModalFooter>
                <Button color="success" onClick={() => cancelAppointment()}>
                  Yes
                </Button>{" "}
                <Button
                  color="danger"
                  onClick={() => setNestedModalState(false)}
                >
                  No
                </Button>
              </ModalFooter>
            </ModalBootstrap>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsBoxPA;
