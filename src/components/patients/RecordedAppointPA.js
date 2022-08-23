import React from "react";

function RecordedAppointmentsPA() {
  const [recordedAppointments, setRecordedAppointments] = React.useState([
    // {
    //   providerName: "No Recorded Appointments Available",
    //   date: "01/05/2022",
    //   time: "9:00 am",
    //   duration: "Full",
    // },
    {
      providerName: "Mandy McDoon",
      date: "06/15/2022",
      time: "10:00 am",
      duration: "Half",
    },
    {
      providerName: "Logan Batton",
      date: "06/13/2022",
      time: "10:30 am",
      duration: "Half",
    },
    {
      providerName: "Nicole Mesa",
      date: "06/10/2022",
      time: "11:00 am",
      duration: "Full",
    },
    // {
    //   providerName: "Bob Jamison",
    //   date: "06/08/2022",
    //   time: "1:00 pm",
    //   duration: "Double",
    // },
    // {
    //   providerName: "Joshua Bugsall",
    //   date: "06/13/2022",
    //   time: "3:00 pm",
    //   duration: "Full",
    // },
    // {
    //   providerName: "April Brockshaw",
    //   date: "06/13/2022",
    //   time: "4:00 pm",
    //   duration: "Double",
    // },
  ]);
  return (
    <div className="appointments">
      <div className="Card">
        <div className="card-header">
          <h2>Recorded Appointments</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table width="100%">
              <thead>
                <tr>
                  <td>Provider Name</td>
                  <td>Date</td>
                  <td>Time</td>
                  <td>Recording</td>
                  <td>Duration</td>
                </tr>
              </thead>
              <tbody>
                {recordedAppointments.map((value, i) => {
                  const { providerName, date, time, duration } = value;
                  return (
                    <tr key={i}>
                      <td>{providerName}</td>
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

export default RecordedAppointmentsPA;
