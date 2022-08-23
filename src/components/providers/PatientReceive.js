import jaseMurph from "../../Images/20210313_102602.jpg";
import AliceMackey from "../../Images/Profile Pic.jpg";
import telePsycRxIcon from "../../Images/TelePsycRXicon.jpg";
import JamieDoe from "../../Images/Screenshot 2021-06-20 142408.jpg";

function PatientReceive({ isApproved, patientResponses }) {
  return (
    <div className="consult-reqs">
      <div className="Card">
        <div className="card-header">
          <h3>Patient Resource Response</h3>
        </div>
        <div className="card-body">
          {patientResponses.map((response) => (
            <div key={response.id} className="newConsult">
              <div className="info">
                <img
                  src={response.uploaded_by_image}
                  height="40px"
                  width="40px"
                  alt="patient"
                ></img>
                <div>
                  <h4>{response.uploaded_by_name}</h4>
                  <small>{response.file_subject}</small>
                </div>
              </div>
              <div className="contact">
                <a
                  href={response.file}
                  target="_blank"
                  className="las la-download refer"
                ></a>
                <span className="las la-times-circle reject"></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientReceive;
