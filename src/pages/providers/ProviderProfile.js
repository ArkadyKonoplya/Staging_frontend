// import ProfileBox from '../../components/providers/ProvProfileBox'
import { useEffect, useState } from "react";
import ProvQuestionnaire from "../../components/providers/ProvQuestionnaire";
import Sidebar from "../../components/providers/ProvSidebar";
import Header from "../../components/providers/HeaderProv";

// import ConsultRequestsBox from "../components/ConsultRequestsBox"

function ProviderProfile() {
  const [profile, setProfile] = useState({

  });

  return (
    <section>
      <Sidebar />
      <div className="main-content">
        <Header imageUpdate={profile} />
        <main className="provider-dash">
          <div className="table-responsive">
            <ProvQuestionnaire
              profile={profile}
              setProfile={setProfile}
            />
          </div>
        </main>
      </div>
    </section>
  );
}

export default ProviderProfile;
