
import telePsycRxIcon from "../../Images/TelePsycRXicon.jpg";


function ProviderAssign(props) {
  return (
    <div className="consult-reqs">
      <div className="Card">
        <div className="card-header">
          <h3>Requested Provider Assignments</h3>
        </div>
        <div className="card-body">
          {props.items.map((item, i) => (
            <div className="newConsult">
              <div className="info">
                <img
                  src={telePsycRxIcon}
                  height="40px"
                  width="40px"
                  alt="patient"
                ></img>
                <div>
                  <h4>Multi-Response</h4>
                  <small>{item.file_subject}</small>
                </div>
              </div>
              <div className="contact">
                <a
                  href={item.file}
                  target="_blank"
                  className="las la-download refer"
                ></a>
                {/* <span className="las la-download refer"></span> */}
                <span className="las la-times-circle reject"></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProviderAssign;
