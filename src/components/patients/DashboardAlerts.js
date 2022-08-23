import telePsycRxIcon from "../../Images/TelePsycRXicon.jpg";
function DashboardAlerts(props) {
  return (
    <div className="consult-reqs">
      <div className="Card">
        <div className="card-header">
          <h3>Requested Action</h3>
        </div>
        <div className="card-body">
          {props.items.map((item, i) => (
            <div className="newConsult" key={item.file}>
              <div className="info">
                <img
                  src={item.uploaded_by_image || telePsycRxIcon}
                  // src={item.profile_image}
                  height="40px"
                  width="40px"
                  alt="colleague"
                ></img>
                <div>
                  {/* <h4>{item.name}</h4> */}
                  <h4>{item.uploaded_by_name || "TelePsycRX"}</h4>
                  <small>{item.file_subject}</small>
                </div>
              </div>
              <div className="contact">
                <a
                  //TODO:   BELOW: will be the onClick that will download the document/image
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

export default DashboardAlerts;
