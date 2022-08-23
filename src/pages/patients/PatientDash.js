import Sidebar from "../../components/patients/SidebarPatient";
import Header from "../../components/patients/HeaderPatient";
import NewUserRequirement from "../../components/patients/NewUserRequirementModal";
import DashboardCardsPA from "../../components/patients/DashboardCardsPA";
import AppointmentsBoxPA from "../../components/patients/AppointmentsBoxPA";
import DashboardAlerts from "../../components/patients/DashboardAlerts";
import axiosInstance from "../../api/TelePsyAPI";
import { SubscriptionContext } from "../../helpers/subscriptionContext";
import { requiredInformation } from "../../helpers";
import React, { useState, useContext, useEffect } from "react";
import moment from "moment-timezone";

// temporary images
import jaseMurph from "../../Images/20210313_102602.jpg";
import AliceMackey from "../../Images/Profile Pic.jpg";
import telePsycRxIcon from "../../Images/TelePsycRXicon.jpg";
import JamieDoe from "../../Images/Screenshot 2021-06-20 142408.jpg";

function patientDash() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [telePsycDocReqs, setTelePsycDocReqs] = useState([]);
  const [annoResponse, setAnnoResponse] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todaysAppointments, setTodaysAppointments] = useState(false);

  const getTodaysAppointments = async () => {
    const response = await axiosInstance.get(`accounts/appointments/`);
    const filteredAppointments = response.data.filter((item) =>
      moment(item.date).isSame(moment(), "day")
    );
    setTodaysAppointments(filteredAppointments); /*response.data.filter()*/
  };
  console.log("Today's Appointments: ", todaysAppointments);

  const fetchTelePsycDocReqs = async () => {
    try {
      const response = await axiosInstance.get(
        "accounts/telepsycrx-downloads/"
      );
      setTelePsycDocReqs(response?.data);
      console.log("DOWNLOAD DOCS: ", response.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const fetchDocResources = async () => {
    try {
      const response = await axiosInstance.get(`accounts/comm-res/`);
      // if (checkComponent.unMount) return;
      setResources(response?.data);
      console.log("COMMUN. RESOURCE: ", response.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const fetchDocResponses = async () => {
    try {
      const response = await axiosInstance.get(`accounts/annotated-res/`);
      // if (checkComponent.unMount) return;
      setAnnoResponse(response?.data);
      console.log("ANNOTATED RESPONSE: ", response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error, "error");
    }
  };

  useEffect(() => {
    fetchTelePsycDocReqs();
    fetchDocResources();
    fetchDocResponses();
    getTodaysAppointments();
  }, []);

  // this is where I am pulling in the useContext subscription hook
  const { userContext } = useContext(SubscriptionContext);

  return (
    <section>
      <Sidebar active="Dashboard" />
      <div className="main-content">
        <Header />
        <main className="patient-dash">
          {userContext.is_identified ? null : (
            <NewUserRequirement
              requiredInformation={requiredInformation}
            />
          )}
          <span style={{
            filter: userContext.is_identified ? null : "blur(2px)",
          }}>
            <DashboardCardsPA userIdentity={userContext.is_identified} />
            <div className="recent-grid">
              <div class="table-responsive">
                <AppointmentsBoxPA
                  todaysAppointments={todaysAppointments}
                  subscribed={userContext.is_subscribed}
                />
              </div>
              {/* {showDetails ? (
              <ConsultDetails
                onClickDe={onClickDe}
                setShowDetails={setShowDetails}
                patientDash={true}
              />
            ) : null} */}

              {loading ? (
                <h4>Loading...</h4>
              ) : (
                <DashboardAlerts
                  user={user}
                  items={[...telePsycDocReqs, ...annoResponse, ...resources]}
                />
              )}
            </div>
          </span>
        </main>
      </div>
    </section>
  );
}

export default patientDash;
