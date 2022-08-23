import Sidebar from "../../components/patients/SidebarPatient";
import Header from "../../components/patients/HeaderPatient";
import React, { useState, useEffect, useRef, useContext } from "react";
import axiosInstance from "../../api/TelePsyAPI";
import { CardTitle, Modal, Spinner } from "reactstrap";
import { useDropzone } from "react-dropzone";
import ReactTooltip from "react-tooltip";
import { requiredInformation } from "../../helpers";
import NewUserRequirement from "../../components/patients/NewUserRequirementModal";
import ProviderAssign from "../../components/patients/ProviderAssign";
import CheckoutModal from "../../components/CheckoutModal";

import {
  exceptionToaster,
  localStorageHelper,
  constantImages,
  constantTexts,
} from "../../helpers";
import { SubscriptionContext } from "../../helpers/subscriptionContext";

function PatientResources() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [files, setFiles] = useState([]);
  const [provider, setProvider] = useState("");
  const [providers, setProviders] = useState([]);
  const [resources, setResources] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [fileSearchKeyword, setFileSearchKeyword] = useState("");
  const [annoResponse, setAnnoResponse] = useState([]);
  const [loadUpload, setLoadUpload] = useState(false);
  const [endUpload, setEndUpload] = useState(false);
  const [dropZoneText, setDropZoneText] = useState(constantTexts.DEFAULT_DRAG);
  const [documentBeingDragged, setDocumentBeingDragged] = useState("");
  const [fileTypes] = useState([
    {
      name: "Send to Doctor",
    },
    // {
    //   name: "Send to Doctor",
    // },
    // {
    //   name: "Response to patient",
    // },
  ]);
  const [fileTitle, setFileTitle] = useState("");
  const [fileSubject, setFileSubject] = useState("");
  const [subscribemodal, setSubscribemodal] = useState(false);

  const [filteredUploads, setFilteredUploads] = useState([]);

  const userId = localStorageHelper.load("user");
  const dragImage = useRef(null);
  const checkComponent = { unMount: false };
  const dragAndDroppedName = "drag-item";

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const tog_scroll = () => {
    setSubscribemodal(!subscribemodal);
    removeBodyCss();
  };

  const fetchProviders = async () => {
    try {
      const response = await axiosInstance.get(`accounts/doctors/`);
      if (checkComponent.unMount) return;
      setProviders(response?.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const fetchDocResources = async () => {
    try {
      const response = await axiosInstance.get(`accounts/comm-res/`);
      if (checkComponent.unMount) return;
      setResources(response?.data);
      console.log("COMMUN. RESOURCE: ", response.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const fetchUploadedDocs = async () => {
    try {
      const response = await axiosInstance.get(`accounts/patient-res/`);
      if (checkComponent.unMount) return;
      setUploadedDocs(response?.data);
      console.log("UPLOADED RESOURCE: ", response.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const fetchDocResponses = async () => {
    try {
      const response = await axiosInstance.get(`accounts/annotated-res/`);
      if (checkComponent.unMount) return;
      setAnnoResponse(response?.data);
      console.log("ANNOTATED RESPONSE: ", response.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  // checkComponent handles memory leak
  useEffect(() => {
    checkComponent.unMount = false;
    fetchProviders();
    fetchDocResources();
    fetchUploadedDocs();
    fetchDocResponses();

    return () => {
      checkComponent.unMount = true;
    };
  }, []);

  useEffect(() => {
    dragImage.current = null;
    dragImage.current = new Image();
    dragImage.current.src = constantImages.DEFAULT_DRAG_IMAGE;
  }, []);

  useEffect(() => {
    setFilteredUploads(uploadedDocs);
    setFileSearchKeyword("");
  }, [uploadedDocs]);

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
      formData.append(
        "file_subject",
        fileSubject.replace(/\s+/g, "-").toLowerCase()
      );
      formData.append("type", user.type);
      //
      axiosInstance
        .post(`accounts/patient-res/`, formData)
        .then(function (response) {
          console.log(`Axios response: ${response.status}`);

          // Show success message:
          if (response.status === 201) {
            //   Clear the form when the message is saved
            console.log("Saved Files");
            fetchUploadedDocs();
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
            fileTitle: fileTitle,
          });
        } else {
          files.unshift({
            preview: URL.createObjectURL(file),
            fileName: file.name,
            subjectName: fileSubject.replace(/\s+/g, "-").toLowerCase(),
            fileTitle: fileTitle,
          });
        }
      });
      const newFiles = Object.values(
        files.reduce(
          (acc, cur) => Object.assign(acc, { [cur?.fileName]: cur }),
          {}
        )
      );
      setFiles(newFiles);
      setFileSubject("");
      setFileTitle("");
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
      const providerFormatted = parseFloat(provider);
      const payload = {
        userId: userId?.id,
        fileName: droppedItem,
        doctorId: providerFormatted,
      };
      setDropZoneText(constantTexts.DEFAULT_DRAG);

      // data to be passed to the API
      console.log(payload, "payload here");

      if (
        payload.doctorId === undefined ||
        payload.doctorId === null ||
        typeof payload.doctorId !== "number"
        // ||
        // payload.doctorId !== payload.doctorId
      ) {
        return exceptionToaster("error", "Please select a provider");
      }

      // Removes the dragged file from the list
      removeResource(droppedItem);

      // setting dropZoneText to loading...
      // setDropZoneText(constantTexts.DROPPING);

      // ---- Make the API call to upload the file ----

      return exceptionToaster("success", "Saved Successfully");
    }
  };

  /**
   * Render the Images uploaded from the local machine
   *
   * @param {array[object: { preview,fileName }]} file - uploaded images and pdf
   */
  const images = filteredUploads.map((file) => (
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
        setDragImage(e, file?.preview, file?.id);
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
          file?.file_type.toLowerCase().includes("pdf")
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
  ));

  /**
   * Handles limit reached for more than 20 documents
   * This disables the upload button if images is >= 20
   */
  const rootProps = loadUpload ? null : endUpload ? null : getRootProps();
  const { userContext } = useContext(SubscriptionContext);

  const searchUploads = (event) => {
    setFileSearchKeyword(event.target.value);
    const filtered = uploadedDocs.filter((value) => {
      return value.file_subject
        ?.toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    console.log({ filtered });
    setFilteredUploads(filtered);
  };

  const checkIdentityToRender = () => {
    if (userContext.is_subscribed === false) {
      return true;
    };

    if (userContext.is_identified === false) {
      return true;
    };

    return false;
  };


  return (
    <section>
      <Sidebar active="Resources" />
      <div className="main-content patient">
        <Header />

        <main className="patient-dash">
          {userContext.is_identified ? (
            <>
              {userContext?.is_subscribed ? null : (
                <div className="float-box">
                  <h3>
                    This feature can only be available to subscribed users. Would
                    you like to upgrade?{" "}
                    <a
                      href="#"
                      onClick={() => {
                        tog_scroll();
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      Yes
                    </a>
                  </h3>
                  <CheckoutModal
                    setSubscribemodal={() => setSubscribemodal(!subscribemodal)}
                    subscribemodal={subscribemodal}
                  />
                </div>
              )}
            </>
          ) : (
            <NewUserRequirement
              requiredInformation={requiredInformation}
            />
          )}

          <div
            className="moveRight"
            style={{
              filter: userContext.is_subscribed === false || userContext.is_identified === false ? "blur(2px)" : null,
            }}
          >
            <div>
              <select
                // id={errColorP}
                name="doctors"
                value={fileTitle}
                onChange={(event) => setFileTitle(event.target.value)}
                className="sendProv uploadFileHere"
                placeholder="File Type"
                disabled={checkIdentityToRender()}
              >
                <option>Select Message Type</option>
                {fileTypes.map((file, index) => (
                  <option
                    disabled={!userContext?.is_subscribed}
                    key={index}
                    value={file?.name}
                  >
                    {file?.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                // id={errColorP}
                name="doctors"
                value={provider}
                onChange={(event) => {
                  setProvider(event.target.value);
                }}
                className="sendProv uploadFileHere"
                placeholder="Provider Name"
                disabled={checkIdentityToRender()}
              >
                <option disabled={!userContext.is_subscribed} value="null">
                  Select Provider
                </option>
                {providers.map((provider, index) => (
                  <option
                    disabled={
                      !userContext.is_subscribed || fileTitle.length === 0
                    }
                    key={index}
                    value={provider?.id}
                  >
                    {provider?.first_name} {provider?.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <input
                className="sendProv uploadFileHere"
                value={fileSubject}
                placeholder="file subject"
                onChange={(event) => setFileSubject(event.target.value)}
                disabled={!userContext?.is_subscribed || fileTitle.length === 0}
              />
            </div>
            <br />
          </div>
          <br />
          <div
            className="recent-grid"
            style={{
              filter: userContext.is_subscribed === false || userContext.is_identified === false ? "blur(2px)" : null,
            }}
          >
            <div class="table-responsive">
              {userContext?.is_subscribed ? (
                <div
                  style={{ cursor: "pointer" }}
                  className="card uploadFileHere m-5 mx-1"
                  {...(fileTitle.length === 0 ? null : { ...rootProps })}
                >
                  <>
                    <h4>
                      {loadUpload
                        ? "Uploading..."
                        : endUpload
                          ? "Limit Reached"
                          : "Upload Files"}
                    </h4>
                    <i className=" ULIcon las la-file-upload"></i>
                  </>
                </div>
              ) : (
                <div
                  style={{ cursor: "pointer" }}
                  className="card uploadFileHere m-5 mx-1"
                >
                  <>
                    <h4>
                      {loadUpload
                        ? "Uploading..."
                        : endUpload
                          ? "Limit Reached"
                          : "Upload Files"}
                    </h4>
                    <i className=" ULIcon las la-file-upload"></i>
                  </>
                </div>
              )}

              {/* Drop section */}
              <div
                style={{ cursor: "pointer" }}
                className={`card uploadFileHere m-5 mx-1 ${dropZoneText === constantTexts.ONDRAG && "dropzoneAccept"
                  }`}
                onDragOver={dragOver}
                dragEnter={() => setDropZoneText(constantTexts.ONDRAG)}
                onDragLeave={() => setDropZoneText(constantTexts.DEFAULT_DRAG)}
                onDrop={droppedFile}
              >
                <input {...getInputProps()} />
                <h4>{dropZoneText}</h4>
                <i className=" ULIcon las la-cloud-upload-alt"></i>
              </div>
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
                />
                <h5 style={{ textAlign: "center" }}></h5>
                {images}
              </div>
            </div>
            <ProviderAssign items={[...annoResponse, ...resources]} />
          </div>
        </main>
      </div>
    </section>
  );
}

export default PatientResources;
