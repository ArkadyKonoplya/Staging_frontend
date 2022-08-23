import React, { useState, useEffect } from "react";
import { CardTitle, Modal, Spinner } from "reactstrap";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import axiosInstance from "../../api/TelePsyAPI";
import { errorExceptionTexts, exceptionToaster } from "../../helpers";
import moment from "moment-timezone";

function NoteDisplayCard({
  doctorPatient,
  editNoteAutoFill,
  setUpdateDisplayCard,
  resetFormFields,
  isApproved,
}) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [isLoading, setIsLoading] = useState(true);
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [displayJournalContent, setDisplayJournalContent] = useState({});
  const [shortenedPatientNotes, setShortenedPatientsNotesTo] = useState(3);
  const [seeAll, setSeeAll] = useState(false);

  const markArchived = async (id) => {
    try {
      await axiosInstance.patch(`/notes/provider-notes/${id}/`, {
        archived: true,
        status: "archived",
      });
      exceptionToaster("success", "Successfully archived");
      resetFormFields();
      setUpdateDisplayCard();
    } catch (err) {
      exceptionToaster("error", "Note failed to archive, please try again");
      return exceptionToaster("error", errorExceptionTexts.ARCHIVED_ERROR);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axiosInstance.delete(`notes/provider-notes/${id}/`);
      exceptionToaster("success", "Note deleted successfully");
      resetFormFields();
      setUpdateDisplayCard();
    } catch (err) {
      exceptionToaster("error", "Note failed to delete, please try again");
      return exceptionToaster("error", errorExceptionTexts.DELETE_ENTRY_ERROR);
    }
  };

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const tog_scroll = () => {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  };

  return (
    <div className="providerJournalCards">
      <div value={doctorPatient?.id} className="DspCarHead mb-5">
        <h6>
          {doctorPatient?.first_name} {doctorPatient?.last_name}
        </h6>
        {doctorPatient?.provider_patient_notes.filter(
          (note) => note.archived === false
        ).length <= 3 ? null : seeAll ? (
          <button
            onClick={() => {
              setShortenedPatientsNotesTo(3);
              setSeeAll(false);
            }}
            className="DisCarHeadBtn"
          >
            Close
          </button>
        ) : (
          <button
            onClick={() => {
              setShortenedPatientsNotesTo(
                doctorPatient?.provider_patient_notes.length
              );
              setSeeAll(true);
            }}
            className="DisCarHeadBtn"
            disabled={!isApproved}
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
        {doctorPatient?.provider_patient_notes
          .slice(0, shortenedPatientNotes)
          .map((providerNote, index) => (
            <>
              {providerNote.archived === false && (
                <div className="DspCarBody mb-3">
                  <p className="DspCarP" key={index.id}>
                    {moment(
                      providerNote?.session_date +
                        " " +
                        providerNote?.session_time
                    ).format("LLL")}
                  </p>
                  <div className="">
                    <button
                      onClick={() => {
                        editNoteAutoFill(providerNote);
                      }}
                      className="DspCarBodyBtn DCBBtnEdit mb-2"
                      disabled={!isApproved}
                    >
                      Edit
                    </button>
                    <button
                      className="DspCarBodyBtn DCBBtnDelete"
                      onClick={() => {
                        deleteNote(providerNote?.id);
                      }}
                      disabled={!isApproved}
                    >
                      Delete
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        tog_scroll();
                        setDisplayJournalContent(providerNote);
                      }}
                      className="DspCarBodyBtn DCBBtnView mb-2"
                      disabled={!isApproved}
                    >
                      View
                    </button>

                    <button
                      className="DspCarBodyBtn DCBBtnArchive"
                      onClick={() => {
                        markArchived(providerNote?.id);
                      }}
                      disabled={!isApproved}
                    >
                      Archive
                    </button>
                  </div>
                </div>
              )}
            </>
          ))}
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
          <p>{displayJournalContent.session_date}</p>
          <CardTitle className="mt-0">
            <b>Time</b>
          </CardTitle>
          <p>{displayJournalContent.session_time}</p>
          {/* <CardTitle className="mt-0">
            <b>Provider</b>
          </CardTitle>
          <p>{displayJournalContent.patient}</p> */}
          <CardTitle className="mt-0">
            <b>Notes</b>
          </CardTitle>
          <p>{displayJournalContent.note}</p>
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
    </div>
  );
}

export default NoteDisplayCard;
