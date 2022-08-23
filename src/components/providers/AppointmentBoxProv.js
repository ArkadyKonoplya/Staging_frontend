import React, { useState } from "react";
import {
  Button,
  Modal as ModalBootstrap,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import moment from "moment-timezone";
import * as qs from "query-string";
import { useHistory } from "react-router-dom";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

function AppointmentsBoxProv({ is_approved, is_partner, todaysAppointments }) {
  const [nestedModalState, setNestedModalState] = useState(false);
  const [appointment, setAppointment] = useState({});
  const history = useHistory();
  const rescheduleAppointment = (appointment) => {
    appointment.is_rescheduled = true;
    console.log(appointment, "reschedule selected appointment payload");
    history.push(
      `/provider-appointments?from=dashboard&first_name=${
        appointment.patient.first_name
      }&last_name=${appointment.patient.last_name}&${qs.stringify(appointment)}`
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
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table width="100%">
              <thead>
                <tr>
                  <td>Patient Name</td>
                  <td>Time</td>
                  {/* <td>Appointments to Start</td> */}
                  <td>Status</td>
                  <td>Menu</td>
                </tr>
              </thead>
              {is_approved === false ? null : (
                <tbody>
                  {!todaysAppointments ? (
                    <tr>
                      <td colSpan={4}>loading</td>
                    </tr>
                  ) : (
                    todaysAppointments.map((value, i) => {
                      const { patient, date, status, statusColor } = value;
                      const patientName = `${patient.first_name} ${patient.last_name}`;
                      const appointmentTime = moment(date).format("LT");
                      return (
                        <tr key={value.id}>
                          <td>{patientName}</td>
                          <td>{appointmentTime}</td>
                          {/* <td>
                              <button
                                disabled={!is_approved}
                                onClick={() => {
                                  is_partner
                                    ? null
                                    : is_approved
                                    ?
                                      window.open(
                                        "https://zoom.us/s/92022736091?zak=eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMSIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6IjhoLUw5enoxVGpxMHljN1lRa1A3VkEiLCJpc3MiOiJ3ZWIiLCJzayI6IjAiLCJzdHkiOjk5LCJ3Y2QiOiJhdzEiLCJjbHQiOjAsIm1udW0iOiI5MjAyMjczNjA5MSIsImV4cCI6MTY1OTQ1OTkzNywiaWF0IjoxNjUxNjgzOTM3LCJhaWQiOiJqRTM3UUpWZFJEQ3kwd21qQjhQX0p3IiwiY2lkIjoiIn0.ZxLdbCV-FT7vIimiAGi68UpjYRM8vW5qSuNbrvVhW10"
                                      )
                                    : null;
                                }}
                                className="srtClosBtns calBtns"
                              >
                                Start Session
                              </button>
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
                                  <button>
                                    More
                                    <span className="las la-arrow-right"></span>
                                  </button>
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
                              <MenuItem
                                disabled={!is_approved}
                                onClick={() => {
                                  is_partner
                                    ? null
                                    : is_approved
                                    ? window.open(
                                        "https://zoom.us/s/92022736091?zak=eyJ0eXAiOiJKV1QiLCJzdiI6IjAwMDAwMSIsInptX3NrbSI6InptX28ybSIsImFsZyI6IkhTMjU2In0.eyJhdWQiOiJjbGllbnRzbSIsInVpZCI6IjhoLUw5enoxVGpxMHljN1lRa1A3VkEiLCJpc3MiOiJ3ZWIiLCJzayI6IjAiLCJzdHkiOjk5LCJ3Y2QiOiJhdzEiLCJjbHQiOjAsIm1udW0iOiI5MjAyMjczNjA5MSIsImV4cCI6MTY1OTQ1OTkzNywiaWF0IjoxNjUxNjgzOTM3LCJhaWQiOiJqRTM3UUpWZFJEQ3kwd21qQjhQX0p3IiwiY2lkIjoiIn0.ZxLdbCV-FT7vIimiAGi68UpjYRM8vW5qSuNbrvVhW10"
                                      )
                                    : null;
                                }}
                              >
                                Start Session
                              </MenuItem>
                            </Menu>
                          </td>
                        </tr>
                      );
                    })
                  )}
                  {todaysAppointments.length === 0 ? (
                    <h5 className="current-PatRecH1">No Appointments Today.</h5>
                  ) : null}
                </tbody>
              )}
            </table>
            {is_approved === false ? (
              <>
                <br />
                <h4
                  style={{
                    textAlign: "center",
                  }}
                >
                  This feature can only be available to approved users.{" "}
                </h4>
              </>
            ) : null}

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
}

export default AppointmentsBoxProv;
