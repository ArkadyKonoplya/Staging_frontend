import React, { useState } from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  Label,
  Button,
  Form,
  Input,
  CardHeader,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

import { states } from "../../helpers"

const ConsultForm = (props) => {
  const [consultant, setConsultant] = useState("adhd-consultant");
  console.log(props.doctorPatients, 'doctorPatients')
  return (
    <Row>
      <Col lg={12}>
        <Card style={{ backgroundColor: "#b2eff1", borderRadius: 15 }}>
          <CardBody>
            <CardHeader className="mb-4" tag="h4">
              Request Consult with Collaborator
            </CardHeader>
            <Form>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label>Request Consult With:</Label>
                    <select
                      onChange={(e) => {
                        setConsultant(e.target.value)
                      }}
                      className="form-select form-control">
                      <option value={"adhd-consultant"}>ADHD Consultant</option>
                      <option value={"collaborator-physician"}>Collaborator Physician</option>
                    </select>
                  </div>
                </Col>

                {consultant === "collaborator-physician" ? (
                  <>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label htmlFor="formrow-provider-Input">Physician Name</Label>
                        <select
                          name="patient"
                          value={props.patient}
                          id="formrow-provider-Input"
                          className="form-select form-control"
                          placeholder="Physician Dropdown"
                        >
                          <option>Select Physician</option>
                          {Object.entries(props.doctorPatients).map(
                            ([doctorPatient]) => (
                              <option
                                key={props.doctorPatients[doctorPatient].id}
                                value={props.doctorPatients[doctorPatient].id}
                                name={
                                  props.doctorPatients[doctorPatient].first_name
                                }
                                title={props.doctorPatients[doctorPatient].email}
                              >
                                {props.doctorPatients[doctorPatient].first_name}{" "}
                                {props.doctorPatients[doctorPatient].last_name}(License-state)
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label>Collaborating physician state</Label>
                        <select
                          id="formrow-time-Input"
                          className="form-select form-control"
                        >
                          {states.map((state) => (
                            <option>{state}</option>
                          ))}
                        </select>
                      </div>
                    </Col>
                  </>
                ) : (
                  <Col lg={4}>
                    <div className="md-3">
                      <Label>Practitioner Name</Label>
                      <Input
                        type="text"
                        className="form-control"
                        placeholder="Practitioner Name"
                      />
                    </div>
                  </Col>
                )}


                <Col lg={4}>
                  <div className="mb-3">
                    <Label>Date</Label>
                    <Flatpickr
                      className="form-control d-block"
                      placeholder="Date"
                      options={{
                        altInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "Y-m-d",
                      }}
                    />
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="mb-3">
                    <Label>Time</Label>
                    <select className="form-select form-control">
                      <option value={"0"}>Choose...</option>
                      <option value={"15:16:00"}>8:00am</option>
                      <option value={"16:16:00"}>8:30am</option>
                      <option value={"17:16:00"}>9:00am</option>
                      <option>9:30am</option>
                      <option>10:00am</option>
                      <option>10:30am</option>
                      <option>11:00am</option>
                    </select>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <Label>Expected Duration</Label>
                    <select className="form-select form-control">
                      <option>Choose...</option>
                      <option>1/2 hour</option>
                      <option>1 hour</option>
                      <option>15 min</option>
                    </select>
                  </div>
                </Col>
              </Row>

              <div>
                <button
                  className="btn w-md buttonBoxShadow"
                  style={{
                    backgroundColor: "#ac2ce7e0",
                    color: "white",
                    borderRadius: 40,
                    marginRight: 10,
                  }}
                >
                  Send Request
                </button>
                <Button
                  className="btn w-md buttonBoxShadow"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: 40,
                  }}
                  onClick={props.onClose}
                >
                  Close Modal
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ConsultForm;
