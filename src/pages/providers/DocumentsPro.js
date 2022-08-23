import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Modal,
  Container,
} from "reactstrap";
import Sidebar from "../../components/providers/ProvSidebar";
import Header from "../../components/providers/HeaderProv";
import NeededDocsPro from "../../components/providers/NeedDocsPro";
import ConcernSuggestBox from "../../components/ConcernSuggestBox";
import axiosInstance from "../../api/TelePsyAPI";
import { useDropzone } from "react-dropzone";
import ReactTooltip from "react-tooltip";
import React, { useState, useEffect, useRef } from "react";

import {
  exceptionToaster,
  localStorageHelper,
  constantImages,
  constantTexts,
} from "../../helpers";

function DocumentsPro() {
  const [files, setFiles] = useState([]);
  const [loadUpload, setLoadUpload] = useState(false);
  const [endUpload, setEndUpload] = useState(false);
  const [dropZoneText, setDropZoneText] = useState(constantTexts.DEFAULT_DRAG);
  const [documentBeingDragged, setDocumentBeingDragged] = useState("");
  const [fileSubject, setFileSubject] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [requestedDocs, setRequestedDocs] = useState([]);

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const dragImage = useRef(null);

  const dragAndDroppedName = "drag-item";

  const fetchUploadedDocs = async () => {
    try {
      const response = await axiosInstance.get("accounts/telepsycrx-uploads/");
      setUploadedDocs(response?.data);
      console.log("UPLOADED DOCS: ", response.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const fetchRequestedDocs = async () => {
    try {
      const response = await axiosInstance.get(
        "accounts/telepsycrx-downloads/"
      );
      setRequestedDocs(response?.data);
      console.log("TELEPSYCRX NEEDED DOCS: ", response.data);
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    fetchUploadedDocs();
    fetchRequestedDocs();
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

      const formData = new FormData();

      for (let i = 0; i < acceptedFiles.length; i++) {
        console.log("acceptedFiles: ", acceptedFiles[i]);
        formData.append("file", acceptedFiles[i]);
        formData.append("file_type", acceptedFiles[i].type);
      }

      formData.append("uploaded_by", user.id);
      formData.append("uploaded_by_id", user.id);
      formData.append("file_subject", fileSubject);
      formData.append("type", user.type);

      axiosInstance
        .post(`accounts/telepsycrx-uploads/`, formData)
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

      console.log("ACCEPTED FILES: ", acceptedFiles);

      setLoadUpload(true);
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
      const payload = {
        userId: userId?.id,
        fileName: droppedItem,
      };
      setDropZoneText(constantTexts.DEFAULT_DRAG);

      // data to be passed to the API
      console.log(payload, "payload here");

      // Removes the dragged file from the list
      removeResource(droppedItem);
      return exceptionToaster("success", "Saved Successfully");
    }
  };

  /**
   * Render the Images uploaded from the local machine
   *
   * @param {array[object: { preview,fileName }]} file - uploaded images and pdf
   */
  const images = uploadedDocs.map((file, i) => (
    <div
      className="uploadedFileDisplayItems"
      style={
        documentBeingDragged === file?.file
          ? {
              backgroundColor: "#1db505",
              color: "#ffffff",
            }
          : {}
      }
      onClick={() => removeResource(file?.file)}
      // draggable
      // onDragStart={(e) => {
      //   setDragImage(e, file?.preview, file?.file);
      //   setDocumentBeingDragged(file?.file);
      //   setDropZoneText(constantTexts.ONDRAG);
      //   startDrag(e, file?.file);
      // }}
      // onDragEnd={(e) => {
      //   setDropZoneText(constantTexts.DEFAULT_DRAG);
      //   setDocumentBeingDragged("");
      // }}
    >
      <img
        src={
          file?.file_type === "application/pdf"
            ? constantImages.PDF_ICON
            : file?.file
        }
        className="result"
        alt="testDragDrop"
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

  return (
    <section>
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="provider-dash">
          <Container fluid={true}>
            <Row>
              <Col lg={7}>
                <div className="mb-3">
                  <Card
                    style={{
                      backgroundColor: "#CEDAF0",
                      borderColor: "#CEDAF0",
                    }}
                  >
                    <CardBody>
                      <div>
                        <div style={{}} className="table-responsive">
                          <div>
                            <input
                              className="uploadFileHere"
                              value={fileSubject}
                              placeholder="file subject"
                              onChange={(event) =>
                                setFileSubject(event.target.value)
                              }
                              // disabled={!subscribed?.is_approved || fileTitle.length === 0}
                            />
                          </div>
                          <div
                            style={{ cursor: "pointer" }}
                            className="card uploadFileHere m-2 mx-1"
                            {...rootProps}
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
                          {/* <div
                            style={{ cursor: "pointer" }}
                            className={`card uploadFileHere m-5 mx-1 ${
                              dropZoneText === constantTexts.ONDRAG &&
                              "dropzoneAccept"
                            }`}
                            onDragOver={dragOver}
                            dragEnter={() =>
                              setDropZoneText(constantTexts.ONDRAG)
                            }
                            onDragLeave={() =>
                              setDropZoneText(constantTexts.DEFAULT_DRAG)
                            }
                            onDrop={droppedFile}
                          >
                            <input {...getInputProps()} />
                            <h4>{dropZoneText}</h4>
                            <i class=" ULIcon las la-cloud-upload-alt"></i>
                          </div> */}

                          {/* it wasn't working before because the react dropzone wasn't initialized.
                          So what I did here is to initialize the dropzone so that the upload will 
                          work on click  */}
                          <input {...getInputProps()} />

                          <div
                            className={`card ${
                              files.length > 3
                                ? "uploadedMultipleFileDisplay"
                                : "uploadedFileDisplay"
                            }`}
                          >
                            <h5 style={{ textAlign: "center" }}>
                              Uploaded Files to Send to TelePsycRX
                            </h5>
                            {images}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Col>

              <Col lg={5}>
                <div className="mb-3">
                  <Card
                    style={{
                      backgroundColor: "#CEDAF0",
                      borderColor: "#CEDAF0",
                    }}
                  >
                    <CardBody>
                      <div>
                        <NeededDocsPro items={requestedDocs} />
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="mb-3">
                  <Card
                    style={{
                      backgroundColor: "#CEDAF0",
                      borderColor: "#CEDAF0",
                    }}
                  >
                    <CardBody>
                      <div>
                        <ConcernSuggestBox />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </section>
  );
}

export default DocumentsPro;
