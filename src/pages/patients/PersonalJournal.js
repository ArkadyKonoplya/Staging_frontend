import { useState, useEffect, useContext } from "react";
import { SubscriptionContext } from "../../helpers/subscriptionContext";
import { requiredInformation } from "../../helpers";
import NewUserRequirement from "../../components/patients/NewUserRequirementModal";
import { Col, Row, Spinner } from "reactstrap";
import EntriesDisplayCard from "../../components/patients/EntriesDisplayCard";
import Sidebar from "../../components/patients/SidebarPatient";
import Header from "../../components/patients/HeaderPatient";
import PersonalJournalTaker from "../../components/patients/PersonalJournalTaker";
import axiosInstance from "../../api/TelePsyAPI";
import { exceptionToaster } from "../../helpers/exceptionToaster";
const PersonalJournal = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [provider, setProvider] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntryID, setEditedEntryID] = useState("");
  const [entryFormH3, setEntryFormH3] = useState("New");

  const [entryFormSubmitButton, setEntryFormSubmitButton] = useState("Save");
  const [journalEntries, setJournalEntries] = useState([]);

  const [userDoctors, setUserDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEntryCreated, setNewEntryCreated] = useState(false);
  const [newEntry, setNewEntry] = useState();

  const [updateDisplayCard, setUpdateDisplayCard] = useState(false);

  const [selectedArchiveProvider, setSelectedArchiveProvider] = useState("");
  const [openEntry, setOpenEntry] = useState(false);
  const [entryCardData, setEntryCardData] = useState({});

  const fetchUserDoctors = async () => {
    try {
      const response = await axiosInstance.get(
        `accounts/users/${user.id}/get_user_doctors/`
      );
      const doctorsDataToArray = Object.keys(response.data).map(
        (key) => response.data[key]
      );
      setUserDoctors(doctorsDataToArray);
      setIsLoading(false);
    } catch (err) {
      return exceptionToaster(
        "error",
        "We are unable to fetch doctors for now, please try again"
      );
    }
  };

  // EditAutoFill Entry
  const editEntryAutoFill = async (journalEntry) => {
    const { title, excerpt, content, provider, id } = journalEntry;
    setProvider(provider);
    setContent(content);
    setTitle(title);
    setExcerpt(excerpt);
    setEditedEntryID(id);
    setIsEditing(true);
    setEntryFormH3("Edit");
  };

  const resetFormFields = () => {
    setProvider("");
    setContent("");
    setTitle("");
    setExcerpt("");
    setEditedEntryID("");
    setIsEditing(false);
    setEntryFormH3("New");
  };

  useEffect(() => {
    fetchUserDoctors();
  }, []);

  const entriesCardView = () => {
    userDoctors.forEach((element) => {
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
      <Sidebar active="Journal" />
      <div className="main-content">
        <Header />

        <main className="patient-dash">
          {userContext.is_identified ? null : (
            <NewUserRequirement
              requiredInformation={requiredInformation}
            />
          )}
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
            <div className="table-responsive" style={{
              filter: userContext.is_identified ? null : "blur(2px)",
            }}>
              <Row className="disable-scrollbar-style">
                <Col lg="6">
                  <div
                    class=""
                    style={{
                      marginBottom: 40,
                    }}
                  >
                    <PersonalJournalTaker
                      setJournalEntries={setJournalEntries}
                      journalEntries={journalEntries}
                      provider={provider}
                      setProvider={setProvider}
                      content={content}
                      setContent={setContent}
                      title={title}
                      setTitle={setTitle}
                      excerpt={excerpt}
                      setExcerpt={setExcerpt}
                      setIsEditing={setIsEditing}
                      isEditing={isEditing}
                      setEntryFormH3={setEntryFormH3}
                      entryFormH3={entryFormH3}
                      setEntryFormSubmitButton={setEntryFormSubmitButton}
                      entryFormSubmitButton={entryFormSubmitButton}
                      setEditedEntryID={setEditedEntryID}
                      editedEntryID={editedEntryID}
                      userDoctors={userDoctors}
                      setNewEntryCreated={setNewEntryCreated}
                      setNewEntry={setNewEntry}
                      setUpdateDisplayCard={() =>
                        setUpdateDisplayCard(!updateDisplayCard)
                      }
                      resetFormFields={resetFormFields}
                      subscribed={userContext.is_subscribed}
                      userIdentity={userContext.is_identified}
                    />
                  </div>
                </Col>

                <Col lg="6" style={{ paddingBottom: "8px" }}>
                  <h3 className="">View Provider Archives</h3>
                  <select
                    id="formrow-duration"
                    className="patientProfileSelect"
                    placeholder="Provider Name"
                    onChange={(e) => {
                      if (e.target.value === "Select Provider") {
                        setSelectedArchiveProvider(e.target.value);
                        return setOpenEntry(false);
                      }
                      setSelectedArchiveProvider(e.target.value);
                    }}
                    name="doctors"
                    value={selectedArchiveProvider}
                    disabled={!userContext.is_identified}
                  >
                    <option value="Select Provider">Select Provider</option>
                    {Object.entries(userDoctors).map(([provider, index]) => (
                      <option key={index} value={userDoctors[provider].id}>
                        {userDoctors[provider].first_name}{" "}
                        {userDoctors[provider].last_name}
                      </option>
                    ))}
                  </select>
                  {openEntry === false ? null : (
                    <EntriesDisplayCard
                      doctor={entryCardData}
                      user={user}
                      updateDisplayCard={updateDisplayCard}
                      editEntryAutoFill={editEntryAutoFill}
                      setUpdateDisplayCard={() =>
                        setUpdateDisplayCard(!updateDisplayCard)
                      }
                      resetFormFields={resetFormFields}
                      userDoctors={userDoctors}
                    />
                  )}
                </Col>
              </Row>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default PersonalJournal;
