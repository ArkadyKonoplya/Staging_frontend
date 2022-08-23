import { useEffect, useState } from "react";
import ProfileBoxPA from "../../components/patients/ProfileBoxPA";
import HealthQuestionnaire from "../../components/patients/HealthQuestionnaire";
import Sidebar from "../../components/patients/SidebarPatient";
import Header from "../../components/patients/HeaderPatient";

// import ConsultRequestsBox from "../components/ConsultRequestsBox"

function PatientProfile() {
  const [profileUpdate, setProfileUpdate] = useState(false);
  return (
    <section>
      <Sidebar active="Profile" />
      <div className="main-content">
        <Header imageUpdate={profileUpdate} />
        <main className="patient-dash">
          <div className="table-responsive">
            <HealthQuestionnaire
              profileUpdate={profileUpdate}
              setProfileUpdate={setProfileUpdate}
            />
          </div>
        </main>
      </div>
    </section>
  );
}

export default PatientProfile;
