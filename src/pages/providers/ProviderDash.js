import Sidebar from "../../components/providers/ProvSidebar";
import Header from "../../components/providers/HeaderProv";
import DashboardCards from "../../components/providers/DashboardCardsProv";
import AppointmentsBox from "../../components/providers/AppointmentBoxProv";
import ConsultRequestsBox from "../../components/providers/ConsultRequestsBox";
import ConsultDetails from "../../components/providers/DetailsConsult";
import axiosInstance from "../../api/TelePsyAPI";
import { useState, useEffect, useContext } from "react";
import { SubscriptionContext } from "../../helpers/subscriptionContext";
import moment from "moment-timezone";
import IsApprovedMessage from "../../components/IsApprovedMessage";
import IsPartnerMessage from "../../components/IsPartnerMessage";

// temporary images
// import jaseMurph from "../../Images/20210313_102602.jpg";
// import AliceMackey from "../../Images/Profile Pic.jpg";
// import telePsycRxIcon from "../../Images/TelePsycRXicon.jpg";
// import JamieDoe from "../../Images/Screenshot 2021-06-20 142408.jpg";

// temporary images
// import jaseMurph from "../../Images/20210313_102602.jpg";
// import AliceMackey from "../../Images/Profile Pic.jpg";
// import telePsycRxIcon from "../../Images/TelePsycRXicon.jpg";
// import JamieDoe from "../../Images/Screenshot 2021-06-20 142408.jpg";

function providerDash(props) {
  const [showDetails, setShowDetails] = useState(false);
  const [consultRequest, setConsultRequest] = useState();
  const [referralRequest, setReferralRequest] = useState();
  const onClickDe = (selectedConsult, selectedReferral) => {
    setShowDetails(!showDetails);
    setConsultRequest(selectedConsult);
    setReferralRequest(selectedReferral);
  };
  const [consultRequests, setConsultRequests] = useState(false);
  const [referralRequests, setReferralRequests] = useState(false);
  const [todaysAppointments, setTodaysAppointments] = useState(false);

  // const [user] = useState(JSON.parse(localStorage.getItem("user")));
  // const [referrals, setReferrals] = useState([]);

  
const getTodaysAppointments = async () => {
    const response = await axiosInstance.get(`accounts/appointments/`);
    const filteredAppointments = response.data.filter((item) =>
      moment(item.date).isSame(moment(), "day")
    );
    setTodaysAppointments(filteredAppointments); /*response.data.filter()*/
  };
  console.log("Today's Appointments: ", todaysAppointments);
  
  const getConsultReqs = async () => {
    const response = await axiosInstance.get(`accounts/consult_requests/`);
    // console.log(response, 'response on consult req here')
    setConsultRequests(
      response.data.filter((item) => !item.is_accepted && !item.is_referred)
    );
  };
  console.log("Consult Requests: ", consultRequests);
  console.log("Consult Request: ", consultRequest);

  const getReferralReqs = async () => {
    const response = await axiosInstance.get(`accounts/referral_requests/`);
    setReferralRequests(
      response.data.filter((item) => item.status === "Pending")
    );
  };
  const fetchRequests = () => {
    getConsultReqs();
    getReferralReqs();
  };

  console.log("Referral Requests: ", referralRequests);
  console.log("Referral Request: ", referralRequest);

  useEffect(() => {
    getConsultReqs();
    getReferralReqs();
    getTodaysAppointments();
  }, []);

  const { userContext } = useContext(SubscriptionContext);

  return (
    <section>
      <Sidebar />
      <div className="main-content">
        <Header />
        {userContext?.is_approved === true ? null : <IsApprovedMessage />}
        {userContext?.is_approved === false ? null : (
          <>
            {userContext?.is_partner_account === false ? null : (
              <IsPartnerMessage />
            )}
          </>
        )}
        <main
          className="provider-dash"
          style={{
            filter:
              userContext?.is_partner_account === true
                ? "blur(2px)"
                : userContext?.is_approved === true
                ? null
                : "blur(2px)",
          }}
        >
          <DashboardCards
            is_approved={userContext?.is_approved}
            is_partner={userContext?.is_partner_account}
          />
          <div className="recent-grid">
            <div class="table-responsive">
              <AppointmentsBox
                is_approved={userContext?.is_approved}
                is_partner={userContext?.is_partner_account}
                todaysAppointments={todaysAppointments}
              />
            </div>
            {showDetails ? (
              <ConsultDetails
                onClickDe={onClickDe}
                consultRequest={consultRequest}
                referralRequest={referralRequest}
                is_approved={userContext?.is_approved}
                is_partner={userContext?.is_partner_account}
              />
            ) : null}

            <ConsultRequestsBox
              onClickDe={onClickDe}
              setShowDetails={setShowDetails}
              consultRequests={consultRequests}
              setConsultRequests={setConsultRequests}
              fetchRequests={fetchRequests}
              is_approved={userContext?.is_approved}
              is_partner={userContext?.is_partner_account}
              referralRequests={referralRequests}
              setReferralRequests={setReferralRequests}
            />
          </div>
        </main>
      </div>
    </section>
  );
}

export default providerDash;
