// import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
// import { CardTitle, Modal, Spinner } from "reactstrap";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import axiosInstance from "../../api/TelePsyAPI";
import {
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardImg,
  CardText,
  CardHeader,
  CardImgOverlay,
  CardFooter,
  CardDeck,
  CardColumns,
  Container,
  Modal,
  Spinner,
} from "reactstrap";
import moment from "moment";
import { stringTruncate } from "../../helpers";

// For Journal Archives
function ArchivesDisplayCard(props) {
  const [userJournalEntries] = useState(props.userJournalEntries);
  const [shortenedPatientArchives, setShortenedPatientsArchivesTo] =
    useState(6);
  const [seeAll, setSeeAll] = useState(false);
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [displayContent, setDisplayContent] = useState({});

  useEffect(() => {
    console.log("props.userDoctor", typeof props.userDoctor);
    console.log("PROPS.JOURNALENTRIES: ", props.userJournalEntries);
    console.log("PROPS.USERDOCTORS: ", props.userDoctors);
    // console.log(
    //   "JOURNALENTRIES: ",
    //   props.userJournalEntries[index].provider === Number(props.userDoctor)
    // );
  }, []);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const tog_scroll = () => {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  };

  const downloadPDF = (entry) => (evt) => {
    evt.preventDefault();
    axiosInstance
      .get(`personal_journal/pdf/${entry.id}/`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
  };

  const sendArchive = (userDoctor, archivedEntries) => {
    const payload = {
      journalEntryId: archivedEntries.id,
      shared_with: userDoctor.id,
    };
    console.log(payload, "payload");
  };


  return (
    <>
      <Col lg={8} center>
        <Card
          className="archives-card"
          style={{
            borderRadius: 22,
          }}
        >
          <CardBody>
            <div className="DspCarHead mb-5">
              <h6>
                Dr. {props.userDoctor?.first_name} {props.userDoctor?.last_name}
              </h6>
              {props.userJournalEntries.filter(
                (note) =>
                  note.archived === true &&
                  Number(note.provider) === Number(props.userDoctor.id)
              ).length <= 3 ? null : seeAll ? (
                <button
                  onClick={() => {
                    setShortenedPatientsArchivesTo(6);
                    setSeeAll(false);
                  }}
                  className="DisCarHeadBtn"
                >
                  Close
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShortenedPatientsArchivesTo(
                      props.userJournalEntries.length
                    );
                    setSeeAll(true);
                  }}
                  className="DisCarHeadBtn"
                >
                  See All
                </button>
              )}
            </div>

            <SimpleBar
              forceVisible="y"
              autoHide={false}
              style={{ maxHeight: "350px" }}
            >
              {props.userJournalEntries
                .filter((journal) => journal.archived === true)
                .slice(0, shortenedPatientArchives)
                .map((archivedEntries, index) => {
                  return (
                    <>
                      {Number(props.userJournalEntries[index].provider) ===
                        Number(props.userDoctor.id) && (
                        <>
                          <div
                            className="DspCarBody2 mb-3"
                            key={archivedEntries.id}
                          >
                            <p className="DspCarP">
                              {stringTruncate(archivedEntries.title, 50)}
                            </p>
                            <p className="DspCarP2 mt-2">
                              {stringTruncate(archivedEntries.content, 100)}
                            </p>
                            <div
                              style={{
                                padding: 10,
                              }}
                            >
                              <button
                                className="DspCarBodyBtn DCBBtnArchive"
                                onClick={() => {
                                  tog_scroll();
                                  setDisplayContent(archivedEntries);
                                }}
                              >
                                View
                              </button>

                              <button
                                onClick={downloadPDF(archivedEntries)}
                                className="DspCarBodyBtn DCBBtnDelete"
                              >
                                Download
                              </button>
                              <button
                                onClick={() =>
                                  sendArchive(props.userDoctor, archivedEntries)
                                }
                                className={`DspCarBodyBtn DCBBtnView ${
                                  !props.subscribed && "buttonDisabled"
                                }`}
                                disabled={!props.subscribed}
                              >
                                Send
                              </button>
                            </div>
                            <hr />
                          </div>
                        </>
                      )}
                    </>
                  );
                })}
            </SimpleBar>
            <Modal
              isOpen={modal_scroll}
              toggle={() => {
                tog_scroll();
              }}
              scrollable={true}
            >
              <div className="modal-body">
                <CardTitle className="mt-0 .text-bold">
                  <b>Date</b>
                </CardTitle>
                <p>{displayContent.date_created}</p>
                <CardTitle className="mt-0">
                  <b>Title</b>
                </CardTitle>
                <p>{displayContent.title}</p>
                <CardTitle className="mt-0">
                  <b>Content</b>
                </CardTitle>
                <p>{displayContent.content}</p>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setmodal_scroll(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

export default ArchivesDisplayCard;
