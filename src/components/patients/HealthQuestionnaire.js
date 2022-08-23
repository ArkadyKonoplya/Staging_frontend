import { useEffect, useState } from "react";
import iconLogo from "../../Images/TelePsycRXnameWicon500by300.jpg";
import ProfileBoxPA from "../../components/patients/ProfileBoxPA";
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
  FormGroup,
  Form,
} from "reactstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import ZipCodeTimezone from "zipcode-to-timezone";
import moment from "moment-timezone";
import { exceptionToaster } from "../../helpers/exceptionToaster";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import healthIssues from "../../helpers/healthIssues";

function HealthQuestionnaire({ setProfileUpdate, profileUpdate }) {
  const [profile, setProfile] = useState({});
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [pharmacyAddressStatus, setPharmacyAddressStatus] = useState(true);
  const [localPharmacyAddressStatus, setLocalPharmacyAddressStatus] =
    useState(false);
  const [deliveryAddressStatus, setDeliveryAddressStatus] = useState(false);
  const [updateAddress, setUpdateAddress] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`accounts/patients/${user.patient_id}/`)
      .then((response) => response.data)
      .then(setProfile);
  }, []);

  const relationships = [
    "*Relationship",
    "Me",
    // "Parent",
    // "Domestic Partner",
    // "Husband",
    // "Wife",
    // "Son",
    // "Daughter",
    // "Other",
  ];
  const genders = ["*Gender", "Male", "Female", "Trans", "Non-binary"];
  const states = [
    "*State of Residence",
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const inches = [
    {
      label: "*Inches",
      value: null,
    },
    {
      label: "0",
      value: 0,
    },
    {
      label: "1",
      value: 1,
    },
    {
      label: "2",
      value: 2,
    },
    {
      label: "3",
      value: 3,
    },
    {
      label: "4",
      value: 4,
    },
    {
      label: "5",
      value: 5,
    },
    {
      label: "6",
      value: 6,
    },
    {
      label: "7",
      value: 7,
    },
    {
      label: "8",
      value: 8,
    },
    {
      label: "9",
      value: 9,
    },
    {
      label: "10",
      value: 10,
    },
    {
      label: "11",
      value: 11,
    },
  ];
  const feet = [
    "*Feet",
    {
      label: "0",
      value: 0,
    },
    {
      label: "3",
      value: 3,
    },
    {
      label: "4",
      value: 4,
    },
    {
      label: "5",
      value: 5,
    },
    {
      label: "6",
      value: 6,
    },
    {
      label: "7",
      value: 7,
    },
  ];
  const [inch, setInches] = useState("");
  const [isSmoker, setIsSmoker] = useState(false);
  const [isDrinker, setIsDrinker] = useState(false);
  // const [joinWaitlist, setJoinWaitList] = useState({});
  const [joinWaitlist, setJoinWaitList] = useState("");

  const handleProblemChange =
    (setState, keyPrefix = "") =>
    (e) => {
      let key = keyPrefix + e.target.name;
      setState((prev) => {
        return {
          ...prev,
          [key]: e.target.checked,
        };
      });
    };

  const problemMap =
    (setState, keyPrefix = "") =>
    ([key, label]) =>
      (
        <label key={key} className="containerOC Conditions">
          {label}
          <input
            checked={profile[keyPrefix + key]}
            name={key}
            type="checkbox"
            onChange={handleProblemChange(setState, keyPrefix)}
          />
          <span className="checkmarkOC"></span>
        </label>
      );

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const waitListed = {
      user: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      state_of_residence: profile.state,
      states_of_license: profile.states,
      patient_id: user.patient_id,
      medications,
      allergies,
    };
    console.log(waitListed, "waitListed");

    if (joinWaitlist === true) {
      await axiosInstance.post(
        `telepsycrx_marketing/patient-waitlist/`,
        waitListed
      );
    }

    axiosInstance
      .patch(`accounts/patients/${user.patient_id}/`, profile)
      .then(console.log);
  };

  const triggerUpdate = (value) => {
    setProfileUpdate(value);
  };

  const setAndGenerateTimezoneFromZip = (target) => {
    try {
      if (target.value.length === 5) {
        const timezone = ZipCodeTimezone.lookup(target.value);
        const abbreviatedTimezone = moment().tz(timezone).format("z");
        console.log(abbreviatedTimezone, "timezone here");
        setProfile({ ...profile, timezone, zip: target.value });
      } else {
        setProfile({ ...profile, zip: target.value });
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const customStyles = {
    control: (styles) => ({
      ...styles,
      borderRadius: 12,
    }),
    input: (styles) => ({ ...styles }),
  };

  const trimConvertAndSetMedications = (target) => {
    const medications = target.value.replace(/\s/g, "");
    const convertedMedications = medications.split(",");
    setMedications(convertedMedications);
  };

  const trimConvertAndSetAllergies = (target) => {
    const allergies = target.value.replace(/\s/g, "");
    const convertedAllergies = allergies.split(",");
    setAllergies(convertedAllergies);
  };

  const handleSubmitPharmacyAddress = () => {
    exceptionToaster(
      "success",
      "Pharmacy Medication Address Saved Successfully"
    );
    setUpdateAddress(true);
  };

  useEffect(() => {
    if (deliveryAddressStatus) {
      setLocalPharmacyAddressStatus(false);
      setPharmacyAddressStatus(false);
      setUpdateAddress(false);
    }
  }, [deliveryAddressStatus]);

  useEffect(() => {
    if (localPharmacyAddressStatus) {
      setPharmacyAddressStatus(false);
      setDeliveryAddressStatus(false);
      setUpdateAddress(false);
    }
  }, [localPharmacyAddressStatus]);

  return (
    <section>
      <div className="container">
        <div className="row d-flex justify-content-center row-box">
          <div className="mt-1 col-lg-7 p-5 center">
            <ProfileBoxPA
              user={user}
              profileUpdate={profileUpdate}
              setProfileUpdate={triggerUpdate}
              showLogo={true}
              enableEdit={true}
            />
            <h2 className="mb-3 center textAlignment">
              Create Your Patient Profile
            </h2>
            <Row>
              <Col md={12}>
                <h6 className="textAlignment">
                  Currently Servicing: Arizona, California, Nevada, Hawaii,
                  Pennsylvania, Texas, Illinois, New York
                </h6>
                <hr />
                <h6 className="mt-3 mb-4">
                  If we are not currently servicing your area, that will change
                  soon! Would you like to fill out a profile and join our
                  temporary wait list?
                </h6>
                <div className="hours-rows">
                  <label className="containerOC">
                    Yes
                    <input
                      value={true}
                      id="OnWaitlist"
                      type="radio"
                      name="joinWaitlist"
                      onChange={() => {
                        return setJoinWaitList(true);
                      }}
                    />
                    <span className="checkmarkOC"></span>
                  </label>
                </div>
                <div className="hours-rows">
                  <label className="containerOC">
                    No
                    <input
                      value={false}
                      id="notWaitlisted"
                      type="radio"
                      name="joinWaitlist"
                      onChange={() => {
                        return setJoinWaitList(false);
                      }}
                    />
                    <span className="checkmarkOC"></span>
                  </label>
                </div>
              </Col>
            </Row>
            <br />
            <h4 className="mt-3 textAlignment">Basic Information</h4>
            <br />
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <select
                    id="formrow-duration"
                    className="form-select form-control"
                    value={profile?.relationship}
                    onChange={({ target }) =>
                      setProfile({ ...profile, relationship: target.value })
                    }
                  >
                    {relationships.map((relationship) => (
                      <option key={relationship}>{relationship}</option>
                    ))}
                  </select>
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    id="formrow-email-Input"
                    placeholder="* Firstname"
                    value={profile?.first_name}
                    onChange={({ target }) =>
                      setProfile({ ...profile, first_name: target.value })
                    }
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  {/* <Label htmlFor="formrow-email-Input">Patient Name</Label> */}
                  <Input
                    type="text"
                    className="form-control"
                    id="formrow-email-Input"
                    placeholder="* Lastname"
                    value={profile?.last_name}
                    onChange={({ target }) =>
                      setProfile({ ...profile, last_name: target.value })
                    }
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Flatpickr
                    value={profile?.date_of_birth}
                    onChange={([date]) =>
                      setProfile({
                        ...profile,
                        date_of_birth: moment(date).format("YYYY-MM-DD"),
                      })
                    }
                    className="form-control"
                    id="formrow-date-Input"
                    placeholder="* DOB click pick"
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <select
                    id="formrow-duration"
                    className="form-select form-control"
                    value={profile?.gender}
                    onChange={({ target }) =>
                      setProfile({ ...profile, gender: target.value })
                    }
                  >
                    {genders.map((gender) => (
                      <option key={gender}>{gender}</option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>
            <h4 className="mt-3 textAlignment textAlignment">
              Address Information
            </h4>
            <br />
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    value={profile?.address1}
                    onChange={({ target }) =>
                      setProfile({ ...profile, address1: target.value })
                    }
                    className="form-control"
                    placeholder="Address Line 1"
                  />
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    value={profile?.address2}
                    onChange={({ target }) =>
                      setProfile({ ...profile, address2: target.value })
                    }
                    className="form-control"
                    placeholder="Address Line 2"
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    value={profile?.city}
                    onChange={({ target }) =>
                      setProfile({ ...profile, city: target.value })
                    }
                    className="form-control"
                    placeholder="City"
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <select
                    id="formrow-time-Input"
                    value={""}
                    className="form-select form-control"
                    onChange={({ target }) => {}}
                  >
                    {states.map((state) => (
                      <option>{state}</option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    value={profile?.zip}
                    className="form-control"
                    placeholder="Zip Code"
                    onChange={({ target }) =>
                      setAndGenerateTimezoneFromZip(target)
                    }
                  />
                </div>
              </Col>
            </Row>

            {/* Preferred Pharmacy Information */}
            <h4 className="mt-3 textAlignment textAlignment">
              {localPharmacyAddressStatus
                ? "Local Pharmacy Information"
                : deliveryAddressStatus
                ? "Delivery Address"
                : "Preferred Pharmacy Information"}
            </h4>
            {profile?.subscription_type ===
            "medication-and-therapy" ? (
              <>
                <br />
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label className="d-block mb-3">
                        Would you like your medications delivered to you?
                      </Label>
                      <div className="form-check form-check-inline">
                        <label className="containerOC">
                          Yes
                          <input
                            checked={deliveryAddressStatus}
                            onChange={({ target }) => {
                              setDeliveryAddressStatus(true);
                            }}
                            type="radio"
                          />
                          <span className="checkmarkOC"></span>
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <label className="containerOC">
                          No
                          <input
                            checked={localPharmacyAddressStatus}
                            onChange={({ target }) => {
                              setLocalPharmacyAddressStatus(true);
                            }}
                            type="radio"
                          />
                          <span className="checkmarkOC"></span>
                        </label>
                      </div>
                    </div>
                  </Col>
                </Row>
              </>
            ) : null}
            {pharmacyAddressStatus && (
              <>
                <div className="p-4" style={{ borderRadius: 10 }}>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          value={""}
                          onChange={({ target }) => {}}
                          className="form-control"
                          placeholder="Pharmacy Name"
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Phone Number"
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Address Line 1"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="City"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
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
                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Fax number"
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </>
            )}

            {/* local pharmacy address */}

            {localPharmacyAddressStatus && (
              <>
                <div
                  className="p-4"
                  style={{ backgroundColor: "#EEEBE7", borderRadius: 10 }}
                >
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Pharmacy Name"
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Address Line"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="number"
                          className="form-control"
                          placeholder="Phone Number"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="number"
                          className="form-control"
                          placeholder="Fax Number"
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="City"
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <select
                          id="formrow-time-Input"
                          value={profile?.state}
                          className="form-select form-control"
                          onChange={({ target }) => {
                            setProfile({ ...profile, state: target.value });
                          }}
                        >
                          {states.map((state) => (
                            <option>{state}</option>
                          ))}
                        </select>
                      </div>
                    </Col>
                  </Row>
                  <div className="text-center">
                    <button
                      onClick={() => handleSubmitPharmacyAddress()}
                      className="btn pharmacy-address-button w-md"
                    >
                      {!updateAddress
                        ? "Save Local Pharmacy Information"
                        : "Update Local Pharmacy Information"}
                    </button>
                  </div>
                </div>
                {localPharmacyAddressStatus && <hr />}
              </>
            )}

            {/* delivery address */}
            {deliveryAddressStatus && (
              <>
                <div
                  className="p-4"
                  style={{ backgroundColor: "#b1ecd7", borderRadius: 10 }}
                >
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Address Line 1"
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Address Line 2"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="City"
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
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
                    <Col lg={6}>
                      <div className="mb-3">
                        <Input
                          type="text"
                          className="form-control"
                          placeholder="Zip Code"
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="text-center">
                    <button
                      onClick={() => handleSubmitPharmacyAddress()}
                      className="btn delivery-address-button w-md"
                    >
                      {!updateAddress
                        ? "Save Delivery Address"
                        : "Update Delivery Address"}
                    </button>
                  </div>
                </div>
                {deliveryAddressStatus && <hr />}
              </>
            )}

            <h4 className="mt-3 mb-4 textAlignment">Medical Information</h4>
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <select
                    value={profile?.height_ft}
                    onChange={({ target }) =>
                      setProfile({ ...profile, height_ft: target.value })
                    }
                    id="formrow-time-Input"
                    className="form-select form-control"
                  >
                    {feet.map((foot) => (
                      <option key={foot.label}>{foot.value}</option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <select
                    id="formrow-time-Input"
                    className="form-select form-control"
                    value={profile?.height_inch}
                    onChange={({ target }) =>
                      setProfile({ ...profile, height_inch: target.value })
                    }
                  >
                    {inches.map((inch) => (
                      <option key={inch.label} value={inch.value}>
                        {inch.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    value={profile?.weight}
                    onChange={({ target }) =>
                      setProfile({ ...profile, weight: target.value })
                    }
                    type="text"
                    className="form-control"
                    placeholder="* Weight in lbs."
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  {/* This needs to be an array */}
                  <Input
                    // value={(profile.state_license_numbers || []).join(", ")}
                    type="text"
                    className="form-control"
                    placeholder="Medications e.g Asthma,Acne,Antibiotics"
                    onChange={({ target }) => {
                      trimConvertAndSetMedications(target);
                    }}
                    //   onContentSizeChange={(event) => {
                    //     numOfLines = event.nativeEvent.contentSize.height / 18;
                    // }}
                    // style={{ height: Math.max(35, numOfLines)}}
                  />
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3">
                  {/* This needs to be an array */}
                  <Input
                    // value={(profile.state_license_numbers || []).join(", ")}
                    type="text"
                    className="form-control"
                    placeholder="Allergies e.g dust,mold,animals"
                    onChange={({ target }) => {
                      trimConvertAndSetAllergies(target);
                    }}
                    //   onContentSizeChange={(event) => {
                    //     numOfLines = event.nativeEvent.contentSize.height / 18;
                    // }}
                    // style={{ height: Math.max(35, numOfLines)}}
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="d-block mb-3">Have you ever smoked?</Label>
                  <div className="form-check form-check-inline">
                    <label className="containerOC">
                      Yes
                      <input
                        checked={profile?.smoke}
                        onChange={({ target }) =>
                          setProfile({ ...profile, smoke: true })
                        }
                        type="radio"
                        name="smoker"
                      />
                      <span className="checkmarkOC"></span>
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label htmlFor="no" className="containerOC">
                      No
                      <input
                        type="radio"
                        name="smoker"
                        checked={profile?.smoke === false}
                        onChange={({ target }) =>
                          setProfile({ ...profile, smoke: false })
                        }
                      />
                      <span className="checkmarkOC"></span>
                    </label>
                  </div>
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3">
                  <Label htmlFor="d-block mb-3">Do you drink alcohol?</Label>
                  <div className="form-check form-check-inline">
                    <label className="containerOC">
                      Yes
                      <input
                        checked={profile?.alcohol}
                        onChange={({ target }) =>
                          setProfile({ ...profile, alcohol: true })
                        }
                        type="radio"
                        name="drinker"
                      />
                      <span className="checkmarkOC"></span>
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="containerOC">
                      No
                      <input
                        type="radio"
                        checked={profile?.alcohol === false}
                        name="drinker"
                        onChange={({ target }) =>
                          setProfile({ ...profile, alcohol: false })
                        }
                      />
                      <span className="checkmarkOC"></span>
                    </label>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={18}>
                <h5 className="mt-5 mb-2">
                  Have you ever diagnosed with any of the following? Check all
                  that apply:
                </h5>
                <div className="hours-rows">
                  {Object.entries(healthIssues).map(problemMap(setProfile))}
                </div>
              </Col>
            </Row>

            <br />
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Input
                    value={profile?.other_problems}
                    onChange={({ target }) =>
                      setProfile({ ...profile, other_problems: target.value })
                    }
                    type="textarea"
                    maxLength="225"
                    rows="3"
                    placeholder="Other Health Issues or Details."
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={18}>
                <h5 className="mt-5 mb-2">
                  What Conditions Have Your Family Been Diagnosed With? Check
                  all that apply:
                </h5>
                <div className="hours-rows">
                  {Object.entries(healthIssues).map(
                    problemMap(setProfile, "family_")
                  )}
                </div>
              </Col>
            </Row>

            <br />
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Input
                    value={profile?.family_other_problems}
                    onChange={({ target }) =>
                      setProfile({
                        ...profile,
                        family_other_problems: target.value,
                      })
                    }
                    type="textarea"
                    maxLength="225"
                    rows="3"
                    placeholder="Other Family History or Details."
                  />
                </div>
              </Col>
            </Row>
            <div>
              <button onClick={handleSubmit} className="btn btnLog w-md">
                Save Profile
              </button>
            </div>
            {/* <!-- <a className="LogPgTx" href='./Login.html'>Already Have an Account?</a>
                            <div className='input-group mb-3'></div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                                <label className="form-check-label" htmlFor="inlineCheckbox1">I agree with the <a href='./Login.html'>Terms and Conditions</a></label>
                            </div> --> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HealthQuestionnaire;
