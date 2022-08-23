import { Col, Row, Spinner } from "reactstrap";
import Sidebar from "../../components/patients/SidebarPatient";
import Header from "../../components/patients/HeaderPatient";
import { requiredInformation } from "../../helpers";
import NewUserRequirement from "../../components/patients/NewUserRequirementModal";
import axiosInstance from "../../api/TelePsyAPI";
import { SubscriptionContext } from "../../helpers/subscriptionContext";
import { useState, useEffect, useContext } from "react";

import ArchivesDisplayCard from "../../components/patients/ArchivesDisplayCard";

function EntryArchives() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const [userDoctors, setUserDoctors] = useState([]);
  const [doctorPatient, setDoctorPatient] = useState({});
  const [loadPatientInfo, setLoadPatientInfo] = useState(false);
  const [patient, setPatient] = useState("");

  const [userInfo, setUserInfo] = useState([]);
  const [archivedEntries, setArchivedEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPatient, setShowPatient] = useState(false);

  // const downloadPDF = async () => {
  //   const response = await axiosInstance.get(
  //     `personal_journal/pdf/${archivedEntry.id}/`,
  //   {responseType: 'blob'}
  //   ).then((response) => {
  //     window.open(URL.createObjectURL(response.data));
  //   })
  // }

  const fetchUserDoctors = async () => {
    const response = await axiosInstance.get(
      `accounts/users/${user.id}/get_user_doctors/`
    );
    const doctorsDataToArray = Object.keys(response.data).map(
      (key) => response.data[key]
    );
    console.log(doctorsDataToArray, "doctorsDataToArray");
    setUserDoctors(doctorsDataToArray);
  };

  const fetchUserInfo = async () => {
    const response = await axiosInstance
      .get(`accounts/users/${user.id}/`)
      .then((response) => {
        setUserInfo(response.data);
        setIsLoading(false);
        console.log("USER INFO******************** ", response.data);
      });
  };

  const shareJournalEntry = async (id) => {
    // https://stackoverflow.com/questions/31089221/what-is-the-difference-between-put-post-and-patch
    axiosInstance
      .patch(`personal_journal/journal-entries/${id}/`, {
        is_shared_to_provider: true,
      })
      .then((res) => {
        console.log(res);
        console.log("Journal Entry is shared: ", res);
      });
  };

  useEffect(() => {
    fetchUserDoctors();
    fetchUserInfo();
  }, []);

  // https://stackoverflow.com/questions/65147444/fetching-data-and-conditional-rendering-with-react-useeffect
  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log("U.Docs:", userDoctors);

  const { userContext } = useContext(SubscriptionContext);
  return (
    <section>
      <Sidebar active="" />
      <div className="main-content">
        <Header />

        <main className="patient-dash">
          {userContext.is_identified ? null : (
            <NewUserRequirement
              requiredInformation={requiredInformation}
            />
          )}
          <div className="providerPatient">
            <h1 className="currentPatRecH1">My Archives</h1>
            <Row>
              <Col lg="12">
                <select
                  name="patient"
                  onChange={(e) => {
                    setLoadPatientInfo(true);
                    setDoctorPatient({});

                    userDoctors.forEach((pat) => {
                      if (parseFloat(pat.id) === parseFloat(e.target.value)) {
                        setDoctorPatient(pat);
                        setLoadPatientInfo(false);
                      }
                    });

                    setPatient(parseInt(e.target.value));

                    e.target.value === "Select Archive provider"
                      ? setShowPatient(false)
                      : setShowPatient(true);
                  }}
                  className="patientProfileSelect"
                  placeholder="Select Patient"
                >
                  <option value="Select Archive provider">
                    Select Archive provider
                  </option>
                  {userDoctors &&
                    userDoctors.map((doctorPa) => (
                      <option key={doctorPa.id} value={doctorPa.id}>
                        {doctorPa.first_name} {doctorPa.last_name}
                      </option>
                    ))}
                </select>
              </Col>
            </Row>
            {showPatient ? (
              <ArchivesDisplayCard
                archivedEntries={archivedEntries}
                setArchivedEntries={setArchivedEntries}
                userDoctors={userDoctors}
                userDoctor={doctorPatient}
                userJournalEntries={userInfo.journal_entries}
                shareJournalEntry={shareJournalEntry}
                subscribed={userContext.is_subscribed}
              />
            ) : (
              <h3 className="currentPatRecH1">
                No Archive provider Data Selected
              </h3>
            )}
          </div>

        </main>
      </div>
    </section>
  );
}

export default EntryArchives;
