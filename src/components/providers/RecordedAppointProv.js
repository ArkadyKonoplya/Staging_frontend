import React from "react";

function RecordedAppointmentsProv(isApproved) {
  const [recordedAppointments, setRecordedAppointments] = React.useState([
    {
      patientName: "No Recorded Appointments Available",
      date: "01/05/2022",
      time: "9:00 am",
      duration: "Full",
    },
    {
      patientName: "Mandy McDoon",
      date: "01/05/2022",
      time: "10:00 am",
      duration: "Half",
    },
    {
      patientName: "Logan Batton",
      date: "01/05/2022",
      time: "10:30 am",
      duration: "Half",
    },
    {
      patientName: "Nicole Mesa",
      date: "01/05/2022",
      time: "11:00 am",
      duration: "Full",
    },
    {
      patientName: "Bob Jamison",
      date: "01/05/2022",
      time: "1:00 pm",
      duration: "Double",
    },
    {
      patientName: "Joshua Bugsall",
      date: "01/07/2022",
      time: "3:00 pm",
      duration: "Full",
    },
    {
      patientName: "April Brockshaw",
      date: "01/07/2022",
      time: "4:00 pm",
      duration: "Double",
    },
  ]);
  return (
    <div className="appointments">
      <div className="Card">
        <div className="card-header">
          <h2>Recorded Appointments</h2>
          <button>
            List All<span className="las la-arrow-right"></span>
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table width="100%">
              <thead>
                <tr>
                  <td>Patient Name</td>
                  <td>Date</td>
                  <td>Time</td>
                  <td>Recording</td>
                  <td>Duration</td>
                </tr>
              </thead>
              <tbody>
                {recordedAppointments.map((appointment, i) => {
                  const { patientName, date, time, duration } = appointment;
                  return (
                    <tr key={i}>
                      <td>{patientName}</td>
                      <td>{date}</td>
                      <td>{time}</td>
                      <td>
                        <a className="las la-video"></a>
                      </td>
                      <td>
                        <span
                          className={`status ${
                            duration === "Full"
                              ? "pink"
                              : duration === "Half"
                              ? "blue"
                              : duration === "pending"
                              ? "orange"
                              : "purple"
                          }`}
                        ></span>
                        {duration}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordedAppointmentsProv;
