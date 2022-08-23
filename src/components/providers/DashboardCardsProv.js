import { useHistory } from "react-router-dom";

function DashboardCardsProv({ is_approved, is_partner }) {
  const history = useHistory();

  const handleRouteA = () => {
    history.push("/provider-appointments");
  };
  const handleRoutePat = () => {
    history.push("/provider-patients");
  };
  const handleRouteNotes = () => {
    history.push("/provider-notes");
  };
  const handleRouteDocs = () => {
    history.push("/provider-documents");
  };

  return (
    <div className="cards">
      <div
        onClick={is_partner ? null : is_approved ? handleRoutePat : null}
        className="card-single"
      >
        <h2></h2>
        <span>Patients</span>
        <div>
          <span className="las la-users"></span>
        </div>
      </div>

      <div
        onClick={is_partner ? null : is_approved ? handleRouteA : null}
        className="card-single"
      >
        <h2></h2>
        <span>Appointments</span>

        <div>
          <span className="las la-calendar-check"></span>
        </div>
      </div>

      <div
        onClick={is_partner ? null : is_approved ? handleRouteNotes : null}
        className="card-single"
      >
        <h2></h2>
        <span>Notes</span>
        <div>
          <span className="las la-notes-medical"></span>
        </div>
      </div>

      <div
        onClick={is_partner ? null : is_approved ? handleRouteDocs : null}
        className="card-single"
      >
        <h2></h2>
        <span>Documents</span>
        <div>
          <span className="las la-file-alt"></span>
        </div>
      </div>
    </div>
  );
}

export default DashboardCardsProv;
