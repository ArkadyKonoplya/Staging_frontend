import Sidebar from "../../components/providers/ProvSidebar";
import Header from "../../components/providers/HeaderProv";
import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";
import axiosInstance from "../../api/TelePsyAPI";
import { useDropzone } from "react-dropzone";
import ReactTooltip from "react-tooltip";
import PatientReceive from "../../components/providers/PatientReceive";
import {
  exceptionToaster,
  localStorageHelper,
  constantImages,
  constantTexts,
} from "../../helpers";
import { SubscriptionContext } from "../../helpers/subscriptionContext";
import IsApprovedMessage from "../../components/IsApprovedMessage";
import IsPartnerMessage from "../../components/IsPartnerMessage";


function ProvResources() {
  const [files, setFiles] = useState([]);
  const [patient, setPatient] = useState("");
  const [patients, setPatients] = useState([]);
  const [commDocUploads, setCommDocUploads] = useState([]);
  const [annotatedUploads, setAnnotatedUploads] = useState([]);
  const [patientResponses, setPatientResponses] = useState([]);
  const uploads = useMemo(
    () => [...commDocUploads, ...annotatedUploads],
    [commDocUploads, annotatedUploads]
  );
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [loadUpload, setLoadUpload] = useState(false);
  const [endUpload, setEndUpload] = useState(false);
  const [dropZoneText, setDropZoneText] = useState(constantTexts.DEFAULT_DRAG);
  const [documentBeingDragged, setDocumentBeingDragged] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileSearchKeyword, setFileSearchKeyword] = useState("");
  const [fileTypes] = useState([
    {
      name: "Blank Resource",
    },
    {
      name: "Annotation to patient",
    },
    {
      name: "ADHD consult",
    },
    {
      name: "Colleague referral",
    },
  ]);

  const [fileSubject, setFileSubject] = useState("");

  const [filteredUploads, setFilteredUploads] = useState([]);

  const userId = localStorageHelper.load("user");
  const dragImage = useRef(null);
  const checkComponent = { unMount: false };
  const dragAndDroppedName = "drag-item";

  const fetchDocUploads = async () => {
    const response = await axiosInstance.get(`accounts/comm-res/`);
    setCommDocUploads(response.data);

    // temporary since the response is empty
    // setFileDocUploads(uploadedDocs);
  };

  const fetchAnnotatedUploads = async () => {
    const response = await axiosInstance.get(`accounts/annotated-res/`);
    setAnnotatedUploads(response.data);
  };

  const fetchPatients = async () => {
    const response = await axiosInstance.get(
      `accounts/users/${user.id}/get_doctor_patients/`
    );

    const doctorsPatientsDataToArray = Object.keys(response.data).map(
      (key) => response.data[key]
    );
    console.log(doctorsPatientsDataToArray, "doctorsPatientsDataToArray >>>");
    setPatients(doctorsPatientsDataToArray);
    // setIsLoading(false);
  };

  const fetchPatientResponses = async () => {
    try {
      const response = await axiosInstance.get("accounts/patient-res/");
      setPatientResponses(response?.data);
      console.log("PATIENT RESPONSES: ", response.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    checkComponent.unMount = false;
    fetchPatients();
    fetchPatientResponses();
    fetchDocUploads();
    fetchAnnotatedUploads();

    return () => {
      checkComponent.unMount = true;
    };
  }, []);

  useEffect(() => {
    dragImage.current = null;
    dragImage.current = new Image();
    dragImage.current.src = constantImages.DEFAULT_DRAG_IMAGE;
  }, []);

  /**
   * Handles the image/pdf upload
   * Handled the multiple image/pdf upload
   *  Checks the file upload type and set the necessary preview uri and filename
   *
   * @returns a state of the uploaded files
   */
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 20) {
        return exceptionToaster(
          "error",
          "You can only upload 20 files at a time"
        );
      }
      setLoadUpload(true);
      const formData = new FormData();

      for (let i = 0; i < acceptedFiles.length; i++) {
        console.log("acceptedFiles: ", acceptedFiles[i]);
        formData.append("file", acceptedFiles[i]);
        formData.append("file_type", acceptedFiles[i].type);
      }

      formData.append("uploaded_by", user.id);
      formData.append("uploaded_by_id", user.id);
      formData.append(
        "file_subject",
        fileSubject.replace(/\s+/g, "-").toLowerCase()
      );
      formData.append("type", user.type);
      //
      axiosInstance
        .post(
          fileType === "Annotation to patient"
            ? `accounts/annotated-res/`
            : "accounts/comm-res/",
          formData
        )
        .then(function (response) {
          console.log(`Axios response: ${response.status}`);

          // Show success message:
          if (response.status === 201) {
            //   Clear the form when the message is saved
            console.log("Saved Files");
            fetchDocUploads();
            fetchAnnotatedUploads();
          }
        })
        .catch(function (error) {
          console.log(error);
        });

      acceptedFiles.map((file) => {
        if (file.type === "application/pdf") {
          files.unshift({
            preview: constantImages.PDF_ICON,
            fileName: file.name,
            subjectName: fileSubject.replace(/\s+/g, "-").toLowerCase(),
          });
        } else {
          files.unshift({
            preview: URL.createObjectURL(file),
            fileName: file.name,
            subjectName: fileSubject.replace(/\s+/g, "-").toLowerCase(),
          });
        }
      });
      const newFiles = Object.values(
        files.reduce(
          (acc, cur) => Object.assign(acc, { [cur?.fileName]: cur }),
          {}
        )
      );

      setFileSubject("");
      // check if file type and file subjected was created or selected
      if (fileSubject.length === 0) {
        setEndUpload(true);
        setLoadUpload(false);
        return exceptionToaster(
          "error",
          "File type and file subject is required"
        );
      }

      setFiles(newFiles);
      setFileSubject("");
      if (files.length === 20) {
        setEndUpload(true);
        exceptionToaster("error", "You can only upload 20 files at a time");
      } else {
        setEndUpload(false);
      }
      setLoadUpload(false);
    },
  });

  /**
   * Removes a file from uploaded files
   *
   * @param {string} name - name of the file to be deleted
   * @returns updated array && sets it to state
   */
  const removeResource = (name) => {
    const filtered = files.filter((value, index, arr) => {
      return value.fileName !== name;
    });
    setFiles(filtered);
  };

  /**
   * startDrag: This function is called when you try to drag item from the image/pdf box
   * It sets it to the dragged file to the window dataTransfer event
   *
   * @param {object} event - window event
   * @param {string} dataItem - the file name that is being dragged
   */
  const startDrag = (event, dataItem) => {
    event.dataTransfer.setData(dragAndDroppedName, dataItem);
  };

  /**
   * This function sets the drag image displayed won the cursor when you drag the document
   * It sets the already initialized current drag image and sets the width and height
   *
   * @param {object} event - window event
   */
  const setDragImage = (event) => {
    event.dataTransfer.setDragImage(dragImage.current, 10, 10);
  };

  /**
   * This function prevent the default disable-dropping behavior and allows dropping the handler
   *
   * @param {object} event
   */
  const dragOver = (event) => {
    event.preventDefault();
    setDropZoneText(constantTexts.ONDRAG);
  };

  /**
   * Access the dropped file set to the window dataTransfer event
   *
   * @param {object} event - window event
   */
  const droppedFile = (event) => {
    setDropZoneText(constantTexts.DROPPING);
    const droppedItem = event.dataTransfer.getData(dragAndDroppedName);

    if (droppedItem) {
      const patientFormatted = parseFloat(patient);
      const payload = {
        userId: userId?.id,
        fileId: parseInt(droppedItem),
        patientId: patientFormatted,
      };
      setDropZoneText(constantTexts.DEFAULT_DRAG);

      // data to be passed to the API
      console.log(payload, "payload here");

      if (
        payload.patientId === undefined ||
        payload.patientId === null ||
        typeof payload.patientId !== "number"
        // ||
        // payload.patientId !== payload.patientId
      ) {
        return exceptionToaster("error", "Please select a provider");
      }
      axiosInstance.patch(`accounts/annotated-res/`, payload);

      // Removes the dragged file from the list
      removeResource(droppedItem);
      return exceptionToaster("success", "Sent Successfully");
    }
  };

  useEffect(() => {
    setFilteredUploads(uploads);
    setFileSearchKeyword("");
  }, [uploads]);
  /**
   * Render the Images uploaded from the local machine
   *
   * @param {array[object: { preview,fileName }]} file - uploaded images and pdf
   */

  const images = filteredUploads.map((file, i) => {
    return (
      <div
        className="uploadedFileDisplayItems"
        style={
          documentBeingDragged === file?.id
            ? {
              backgroundColor: "#1db505",
              color: "#ffffff",
            }
            : {}
        }
        onClick={() => removeResource(file?.file)}
        draggable
        onDragStart={(e) => {
          setDragImage(
            e,
            file?.file_type === "application/pdf"
              ? constantImages.PDF_ICON
              : file?.file,
            file?.file
          );
          setDocumentBeingDragged(file?.id);
          setDropZoneText(constantTexts.ONDRAG);
          startDrag(e, file?.id);
        }}
        onDragEnd={(e) => {
          setDropZoneText(constantTexts.DEFAULT_DRAG);
          setDocumentBeingDragged("");
        }}
      >
        <img
          src={
            file?.file_type === "application/pdf"
              ? constantImages.PDF_ICON
              : file?.file
          }
          className="result"
          alt={file?.file_subject}
          data-tip
          data-for={`${file?.file}-tool-tip`}
        />
        <p
          data-tip
          data-for={`${file?.file}-tool-tip`}
          style={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {file?.file_subject}
        </p>
        <ReactTooltip
          id={`${file?.file}-tool-tip`}
        >{`Click to remove ${file?.file_subject}`}</ReactTooltip>
      </div>
    );
  });

  /**
   * Handles limit reached for more than 20 documents
   * This disables the upload button if images is >= 20
   */
  const rootProps = loadUpload ? null : endUpload ? null : getRootProps();
  const { userContext } = useContext(SubscriptionContext);
  console.log("UPLOADS: ", uploads);
  const searchUploads = (event) => {
    setFileSearchKeyword(event.target.value);
    const filtered = uploads.filter((value) => {
      return value.file_subject
        ?.toLowerCase()
        .includes(event.target.value.toLowerCase());
    });

    setFilteredUploads(filtered);
  };

  return (
    <section>
      <Sidebar />
      <div className="main-content">
        <Header />
        {userContext?.is_approved === true ? null : (
          <IsApprovedMessage />
        )}

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
          <Container fluid={true}>
            <Row>
              <Col lg={8} >
                <Row>
                  <Col lg={5}>
                    <div className="row cal">
                      <select
                        name="doctors"
                        value={fileType}
                        onChange={(event) => setFileType(event.target.value)}
                        className="provResources uploadFileHere"
                        placeholder="File Type"
                      >
                        <option
                          disabled={
                            !userContext?.is_approved || userContext?.is_partner_account
                          }
                          value="null"
                        >
                          select message type
                        </option>
                        {fileTypes.map((file, index) => (
                          <option
                            disabled={!userContext?.is_approved}
                            key={index}
                            value={file?.name}
                          >
                            {file?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>

                  <Col lg={5} >
                    <div className="row cal">
                      <input
                        className="provResources uploadFileHere"
                        value={fileSubject}
                        placeholder="file subject"
                        onChange={(event) => setFileSubject(event.target.value)}
                        disabled={!userContext?.is_approved || fileType.length === 0}
                      />
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={5}>
                    <div className="row cal">
                      <select
                        name="doctors"
                        value={patient}
                        onChange={(event) => setPatient(event.target.value)}
                        className="provResources uploadFileHere"
                        placeholder="Patient Name"
                      >
                        <option
                          disabled={
                            !userContext?.is_approved || userContext?.is_partner_account
                          }
                          value="null"
                        >
                          select patient
                        </option>
                        {patients.map((patient, index) => (
                          <option
                            disabled={
                              !userContext?.is_approved ||
                              userContext?.is_partner_account ||
                              fileType.length === 0
                            }
                            key={index}
                            value={patient?.id}
                          >
                            {patient?.first_name} {patient?.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>

                  {fileType === "Colleague referral" ? (
                    <Col lg={5} >
                      <div className="row cal">
                        <select
                          name="doctors"
                          value={patient}
                          onChange={(event) => setPatient(event.target.value)}
                          className="provResources uploadFileHere"
                          placeholder="Patient Name"
                        >
                          <option
                            disabled={
                              !userContext?.is_approved || userContext?.is_partner_account
                            }
                            value="null"
                          >
                            select colleague referral
                          </option>
                          {patients.map((patient, index) => (
                            <option
                              disabled={
                                !userContext?.is_approved ||
                                userContext?.is_partner_account ||
                                fileType.length === 0
                              }
                              key={index}
                              value={patient?.id}
                            >
                              {patient?.first_name} {patient?.last_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>
                  ) : null}
                </Row>

                <Row>
                  <Col lg={5}>
                    <div
                      style={{ cursor: "pointer" }}
                      className="card uploadFileHere m-5 mx-1"
                      {...(fileType.length === 0 ? null : { ...rootProps })}
                    >
                      <>
                        <h4>
                          {loadUpload
                            ? "Uploading..."
                            : endUpload
                              ? "Limit Reached"
                              : "Upload Files"}
                        </h4>
                        <i class=" ULIcon las la-file-upload"></i>
                      </>
                    </div>
                  </Col>

                  <Col lg={5}>
                    <div
                      style={{ cursor: "pointer" }}
                      className={`card uploadFileHere m-5 mx-1 ${dropZoneText === constantTexts.ONDRAG && "dropzoneAccept"
                        }`}
                      onDragOver={dragOver}
                      dragEnter={() => setDropZoneText(constantTexts.ONDRAG)}
                      onDragLeave={() =>
                        setDropZoneText(constantTexts.DEFAULT_DRAG)
                      }
                      onDrop={droppedFile}
                    >
                      <input {...getInputProps()} />
                      <h4>{dropZoneText}</h4>
                      <i class=" ULIcon las la-cloud-upload-alt"></i>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={12}>
                    <div
                      className={`card ${files.length > 3
                        ? "uploadedMultipleFileDisplay"
                        : "uploadedFileDisplay"
                        }`}
                    >
                      <input
                        className="sendProv uploadFileHere"
                        value={fileSearchKeyword}
                        placeholder="Search file"
                        onChange={(event) => searchUploads(event)}
                      // disabled={!subscribed?.is_approved || fileTitle.length === 0}
                      />
                      <h5 style={{ textAlign: "center" }}>
                        Uploaded Files to Send to TelePsycRX
                      </h5>
                      {images}
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col lg={4}>
                <Row>
                  <Col lg={12}>
                    <PatientReceive
                      patientResponses={patientResponses}
                      isApproved={userContext?.is_approved}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

          </Container>
        </main>
      </div>
    </section>
  );
}

export default ProvResources;
