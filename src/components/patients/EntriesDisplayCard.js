import { parseWithOptions } from "date-fns/fp";
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
import React, { useState, useEffect } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import axiosInstance from "../../api/TelePsyAPI";
import {
  errorExceptionTexts,
  exceptionToaster,
  stringTruncate,
} from "../../helpers";

function EntriesDisplayCard({
  doctor,
  user,
  updateDisplayCard,
  editEntryAutoFill,
  setUpdateDisplayCard,
  resetFormFields,
  userDoctors,
}) {
  const [journalEntries, setJournalEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [displayJournalContent, setDisplayJournalContent] = useState({});
  const [shortenedPatientJournal, setShortenedPatientsJournalTo] = useState(4);
  const [seeAll, setSeeAll] = useState(false);

  const fetchJournals = async () => {
    await axiosInstance
      .get(`accounts/users/${user.id}/get_personal_journals_by_doctor/`)
      .then((response) => {
        console.log(response, "response >>> <<<");
        setJournalEntries(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        return exceptionToaster(
          "error",
          errorExceptionTexts.JOURNAL_ERROR_RESPONSE
        );
      });
  };

  const deleteEntry = async (id) => {
    try {
      await axiosInstance.delete(`personal_journal/journal-entries/${id}/`);
      resetFormFields();
      setUpdateDisplayCard();
    } catch (err) {
      return exceptionToaster("error", errorExceptionTexts.DELETE_ENTRY_ERROR);
    }
  };

  const markArchived = async (id) => {
    try {
      await axiosInstance.patch(`personal_journal/journal-entries/${id}/`, {
        archived: true,
        status: "archived",
      });
      resetFormFields();
      setUpdateDisplayCard();
    } catch (err) {
      return exceptionToaster("error", errorExceptionTexts.ARCHIVED_ERROR);
    }
  };

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const tog_scroll = () => {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  };

  useEffect(() => {
    fetchJournals();
  }, [updateDisplayCard]);

  return (
    <>
      <Col lg={12} center>
        <Card
          className="archives-card"
          style={{
            borderRadius: 22,
          }}
        >
          <CardBody>
            <div className="DspCarHead mb-5">
              {isLoading ? null : (
                <>
                  <h6>
                    Dr. {doctor?.first_name} {doctor?.last_name}
                  </h6>
                  {journalEntries[doctor.email].filter(
                    (note) => note.archived === false
                  ).length <= 3 ? null : seeAll ? (
                    <button
                      onClick={() => {
                        setShortenedPatientsJournalTo(3);
                        setSeeAll(false);
                      }}
                      className="DisCarHeadBtn"
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShortenedPatientsJournalTo(
                          journalEntries[doctor.email].length
                        );
                        setSeeAll(true);
                      }}
                      className="DisCarHeadBtn"
                    >
                      See All
                    </button>
                  )}
                </>
              )}
            </div>

            {isLoading ? (
              <p className="card-title-desc textAlignment">
                <Spinner className="ms-6" color="success" />
                <br />
                Loading...
              </p>
            ) : (
              <SimpleBar
                forceVisible="y"
                autoHide={false}
                style={{ maxHeight: "350px" }}
              >
                {journalEntries[doctor.email]
                  .filter((note) => note.archived === false)
                  .slice(0, shortenedPatientJournal)
                  .map((journalEntry) => (
                    <>
                      {journalEntry.archived === false ? (
                        <div className="DspCarBody2" key={journalEntry.id}>
                          <p className="DspCarP">
                            {stringTruncate(journalEntry.title, 50)}
                          </p>
                          <p className="DspCarP2 mt-2">
                            {stringTruncate(journalEntry.content, 100)}
                          </p>
                          <div
                          // style={{
                          //   padding: 10,
                          // }}
                          >
                            <button
                              className="DspCarBodyBtn DCBBtnEdit mb-2"
                              onClick={() => {
                                editEntryAutoFill(journalEntry);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="DspCarBodyBtn DCBBtnDelete"
                              onClick={() => {
                                deleteEntry(journalEntry.id);
                              }}
                            >
                              Delete
                            </button>

                            <button
                              onClick={() => {
                                tog_scroll();
                                setDisplayJournalContent(journalEntry);
                              }}
                              className="DspCarBodyBtn DCBBtnView mb-2"
                            >
                              View
                            </button>
                            <button
                              className="DspCarBodyBtn DCBBtnArchive"
                              onClick={() => {
                                markArchived(journalEntry.id);
                              }}
                            >
                              Archive
                            </button>
                          </div>
                          <hr />
                        </div>
                      ) : null}
                    </>
                  ))}
              </SimpleBar>
            )}
            <Modal
              isOpen={modal_scroll}
              toggle={() => {
                tog_scroll();
              }}
              scrollable={true}
            >
              <div className="modal-body">
                <CardTitle className="mt-0 .text-bold">
                  <b>Title</b>
                </CardTitle>
                <p>{displayJournalContent.title}</p>
                <CardTitle className="mt-0">
                  <b>Excerpt</b>
                </CardTitle>
                <p>{displayJournalContent.excerpt}</p>
                {/* <CardTitle className="mt-0">
                          <b>Provider</b>
                        </CardTitle>
                        <p>{displayJournalContent.provider}</p> */}
                <CardTitle className="mt-0">
                  <b>Content</b>
                </CardTitle>
                <p>{displayJournalContent.content}</p>
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

export default EntriesDisplayCard;
