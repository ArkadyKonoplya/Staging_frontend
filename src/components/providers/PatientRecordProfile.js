import React, { useEffect, useState } from "react";
import iconLogo from "../../Images/TelePsycRXnameWicon500by300.jpg";
import ProfileBoxPA from "../patients/ProfileBoxPA";
import axiosInstance from "../../api/TelePsyAPI";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Modal,
  CardHeader,
  CardTitle,
  InputGroup,
} from "reactstrap";

import "flatpickr/dist/themes/material_green.css";
import healthIssues from "../../helpers/healthIssues";
import moment from "moment-timezone";
import NewPrescription from "./NewPrescription";

function PatientRecordProfile({ setProfileUpdate, profileUpdate, ...props }) {
  const [preferredPharmacy, setPreferredPharmacy] = useState(false);
  const [preferredPharmacyPending, setPreferredPharmacyPending] =
    useState(false);
  const [localPharmacy, setLocalPharmacy] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState(false);
  const [adhd_consult_confirmed] = useState(true);

  const downloadPDF = (evt) => {
    evt.preventDefault();
    axiosInstance
      .get(`accounts/patients/${props.patient.id}/pdf/`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
  };

  //   const onChangeIsChecked = () => {
  //     setIsChecked("checked");
  //   };

  // const triggerUpdate = () => {
  //   setProfileUpdate(props.patient);
  // };

  // const setAndGenerateTimezoneFromZip = (target) => {
  //   setZipCode(target.value);

  //   if (target.value.length === 5) {
  //     const tz = ZipCodeTimezone.lookup(target.value);
  //     console.log(tz, "timezone here");
  //   }
  // };
  // const [image, setImage] = useState({ preview: "", raw: "" });

  React.useEffect(() => {
    console.log("PATIENT INFO>>>> ", props.patient);
    // if (image.preview) {
    //   localStorage.setItem(
    //     "patient",
    //     JSON.stringify({ ...props.patient, image: props.patient.image.preview })
    //   );
    //   setProfileUpdate(props.patient.image.preview);
    //   setImage({
    //     preview: props.patient.image,
    //     raw: "",
    //   });
    // }
  }, []); /*[image.preview] */

  const subscriptionType = props.patient.subscription_type.replace(/-/g, " ").split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <section>
      <div className="container">
        <div
          className="row d-flex justify-content-center"
          style={{
            backgroundColor: "#f0efeb",
            borderRadius: 20,
          }}
        >
          <div className="mt-1 col-lg-12 p-3 center">
            <ProfileBoxPA
              user={props.patient}
              image={props.patient.image}
              width="90"
              height="90"
            />
            <h5 className="center textAlignment">
              {subscriptionType || props.patient.subscription_type}
            </h5>
            <h4 className="mb-3 center textAlignment">
              Patient Health Information
            </h4>
            <hr />
            <h5 className="mt-3 textAlignment">Basic Information</h5>
            <br />
            <Row>
              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>Relationship</Label>
                  <Input
                    type="text"
                    className="form-control"
                    value={props.patient.relationship}
                    disabled={true}
                  />
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    className="form-control"
                    value={props.patient.first_name}
                    disabled={true}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    className="form-control"
                    value={props.patient.last_name}
                    disabled={true}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>Date of birth</Label>
                  <Input
                    type="text"
                    className="form-control"
                    value={moment(props.patient.date_of_birth).format("LL")}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>Gender</Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="* Gender"
                    value={props.patient.gender}
                    disabled={true}
                  />
                </div>
              </Col>
            </Row>
            <hr />
            <h5 className="mt-3 textAlignment textAlignment">
              Address Information
            </h5>
            <br />
            <Row>
              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>Address Line 1</Label>
                  <Input
                    type="text"
                    className="form-control"
                    value={props.patient.address1}
                    disabled={true}
                  />
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>Address Line 2</Label>
                  <Input
                    type="text"
                    className="form-control"
                    value={props.patient.address2}
                    disabled={true}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>City</Label>
                  <Input
                    type="text"
                    className="form-control"
                    value={props.patient.city}
                    disabled={true}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>State</Label>
                  <Input
                    type="text"
                    className="form-control"
                    value={props.patient.state}
                    disabled={true}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>Zip Code</Label>
                  <Input
                    type="text"
                    className="form-control"
                    value={props.patient.zip}
                    disabled={true}
                  />
                </div>
              </Col>
            </Row>
            <hr />
            {/* Preferred Pharmacy Information */}
            {preferredPharmacy && (
              <>
                <h5 className="mt-3 textAlignment textAlignment">
                  Preferred Pharmacy Information
                </h5>
                {preferredPharmacyPending ? (
                  <h5 className="mb-5 textAlignment textAlignment text-success">
                    <i>Pending</i>
                  </h5>
                ) : (
                  <>
                    <br />
                    <Row>
                      <Col lg={6}>
                        <div className="mb-3 textAlignment">
                          <Label>Pharmacy Name</Label>
                          <Input
                            type="text"
                            className="form-control"
                            disabled={true}
                          />
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="mb-3 textAlignment">
                          <Label>Address</Label>
                          <Input
                            type="text"
                            className="form-control"
                            disabled={true}
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3 textAlignment">
                          <Label>State</Label>
                          <Input
                            type="text"
                            className="form-control"
                            disabled={true}
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3 textAlignment">
                          <Label>Phone Number</Label>
                          <Input
                            type="text"
                            className="form-control"
                            disabled={true}
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3 textAlignment">
                          <Label>Fax Number</Label>
                          <Input
                            type="text"
                            className="form-control"
                            disabled={true}
                          />
                        </div>
                      </Col>
                    </Row>
                  </>
                )}
              </>
            )}

            {/* Devivery Address */}
            {deliveryAddress && (
              <>
                <h5 className="mt-3 mb-4 textAlignment">Delivery Address</h5>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3 textAlignment">
                      <Label>Address Line 1</Label>
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3 textAlignment">
                      <Label>Address Line 2</Label>
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3 textAlignment">
                      <Label>City</Label>
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3 textAlignment">
                      <Label>State</Label>
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3 textAlignment">
                      <Label>Zip</Label>
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </Col>
                </Row>
              </>
            )}

            {/* Local pharmacy information */}
            {localPharmacy && (
              <>
                <h5 className="mt-3 mb-4 textAlignment">
                  Local Pharmacy Information
                </h5>
                <Row>
                  <Col lg={6}>
                    <div className="mb-3 textAlignment">
                      <Label>Pharmacy Name</Label>
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3 textAlignment">
                      <Label>Address</Label>
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3 textAlignment">
                      <Label>City</Label>
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3 textAlignment">
                      <Label>Phone Number</Label>
                      <Input
                        type="number"
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </Col>

                  <Col lg={6}>
                    <div className="mb-3 textAlignment">
                      <Label>Fax Number</Label>
                      <Input
                        type="number"
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-3 textAlignment">
                      <Label>State</Label>
                      <Input
                        type="text"
                        className="form-control"
                        disabled={true}
                      />
                    </div>
                  </Col>
                </Row>
              </>
            )}
            <hr />
            <h5 className="mt-3 mb-4 textAlignment">Medical Information</h5>
            <Row>
              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label> Height</Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Feet"
                    value={props.patient.height_ft}
                    disabled={true}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>Inches</Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Inches"
                    value={props.patient.height_inch}
                    disabled={true}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3 textAlignment">
                  <Label>Weight in lbs</Label>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="* Weight in lbs."
                    value={props.patient.weight}
                    disabled={true}
                  />
                </div>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="formrow-time-Input">Smokes:</Label>
                  <div>{props.patient.alcohol ? "Yes" : "No"}</div>
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="formrow-time-Input">Drinks alcohol:</Label>
                  <div>{props.patient.alcohol ? "Yes" : "No"}</div>
                </div>
              </Col>
            </Row>
            <hr />
            <Row>
              <h5 className="mt-3 mb-2">Current Medications:</h5>
              <Col lg={12} md={18}>
                <div className="">
                  <label id="Conditions">
                    {props.patient.medications.length > 0 ? (
                      props.patient.medications.join(", ")
                    ) : (
                      <i>This patient has no current medications</i>
                    )}
                  </label>
                </div>
              </Col>
            </Row>

            <br />

            <Row>
              <h5 className="mt-5 mb-2">Current Allergies:</h5>
              <Col lg={12} md={18}>
                <div className="">
                  <label id="Conditions">
                    {props.patient.allergies.length > 0 ? (
                      props.patient.allergies.join(", ")
                    ) : (
                      <i>This patient has no current allergies</i>
                    )}
                  </label>
                </div>
              </Col>
            </Row>

            <br />
            <hr />
            <Row>
              <h5 className="mt-5 mb-2">
                This Patient has been diagnosed with:
              </h5>
              <Col lg={12} md={18}>
                <div className="">
                  <label id="Conditions">
                    {Object.entries(healthIssues)
                      .filter(([key]) => props.patient[key])
                      .map(([key, value]) => value)
                      .join(", ").length > 0 ? (
                      Object.entries(healthIssues)
                        .filter(([key]) => props.patient[key])
                        .map(([key, value]) => value)
                        .join(", ")
                    ) : (
                      <i>This patient has no current diagnosis</i>
                    )}
                  </label>
                </div>
              </Col>
            </Row>

            <br />
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Input
                    type="textarea"
                    maxLength="225"
                    rows="3"
                    placeholder="Other Health Issues or Details."
                    value={props.patient.other_problems}
                    disabled={true}
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <h5 className="mt-5 mb-2">Family has been diagnosed with:</h5>
              <Col lg={12} md={18}>
                <label id="Conditions">
                  {Object.entries(healthIssues)
                    .filter(([key]) => props.patient[`family_${key}`])
                    .map(([key, value]) => value)
                    .join(", ").length > 0 ? (
                    Object.entries(healthIssues)
                      .filter(([key]) => props.patient[`family_${key}`])
                      .map(([key, value]) => value)
                      .join(", ")
                  ) : (
                    <i>This patient's family has no current diagnosis</i>
                  )}
                </label>
              </Col>
            </Row>

            <br />
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Input
                    type="textarea"
                    maxLength="225"
                    rows="3"
                    placeholder="Other Family History or Details."
                    value={props.patient.family_other_problems}
                    disabled={true}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  onClick={downloadPDF}
                  className="btn w-md profileProviderPageButton buttonBoxShadow"
                >
                  Download
                </Button>
                {"   "}
                <Button
                  onClick={props.setShowNewPrescriptionModal}
                  className="btn w-md profileProviderPagePrescriptionButton buttonBoxShadow"
                >
                  New Prescription
                </Button>
              </Col>
            </Row>
            <Modal
              isOpen={props.showNewPrescriptionModal}
              toggle={() => {
                props.setShowNewPrescriptionModal;
              }}
              centered
              size="lg"
              contentClassName="modal-calendar-style"
            >
              <NewPrescription
                setShowNewPrescriptionModal={props.setShowNewPrescriptionModal}
                productList={props.productList}
                setProductList={props.setProductList}
                handleAdd={props.handleAdd}
                adhd_consult_confirmed={adhd_consult_confirmed}
              />
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PatientRecordProfile;
