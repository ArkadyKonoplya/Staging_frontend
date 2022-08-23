import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Input, Row, Spinner } from "reactstrap";
import axiosInstance from "../../api/TelePsyAPI";
import { exceptionToaster } from "../../helpers/exceptionToaster";
import CreatableSelect from "react-select/creatable";

function PersonalJournalTaker(props) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const [providers, setProviders] = useState([]);
  const [titleErr, setTitleErr] = useState("");
  const [excerptErr, setExcerptErr] = useState("");
  const [contentErr, setContentErr] = useState("");
  const [providerErr, setProviderErr] = useState("");
  const [errColorD, setErrColorD] = useState("");
  const [errColorT, setErrColorT] = useState("");
  const [errColorN, setErrColorN] = useState("");
  const [errColorP, setErrColorP] = useState("");
  const [loadButton, setLoadButton] = useState(false);

  const provider = [
    {
      label: "Provider",
      options: [
        { label: "John", value: "John" },
        { label: "Doe", value: "Doe" },
      ],
    },
  ];


  const validateJournalForm = (payload) => {
    if (!payload.title) {
      setTitleErr("You need to enter a Title.");
      setErrColorD("err");
      exceptionToaster("error", "You need to enter a Title.");
      setLoadButton(false);
      return true;
    }

    if (!payload.excerpt) {
      setExcerptErr("You need to enter a one sentence summary.");
      setErrColorT("err");
      exceptionToaster("error", "You need to enter a one sentence summary.");
      setLoadButton(false);
      return true;
    }
    if (!payload.provider) {
      setProviderErr("You need to enter a one sentence summary.")
      setErrColorP("err")
      exceptionToaster("error", "Please select a provider");
      setLoadButton(false);
      return true;
    }

    if (!payload.content) {
      setContentErr("Please type your entry or 'other means' before saving.");
      setErrColorN("err");
      exceptionToaster(
        "error",
        "Please type your entry or 'other means' before saving."
      );
      setLoadButton(false);
      return true;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoadButton(true);
    setErrColorD("");
    setErrColorT("");
    setErrColorN("");
    const payload = {
      title: props.title,
      excerpt: props.excerpt,
      provider: props.provider,
      content: props.content,
    };
    const checkValidation = validateJournalForm(payload);

    if (!checkValidation) {
      axiosInstance
        .post("personal_journal/journal-entries/", {
          title: props.title,
          excerpt: props.excerpt,
          provider: props.provider,
          content: props.content,
          author: parseInt(user.id),
        })
        .then((response) => {
          if (response.status === 201) {
            props.setNewEntry(response.data);
            props.setNewEntryCreated(true);
            exceptionToaster("success", "New Journal Saved Successfully");
            props.resetFormFields();
            props.setUpdateDisplayCard();
            setLoadButton(false);
          }
        })
        .catch((error) => {
          setLoadButton(false);
          return exceptionToaster(
            "error",
            "We could not create an entry journal at the moment. Please try again"
          );
        });
    }
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    setLoadButton(true);
    const payload = {
      title: props.title,
      excerpt: props.excerpt,
      provider: props.provider,
      content: props.content,
    };

    const checkValidation = validateJournalForm(payload);

    if (!checkValidation) {
      axiosInstance
        .patch(`personal_journal/journal-entries/${props.editedEntryID}/`, {
          title: props.title,
          excerpt: props.excerpt,
          provider: props.provider,
          content: props.content,
          author: parseInt(user.id),
        })
        .then((response) => {
          exceptionToaster("success", "Journal Updated Successfully");
          props.resetFormFields();
          props.setUpdateDisplayCard();
          setLoadButton(false);
        })
        .catch((err) => {
          // error : {"provider":["Incorrect type. Expected pk value, received str."]}
          setLoadButton(false);
          return exceptionToaster(
            "error",
            "We could not update this entry journal at the moment. Please try again"
          );
        });
    }
  };

  return (
    <Row>
      <Col>
        <Card
          style={{
            backgroundColor: "#ac888f",
            borderRadius: 22,
            padding: 10,
          }}
        >
          <CardBody>
            <h4 className="card-title textAlignment">New Journal Entry</h4>
            <p className="card-title-desc textAlignment">
              Type in a Title for your entry and a one sentence summary as the
              excerpt. This will make the entry easier to find in your personal
              archives.
            </p>

            <div className="row mb-2">
              <Col sm={4}>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    id={errColorD}
                    placeholder="Title"
                    value={props.title}
                    onChange={(e) => props.setTitle(e.target.value)}
                    disabled={!props.userIdentity}
                  />
                </div>
              </Col>
              <Col sm={4}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id={errColorT}
                    placeholder="Excerpt"
                    value={props.excerpt}
                    onChange={(e) => props.setExcerpt(e.target.value)}
                    disabled={!props.userIdentity}
                  />
                </div>
              </Col>
              {props.subscribed === false ? (
                <Col sm={4}>
                  <div className="mb-3">
                    {/* <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Provider"
                      id={errColorP}
                      value={props.provider}
                      onChange={(e) => props.setProvider(e.target.value)}
                    /> */}
                    <CreatableSelect
                      // className="form-control"
                      options={provider}
                      isMulti
                      onChange={(e) => {
                        props.setProvider(e);
                      }}
                      isSearchable={true}
                      value={(props.provider || []).map((x) => ({
                        value: x.value,
                        label: x.value,
                      }))}
                      controlShouldRenderValue={true}
                      placeholder="Provider"
                      disabled={!props.userIdentity}
                    />
                  </div>
                </Col>
              ) : (
                <Col lg={4}>
                  <div className="mb-3">
                    <div className="mb-3">
                      <select
                        id="formrow-duration"
                        className="form-select form-control"
                        placeholder="Provider Name"
                        onChange={(e) => props.setProvider(e.target.value)}
                        name="doctors"
                        value={props.provider}
                        disabled={!props.userIdentity}
                      >
                        <option>Select Provider</option>
                        {Object.entries(props.userDoctors).map(
                          ([provider, index]) => (
                            <option
                              key={index}
                              value={props.userDoctors[provider].id}
                            >
                              {props.userDoctors[provider].first_name}{" "}
                              {props.userDoctors[provider].last_name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </Col>
              )}
            </div>

            <div className="mt-3 mb-5">
              {contentErr && (
                <div className="errLogin" style={{ color: "red" }}></div>
              )}
              <Input
                type="textarea"
                id={errColorN}
                // maxLength="225"
                rows="10"
                placeholder="Start Typing You Thoughts Here"
                onChange={(e) => props.setContent(e.target.value)}
                value={props.content}
                disabled={!props.userIdentity}
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
                  onClick={loadButton ? null : handleUpdate}
                >
                  {loadButton ? (
                    <Spinner className="ms-6" color="light" />
                  ) : (
                    "Update Entry"
                  )}
                </button>
              ) : (
                <button
                  disabled={!props.userIdentity}
                  className="btn w-md saveNoteBtn buttonBoxShadow"
                  onClick={loadButton ? null : handleSubmit}
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

export default PersonalJournalTaker;
