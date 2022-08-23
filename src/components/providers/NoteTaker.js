import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/TelePsyAPI";
import { Card, CardBody, Col, Input, Label, Row, Spinner } from "reactstrap";
import { exceptionToaster } from "../../helpers/exceptionToaster";
import CreatableSelect from "react-select/creatable";

function NoteTaker(props) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [noteDateErr, setNoteDateErr] = useState("");
  const [noteSessionTimeErr, setNoteSessionTimeErr] = useState("");
  const [newNoteErr, setNewNoteErr] = useState("");
  const [patientErr, setPatientErr] = useState("");
  const [errColorD, setErrColorD] = useState("");
  const [errColorT, setErrColorT] = useState("");
  const [errColorP, setErrColorP] = useState("");
  const [errColorN, setErrColorN] = useState("");
  const [loadButton, setLoadButton] = useState(false);

  const patients = [
    {
      label: "Patients",
      options: [
        { label: "John", value: "John" },
        { label: "Doe", value: "Doe" },
      ],
    },
  ];

  const validateNotesForm = (payload) => {
    if (!payload.date) {
      setNoteDateErr("You need to enter date of session.");
      setErrColorD("err");
      exceptionToaster("error", "You need to enter date of session.");
      setLoadButton(false);
      return false;
    }

    if (!payload.time) {
      setNoteSessionTimeErr("You need to enter time of session.");
      setErrColorT("err");
      exceptionToaster("error", "You need to enter time of session.");
      setLoadButton(false);
      return false;
    }
    if (!payload.patient || payload.patient === "") {
      setPatientErr("Please enter patient before saving.");
      setErrColorP("err");
      exceptionToaster("error", "Please enter patient before saving.");
      setLoadButton(false);
      return false;
    }
    if (!payload.notes) {
      setNewNoteErr("Please enter: 'Notes taken another way' before saving.");
      setErrColorN("err");
      exceptionToaster(
        "error",
        "Please enter: 'Notes taken another way' before saving."
      );
      setLoadButton(false);
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoadButton(true);

    setErrColorD("");
    setErrColorT("");
    setErrColorN("");
    setErrColorP("");

    const payload = {
      date: props.date,
      time: props.time,
      notes: props.notes,
      patient: props.patient,
    };

    console.log(payload, "payload");

    const valid = validateNotesForm(payload);

    if (valid) {
      axiosInstance
        .post("notes/provider-notes/", {
          session_date: props.date,
          session_time: props.time,
          patient: props.patient,
          note: props.notes,
          author: parseInt(user.id),
        })
        .then((response) => {
          // Show success message:
          if (response.status === 201) {
            exceptionToaster("success", "Note successfully saved");
            props.resetFormFields();
            props.setUpdateDisplayCard();
            setLoadButton(false);
          }
        })
        .catch((error) => {
          setLoadButton(false);
          exceptionToaster(
            "error",
            "We could not save his note at the moment, please try again"
          );
        });
    }
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    setLoadButton(true);
    setErrColorD("");
    setErrColorT("");
    setErrColorN("");
    setErrColorP("");
    const payload = {
      date: props.date,
      time: props.time,
      notes: props.notes,
      patient: props.patient,
    };
    validateNotesForm(payload);

    axiosInstance
      .patch(`notes/provider-notes/${props.editedNoteID}/`, {
        session_date: props.date,
        session_time: props.time,
        patient: props.patient,
        note: props.notes,
        author: parseInt(user.id),
      })
      .then((response) => {
        exceptionToaster("success", "Note successfully updated");
        props.resetFormFields();
        props.setUpdateDisplayCard();
        setLoadButton(false);
      })
      .catch((err) => {
        setLoadButton(false);
        return exceptionToaster(
          "error",
          "We could not update this entry journal at the moment. Please try again"
        );
      });
  };

  return (
    <Row>
      <Col lg="">
        <Card
          style={{
            backgroundColor: "#ac888f",
            borderRadius: 22,
            padding: 10,
          }}
        >
          <CardBody>
            <h4 className="card-title textAlignment">
              {props.noteFormH3} Note
            </h4>

            <div className="row mb-1">
              <Label htmlFor="horizontal-firstname-Input">Session:</Label>
              <Col sm={4}>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="date"
                    id={errColorD}
                    disabled={!props.isApproved}
                    value={props.date}
                    onChange={(e) => props.setDate(e.target.value)}
                  />
                </div>
              </Col>
              <Col sm={4}>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="time"
                    id={errColorT}
                    value={props.time}
                    disabled={!props.isApproved}
                    onChange={(e) => props.setTime(e.target.value)}
                  />
                </div>
              </Col>
              {props.isPartnerAccount ? (
                <Col sm={4}>
                  <div className="mb-3">
                    {/* <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Patient"
                      id={errColorP}
                      value={props.patient}
                      disabled={!props.isApproved}
                      onChange={(e) => props.setPatient(e.target.value)}
                    /> */}
                    <CreatableSelect
                      // className="form-control"
                      options={patients}
                      isMulti
                      onChange={(e) => {
                        props.setPatient(e);
                      }}
                      isSearchable={true}
                      value={(props.patient || []).map((x) => ({
                        value: x.value,
                        label: x.value,
                      }))}
                      controlShouldRenderValue={true}
                      placeholder="Patient"
                      disabled={!props.isApproved}
                    />
                  </div>
                </Col>
              ) : (
                <Col lg={4}>
                  <div className="mb-3">
                    <select
                      id={errColorP}
                      className="form-select form-control"
                      onChange={(e) => props.setPatient(e.target.value)}
                      name="patient"
                      value={props.patient}
                    >
                      <option disabled={!props.isApproved}>
                        Select Patient
                      </option>
                      {Object.entries(props.doctorPatients).map(
                        ([doctorPatient]) => (
                          <option
                            key={props.doctorPatients[doctorPatient].id}
                            value={props.doctorPatients[doctorPatient].id}
                            disabled={!props.isApproved}
                          >
                            {props.doctorPatients[doctorPatient].first_name}{" "}
                            {props.doctorPatients[doctorPatient].last_name}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </Col>
              )}
            </div>

            <div className="mt-3 mb-5">
              <Input
                type="textarea"
                id={errColorN}
                // maxLength="225"
                rows="10"
                placeholder="Start Taking Notes"
                onChange={(e) => props.setNotes(e.target.value)}
                value={props.notes}
                disabled={!props.isApproved}
              />
            </div>
            <div
              style={{
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {props.isEditing === true ? (
                <button
                  className="btn w-md saveNoteBtn buttonBoxShadow"
                  onClick={
                    props.isApproved ? (loadButton ? null : handleUpdate) : null
                  }
                  disabled={!props.isApproved}
                >
                  {loadButton ? (
                    <Spinner className="ms-6" color="light" />
                  ) : (
                    "Update Entry"
                  )}
                </button>
              ) : (
                <button
                  className="btn w-md saveNoteBtn buttonBoxShadow"
                  onClick={
                    props.isApproved ? (loadButton ? null : handleSubmit) : null
                  }
                  disabled={!props.isApproved}
                >
                  {loadButton ? (
                    <Spinner className="ms-6" color="light" />
                  ) : (
                    "Save"
                  )}
                </button>
              )}
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default NoteTaker;
