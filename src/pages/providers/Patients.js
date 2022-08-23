import { Col, Row } from "reactstrap";
import Sidebar from "../../components/providers/ProvSidebar";
import Header from "../../components/providers/HeaderProv";
import RecordDisplayCard from "../../components/providers/RecordDisplayCard";
import PrescriptionDisplayCard from "../../components/providers/PrescriptionDisplayCard";
import axiosInstance from "../../api/TelePsyAPI";
import { useState, useEffect, useContext } from "react";
import PatientRecordProfile from "../../components/providers/PatientRecordProfile";
import { SubscriptionContext } from "../../helpers/subscriptionContext";
import IsApprovedMessage from "../../components/IsApprovedMessage";

function Patients() {
  const [doctorPatients, setDoctorPatients] = useState([]);
  const [doctorPatient, setDoctorPatient] = useState({});
  const [loadPatientInfo, setLoadPatientInfo] = useState(false);
  const [showPatient, setShowPatient] = useState(false);
  const [patient, setPatient] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [isLoading, setIsLoading] = useState(true);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [showNewPrescriptionModal, setShowNewPrescriptionModal] =
    useState(false);
  const [productList, setProductList] = useState([]);

  const fetchDoctorPatients = async () => {
    const response = await axiosInstance.get(
      `accounts/users/${user.id}/get_doctor_patients/`
    );

    const doctorsPatientsDataToArray = Object.keys(response.data).map(
      (key) => response.data[key]
    );
    console.log(doctorsPatientsDataToArray, "doctorsPatientsDataToArray >>>");
    setDoctorPatients(doctorsPatientsDataToArray);
    setIsLoading(false);
  };

  // const fetchArchivedNotes = async () => {
  //   const response = await axiosInstance.get(`accounts/users/${user.id}/`);
  //   setArchivedNotes(response.data);
  // };
  // console.log(archivedNotes, "DOC USER OBJ");

  useEffect(() => {
    fetchDoctorPatients();
    // fetchArchivedNotes();
  }, []);

  const handleAdd = (product, quantity, dosage) => {
    productList.push({ id: productList.length + 1, product, quantity, dosage });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { userContext } = useContext(SubscriptionContext);

  return (
    <section>
      <Sidebar />
      <div className="main-content">
        <Header />

        {userContext?.is_approved === true ? null : <IsApprovedMessage />}

        <main
          className="provider-dash"
          style={{
            filter: userContext?.is_approved === true ? null : "blur(2px)",
          }}
        >
          <div className="providerPatient">
            <h1 className="currentPatRecH1">Current Patient Records</h1>
            <Row>
              <Col lg="12">
                <select
                  name="patient"
                  onChange={(e) => {
                    setLoadPatientInfo(true);
                    setDoctorPatient({});

                    doctorPatients.forEach((pat) => {
                      if (parseFloat(pat.id) === parseFloat(e.target.value)) {
                        setDoctorPatient(pat);
                        setLoadPatientInfo(false);
                      }
                    });

                    setPatient(parseInt(e.target.value));

                    e.target.value === "Select Patient"
                      ? setShowPatient(false)
                      : setShowPatient(true);
                  }}
                  className="patientProfileSelect"
                  placeholder="Select Patient"
                >
                  <option disabled={!userContext?.is_approved}>
                    Select Patient
                  </option>
                  {doctorPatients.map((doctorPa) => (
                    <option
                      disabled={!userContext?.is_approved}
                      key={doctorPa.id}
                      value={doctorPa.id}
                    >
                      {doctorPa.first_name} {doctorPa.last_name}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>
          </div>
          {showPatient ? (
            <Row>
              <Col lg="5" style={{ paddingBottom: "8px" }}>
                {loadPatientInfo ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <RecordDisplayCard
                      doctorPatient={doctorPatient}
                      archivedNotes={archivedNotes}
                      setArchivedNotes={setArchivedNotes}
                      userJournalEntries={doctorPatient.provider_patient_notes}
                    />
                    <br />
                    {/* List of Prescriptions from the doctor to the patient */}
                    <PrescriptionDisplayCard productList={productList} />
                  </>
                )}
              </Col>
              <Col lg="7" style={{ paddingBottom: "8px" }}>
                <PatientRecordProfile
                  patient={
                    doctorPatients.find((item) => item.id === patient) || {}
                  }
                  profileUpdate={false}
                  showNewPrescriptionModal={showNewPrescriptionModal}
                  setShowNewPrescriptionModal={() =>
                    setShowNewPrescriptionModal(!showNewPrescriptionModal)
                  }
                  productList={productList}
                  setProductList={setProductList}
                  handleAdd={handleAdd}
                />
              </Col>
            </Row>
          ) : (
            <h3 className="currentPatRecH1">
              <i>No Patient Data Selected</i>
            </h3>
          )}

          <div className="recent-grid">
            <div class="table-responsive"></div>
          </div>
        </main>
      </div>
    </section>
  );
}

export default Patients;
