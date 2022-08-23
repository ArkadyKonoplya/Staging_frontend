import React, { useState, useEffect } from "react";
import { CardTitle, Modal, Spinner } from "reactstrap";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import axiosInstance from "../../api/TelePsyAPI";
import moment from "moment-timezone";
// import { useLocalStorage } from '@rehooks/local-storage';

function RecordDisplayCard(props) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [shortenedUserRecordsTo, setShortenedUserRecordsTo] = useState(4);

  const downloadPDF = (note) => (evt) => {
    evt.preventDefault();
    axiosInstance
      .get(`notes/pdf/${note.id}/`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
  };
  
  const [seeAll, setSeeAll] = useState(false);
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [displayContent, setDisplayContent] = useState({});

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const tog_scroll = () => {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  };

  return (
    <div className="card recordDisplayCard">
      <div value={props.doctorPatient?.id} className="DspCarHead mb-5">
        <h6>
          {props.doctorPatient?.first_name} {props.doctorPatient?.last_name}
        </h6>
        {props.doctorPatient?.provider_patient_notes.length <=
        3 ? null : seeAll ? (
          <button
            onClick={() => {
              setShortenedUserRecordsTo(4);
              setSeeAll(false);
            }}
            className="DisCarHeadBtn"
          >
            Close
          </button>
        ) : (
          <button
            onClick={() => {
              setShortenedUserRecordsTo(
                props.doctorPatient?.provider_patient_notes.length
              );
              setSeeAll(true);
            }}
            className="DisCarHeadBtn"
          >
            See All
          </button>
        )}
      </div>
      {props.doctorPatient?.provider_patient_notes.length === 0 ? (
        <h4 className="currentPatRecH1">
          This patient has no notes associated with them
        </h4>
      ) : (
        <>
          <SimpleBar
            forceVisible="y"
            autoHide={false}
            style={{ maxHeight: "350px" }}
          >
            {props.doctorPatient?.provider_patient_notes
              .slice(0, shortenedUserRecordsTo)
              .map((providerNote, index) => (
                <>
                  <div className="DspCarBody mb-3">
                    <p className="DspCarP" key={index.id}>
                      {/* Date: {providerNote.session_date} Time:{" "} */}
                      {/* {providerNote.session_time} */}
                      {moment(
                      providerNote?.session_date +
                        " " +
                        providerNote?.session_time
                    ).format("LLL")}
                    </p>
                    <button
                      onClick={() => {
                        tog_scroll();
                        setDisplayContent(providerNote);
                      }}
                      className="DspCarBodyBtn DCBBtnEdit"
                    >
                      View
                    </button>
                    <button
                      className="DspCarBodyBtn DCBBtnArchive RDCdownload"
                      onClick={downloadPDF(providerNote)}
                    >
                      Download
                    </button>
                  </div>
                  {/* <hr/> */}
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
              <p>{displayContent.session_date}</p>
              <CardTitle className="mt-0">
                <b>Time</b>
              </CardTitle>
              <p>{displayContent.session_time}</p>
              {/* <CardTitle className="mt-0">
            <b>Provider</b>
          </CardTitle>
          <p>{displayJournalContent.patient}</p> */}
              <CardTitle className="mt-0">
                <b>Notes</b>
              </CardTitle>
              <p>{displayContent.note}</p>
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
        </>
      )}
    </div>
  );
}

export default RecordDisplayCard;
