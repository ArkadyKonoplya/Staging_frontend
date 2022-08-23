import axiosInstance from "../api/TelePsyAPI";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import React, { useState, useEffect } from "react";
const messageChoices = ["Concern", "Suggestion", "Write a Review"];

const ConcernSuggestBox = (props) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    let user = JSON.parse(localStorage.getItem("user"));

    const payload = {
      messageType: messageType,
      made_by: user.id,
      user_type: user.type,
      title: title,
      details: details,
    };

    if (payload.messageType === "Concern") {
      // console.log("You have submitted a Concern")
      // console.log(payload);
      axiosInstance
        .post("telepsycrx_hr/hr-directories/", {
          messageType: messageType,
          made_by: user.id,
          user_type: user.type,
          title: title,
          details: details,
        })
        .then(function (response) {
          console.log(`Axios response: ${response.status}`);

          // Show success message:
          if (response.status === 201) {
            //   Clear the form when the message is saved
            const resetForm = () => {
              setMessageType("");
              setTitle("");
              setDetails("");
              console.log("Form cleared");
            };
            resetForm();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (payload.messageType === "Suggestion") {
      axiosInstance
        .post("telepsycrx_marketing/marketing-suggestions/", {
          messageType: messageType,
          made_by: user.id,
          user_type: user.type,
          title: title,
          details: details,
        })
        .then(function (response) {
          console.log(`Axios response: ${response.status}`);

          // Show success message:
          if (response.status === 201) {
            //   Clear the form when the message is saved
            const resetForm = () => {
              setMessageType("");
              setTitle("");
              setDetails("");
              console.log("Form cleared");
            };
            resetForm();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      // console.log("You have submitted a Suggestion")
      // console.log(payload);
      return;
    } else if (payload.messageType === "Write a Review") {
      axiosInstance
        .post("telepsycrx_marketing/marketing-reviews/", {
          messageType: messageType,
          made_by: user.id,
          user_type: user.type,
          title: title,
          details: details,
        })
        .then(function (response) {
          console.log(`Axios response: ${response.status}`);

          // Show success message:
          if (response.status === 201) {
            //   Clear the form when the message is saved
            const resetForm = () => {
              setMessageType("");
              setTitle("");
              setDetails("");
              console.log("Form cleared");
            };
            resetForm();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      // console.log("You have submitted a Suggestion")
      // console.log(payload);
      return;
    } else if (!payload.messageType) {
      console.log("You must select a message type.");
      console.log(payload);
      return;
    }

    axiosInstance;
    // .post(`token/`, {
    //   email: formData.email,
    //   password: formData.password,
    // }) else {
    //   return;
    // }
    // .then((res) => {
    //   localStorage.setItem("access_token", res.data.access);
    //   localStorage.setItem("refresh_token", res.data.refresh);
    //   axiosInstance.defaults.headers["Authorization"] =
    //     "JWT " + localStorage.getItem("access_token");

    //   // store the user in localStorage
    //   localStorage.setItem("user", JSON.stringify(res.data));

    //   const { from } = location?.state || {};
    //   if (from) {
    //     history.push(from);
    //   } else if (res.data.type === "Doctor") {
    //     history.push("/provider-dashboard");
    //   } else {
    //     history.push("/patient-dashboard");
    //   }
    // });
  };

  return (
    <Row>
      <Col lg="12">
        <Card
          style={{
            backgroundColor: "#EEEBE7",
            borderRadius: 22,
            // padding: 10,
          }}
        >
          <div className="card-header">
            <h3>Suggestions or Concerns</h3>
          </div>
          <CardBody>
            <div className="row mb-1">
              <Col sm={4}>
                <div className="mb-3">
                  <select
                    id="formrow-duration"
                    className="form-select form-control"
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value)}
                  >
                    <option>Select Type</option>
                    {messageChoices.map((messageChoices) => (
                      <option>{messageChoices}</option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col sm={8}>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="text"
                    defaultValue="2019-08-19"
                    id="example-date-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                  />
                </div>
              </Col>
            </div>

            <div className="mt-3 mb-5">
              <Input
                type="textarea"
                id="textarea"
                maxLength="225"
                rows="2"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Start Typing You Thoughts Here"
              />
            </div>
            <div
              style={{
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <button
                className="btn w-md saveNoteBtn buttonBoxShadow"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ConcernSuggestBox;
