import { useState, useEffect, useContext } from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  Spinner,
} from "reactstrap";
import NoteTaker from "../../components/providers/NoteTaker";
import { SubscriptionContext } from "../../helpers/subscriptionContext";
import NoteDisplayCard from "../../components/providers/NoteDisplayCard";
import Sidebar from "../../components/providers/ProvSidebar";
import Header from "../../components/providers/HeaderProv";
import axiosInstance from "../../api/TelePsyAPI";
import IsApprovedMessage from "../../components/IsApprovedMessage";

function Notes() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [patient, setPatient] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editedNoteID, setEditedNoteID] = useState("");
  const [noteFormH3, setNoteFormH3] = useState("New");
  const [noteFormSubmitButton, setNoteFormSubmitButton] = useState("Save");

  const [doctorPatients, setDoctorPatients] = useState([]);
  const [providerNotes, setProviderNotes] = useState([]);

  const [updateDisplayCard, setUpdateDisplayCard] = useState(false);

  const [selectedArchiveProvider, setSelectedArchiveProvider] = useState("");
  const [openEntry, setOpenEntry] = useState(false);
  const [entryCardData, setEntryCardData] = useState({});

  const fetchDoctorPatients = async () => {
    try {
      const response = await axiosInstance.get(
        `accounts/users/${user.id}/get_doctor_patients/`
      );

      const patientsDataToArray = Object.keys(response.data).map(
        (key) => response.data[key]
      );

      console.log(patientsDataToArray, "response >>>>>");
      setDoctorPatients(patientsDataToArray);
      setIsLoading(false);
    } catch (err) {
      console.log(err, "err");
    }
  };

  // const deleteNote = async (id) => {
  //   const res = await axiosInstance.delete(`notes/provider-notes/${id}/`);
  //   console.log(res);

  //   setProviderNotes(
  //     providerNotes.filter((providerNote) => providerNote.id !== id)
  //   );
  // };

  // EditAutoFill Note Entry
  const editNoteAutoFill = async (noteEntry) => {
    const { patient, note, session_date, session_time, id } = noteEntry;
    setPatient("");
    setNotes("");
    setDate("");
    setTime("");
    setEditedNoteID("");
    setPatient(patient);
    setNotes(note);
    setDate(session_date);
    setTime(session_time);
    setEditedNoteID(id);
    setIsEditing(true);
    setNoteFormSubmitButton("Close");
    setNoteFormH3("Edit");
  };

  const resetFormFields = () => {
    setPatient("");
    setNotes("");
    setDate("");
    setTime("");
    setEditedNoteID("");
    setIsEditing(false);
    setNoteFormH3("New");
  };

  useEffect(() => {
    fetchDoctorPatients();
  }, [updateDisplayCard]);

  const entriesCardView = () => {
    doctorPatients.forEach((element) => {
      if (Number(element.id) === Number(selectedArchiveProvider)) {
        setEntryCardData(element);
        setOpenEntry(true);
      }
    });
  };

  useEffect(() => {
    entriesCardView();
  }, [selectedArchiveProvider]);

  const { userContext } = useContext(SubscriptionContext);

  return (
    <section>
      <Sidebar />
      <div className="main-content">
        <Header />
        {userContext?.is_approved === true ? null : (
         <IsApprovedMessage/>
        )}
        <main
          className="provider-dash"
          style={{
            filter: userContext?.is_approved === true ? null : "blur(2px)",
          }}
        >
          {isLoading ? (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div>
                <Spinner size="lg" className="ms-6" color="success" />
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <Row className="disable-scrollbar-style">
                <Col lg="6">
                  <div
                    class=""
                    style={{
                      marginBottom: 40,
                    }}
                  >
                    <NoteTaker
                      setProviderNotes={setProviderNotes}
                      providerNotes={providerNotes}
                      doctorPatients={doctorPatients}
                      patient={patient}
                      setPatient={setPatient}
                      notes={notes}
                      setNotes={setNotes}
                      date={date}
                      setDate={setDate}
                      time={time}
                      setTime={setTime}
                      setIsEditing={setIsEditing}
                      isEditing={isEditing}
                      setNoteFormH3={setNoteFormH3}
                      noteFormH3={noteFormH3}
                      setNoteFormSubmitButton={setNoteFormSubmitButton}
                      noteFormSubmitButton={noteFormSubmitButton}
                      setEditedNoteID={setEditedNoteID}
                      editedNoteID={editedNoteID}
                      setUpdateDisplayCard={() =>
                        setUpdateDisplayCard(!updateDisplayCard)
                      }
                      resetFormFields={resetFormFields}
                      isApproved={userContext?.is_approved}
                      isPartnerAccount={userContext?.is_partner_account}
                    />
                  </div>
                </Col>

                <Col lg="6" style={{ paddingBottom: "8px" }}>
                  <h3 className="">View Patient Archives</h3>

                  <select
                    id="formrow-duration"
                    className="patientProfileSelect"
                    placeholder="Provider Name"
                    onChange={(e) => {
                      if (e.target.value === "Select Patient") {
                        setSelectedArchiveProvider(e.target.value);
                        return setOpenEntry(false);
                      }
                      setSelectedArchiveProvider(e.target.value);
                    }}
                    name="doctors"
                    value={selectedArchiveProvider}
                  >
                    <option value="Select Patient">Select Patient</option>
                    {Object.entries(doctorPatients).map(([provider, index]) => (
                      <option key={index} value={doctorPatients[provider].id}>
                        {doctorPatients[provider].first_name}{" "}
                        {doctorPatients[provider].last_name}
                      </option>
                    ))}
                  </select>
                  {openEntry === false ? null : (
                    <>
                      <NoteDisplayCard
                        doctorPatient={entryCardData}
                        editNoteAutoFill={editNoteAutoFill}
                        setUpdateDisplayCard={() =>
                          setUpdateDisplayCard(!updateDisplayCard)
                        }
                        resetFormFields={resetFormFields}
                        isApproved={userContext?.is_approved}
                      />
                    </>
                  )}
                </Col>
              </Row>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

export default Notes;
