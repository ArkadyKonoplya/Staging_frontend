import { useState, useEffect } from "react";
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
} from "reactstrap";
import ZipCodeTimezone from "zipcode-to-timezone";
import moment from "moment-timezone";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import iconLogo from "../../Images/TelePsycRXnameWicon500by300.jpg";
import axiosInstance from "../../api/TelePsyAPI";
import ProfileBoxPA from "../../components/patients/ProfileBoxPA";

import {
  exceptionToaster,
  localStorageHelper,
  constantImages,
  constantTexts,
} from "../../helpers";

export default function HealthQuestionnaire({ setProfile, profile }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [licUpload, setLicUpload] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value) => {
    setProfile(value);
  };

  useEffect(() => {
    axiosInstance
      .get(`accounts/doctors/${user.doctor_id}/`)
      .then((response) => response.data)
      .then(setProfile);
  }, []);
  console.log({ profile });
  const titles = [
    "*Choose your Title",
    "MD - Psychiatry",
    "MD - Neurology",
    "MD - Child and Adolescent Psychiatry",
    "MD - Adult Psychiatry",
    "MD - Geriatric Psychiatry",
    "MD - Addiction Psychiatry",
    "MD - Emergency Psychiatry",
    "DO - Psychiatry",
    "DO - Neurology",
    "DO - Child and Adolescent Psychiatry",
    "DO - Adult Psychiatry",
    "DO - Geriatric Psychiatry",
    "DO - Addiction Psychiatry",
    "DO - Emergency Psychiatry",
    "APRN - Psychiatry",
    "PA - Psychiatry",
    "PHD - Psychology",
  ];

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

  const licenses = [
    {
      label: "*State of Licenses",
      options: [
        { label: "Alabama", value: "Alabama" },
        { label: "Alaska", value: "Alaska" },
        { label: "Arizona", value: "Arizona" },
        { label: "Arkansas", value: "Arkansas" },
        { label: "California", value: "California" },
        { label: "Colorado", value: "Colorado" },
        { label: "Connecticut", value: "Connecticut" },
        { label: "Delaware", value: "Delaware" },
        { label: "Florida", value: "Florida" },
        { label: "Georgia", value: "Georgia" },
        { label: "Hawaii", value: "Hawaii" },
        { label: "Idaho", value: "Idaho" },
        { label: "Illinois", value: "Illinois" },
        { label: "Indiana", value: "Indiana" },
        { label: "Iowa", value: "Iowa" },
        { label: "Kansas", value: "Kansas" },
        { label: "Kentucky", value: "Kentucky" },
        { label: "Louisiana", value: "Louisiana" },
        { label: "Maine", value: "Maine" },
        { label: "Maryland", value: "Maryland" },
        { label: "Massachusetts", value: "Massachusetts" },
        { label: "Michigan", value: "Michigan" },
        { label: "Minnesota", value: "Minnesota" },
        { label: "Mississippi", value: "Mississippi" },
        { label: "Missouri", value: "Missouri" },
        { label: "Montana", value: "Montana" },
        { label: "Nebraska", value: "Nebraska" },
        { label: "Nevada", value: "Nevada" },
        { label: "New Hampshire", value: "New Hampshire" },
        { label: "New Jersey", value: "New Jersey" },
        { label: "New Mexico", value: "New Mexico" },
        { label: "New York", value: "New York" },
        { label: "North Carolina", value: "North Carolina" },
        { label: "North Dakota", value: "North Dakota" },
        { label: "Ohio", value: "Ohio" },
        { label: "Oklahoma", value: "Oklahoma" },
        { label: "Oregon", value: "Oregon" },
        { label: "Pennsylvania", value: "Pennsylvania" },
        { label: "Rhode Island", value: "Rhode Island" },
        { label: "South Carolina", value: "South Carolina" },
        { label: "South Dakota", value: "South Dakota" },
        { label: "Tennessee", value: "Tennessee" },
        { label: "Texas", value: "Texas" },
        { label: "Utah", value: "Utah" },
        { label: "Vermont", value: "Vermont" },
        { label: "Virginia", value: "Virginia" },
        { label: "Washington", value: "Washington" },
        { label: "West Virginia", value: "West Virginia" },
        { label: "Wisconsin", value: "Wisconsin" },
        { label: "Wyoming", value: "Wyoming" },
      ],
    },
  ];

  const [joinWaitlist, setJoinWaitList] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitted Data"); // get out the values of selected state
    // selectedLicensesState.Alert

    // validate if the number of states selected he/she has included the license number for each of them
    console.log("Profile: ", profile);
    if (profile.states.length !== profile.state_license_numbers.length) {
      return exceptionToaster(
        "error",
        "you need to include your License for the selected state(s)"
      );
    }

    const waitListed = {
      user: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      state_of_residence: profile.state,
      states_of_license: profile.states,
      doctor_id: user.doctor_id,
    };
    console.log(waitListed);

    if (joinWaitlist === true) {
      console.log("Waitlisted");
      await axiosInstance.post(
        `telepsycrx_marketing/doctor-waitlist/`,
        waitListed
      );
    }
    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      // if (
      //   ["phone_activation_expired", "activation_expired"].indexOf(key) > -1
      // ) {
      //   // Skip Keys that are braking validation
      //   return;
      // }
      formData.append(key, value);
    });
    if (licUpload) {
      formData.append("license_pdf_upload", licUpload);
    }
    console.log("Form Data");

    axiosInstance
      .patch(`accounts/doctors/${user.doctor_id}/`, formData)
      .then(function (response) {
        console.log(`Axios response: ${response.status}`);

        // Show success message:
        if (response.status === 201) {
          //   Clear the form when the message is saved
          console.log("Saved Profile");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const triggerUpdate = (value) => {
    console.log(value, "trigger Update here");
    // setProfileUpdate(value);
    setProfile((prevState) => ({ ...prevState, image: value }));
  };

  // useEffect(() => {
  //   const localTime = moment(new Date());
  //   const timeValue = localTime.tz(`America/${state}`).format("ha z");
  //   setProfile({ ...profile, timezone: timeValue })
  // }, [state]);

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

  const trimConvertAndSetLicenseNumbers = (target) => {
    const licenseNumbers = target.value.replace(/\s/g, "");
    const convertedLicenseNumbers = licenseNumbers.split(",");
    setProfile({ ...profile, state_license_numbers: convertedLicenseNumbers });
  };

  return (
    <section>
      <div className="container">
        <div className="row d-flex justify-content-center row-box">
          <div className="mt-1 col-lg-7 p-5 center">
            <ProfileBoxPA
              user={user}
              profileUpdate={profile}
              setProfileUpdate={triggerUpdate}
              showLogo={true}
              enableEdit={true}
            />
            <h2 className="mb-3 center textAlignment">
              Thank you for being a Provider with TelePsycRX.
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
                    value={profile?.title}
                    id="formrow-duration"
                    className="form-select form-control"
                    onChange={({ target }) =>
                      setProfile({ ...profile, title: target.value })
                    }
                  >
                    {titles.map((title) => (
                      <option>{title}</option>
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
                  <Input
                    type="email"
                    className="form-control"
                    id="formrow-email-Input"
                    placeholder="* Email"
                    value={profile?.email}
                    onChange={({ target }) =>
                      setProfile({ ...profile, email: target.value })
                    }
                  />
                </div>
              </Col>
            </Row>

            <h4 className="mt-3 textAlignment">Address Information</h4>

            <br />
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Address Line 1"
                    value={profile?.address1}
                    onChange={({ target }) =>
                      setProfile({ ...profile, address1: target.value })
                    }
                  />
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Address Line 2"
                    value={profile?.address2}
                    onChange={({ target }) =>
                      setProfile({ ...profile, address2: target.value })
                    }
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="City"
                    value={profile?.city}
                    onChange={({ target }) =>
                      setProfile({ ...profile, city: target.value })
                    }
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
              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Zip Code"
                    value={profile?.zip}
                    onChange={
                      ({ target }) => setAndGenerateTimezoneFromZip(target)
                      // console.log(setAndGenerateTimezoneFromZip)
                    }
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Fax Number"
                    value={profile?.fax_number}
                    onChange={({ target }) =>
                      setProfile({ ...profile, fax_number: target.value })
                    }
                  />
                </div>
              </Col>
            </Row>
            <h4 className="mt-3 textAlignment">Practice Information</h4>
            <br />
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="*Board Cert. Specialty"
                    value={profile?.board_certified_speciality}
                    onChange={({ target }) =>
                      setProfile({
                        ...profile,
                        board_certified_speciality: target.value,
                      })
                    }
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Flatpickr
                    className="form-control"
                    id="formrow-date-Input"
                    placeholder="*Practicing Since"
                    value={profile.since}
                    onChange={(date) =>
                      setProfile((prevProfile) => ({
                        ...prevProfile,
                        since: moment(date[0]).format("YYYY-MM-DD"),
                      }))
                    }
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
                  <Select
                    value={(profile.states || []).map((x) => ({
                      value: x,
                      label: x,
                    }))}
                    isMulti={true}
                    onChange={(e) => {
                      setProfile({ ...profile, states: e.map((x) => x.value) });
                    }}
                    options={licenses}
                    styles={customStyles}
                    isSearchable={true}
                    classNamePrefix="select2-selection"
                    placeholder="*State(s) of License"
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <CreatableSelect
                    options={[]}
                    isMulti
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        state_license_numbers: e.map((x) => x.value),
                      });
                    }}
                    isSearchable={true}
                    value={(profile.state_license_numbers || []).map((x) => ({
                      value: x,
                      label: x,
                    }))}
                    controlShouldRenderValue={true}
                    placeholder="State license numbers"
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="*NPI"
                    value={profile?.npi}
                    onChange={({ target }) =>
                      setProfile({ ...profile, npi: target.value })
                    }
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="*DEA"
                    value={profile?.dea}
                    onChange={({ target }) =>
                      setProfile({ ...profile, dea: target.value })
                    }
                  />
                </div>
              </Col>
              <Col sm={12}>
                <div className="mt-3">
                  <Label
                    htmlFor="formFile"
                    className="form-label textAlignment"
                  >
                    Upload Your License in PDF:
                  </Label>
                  <Input
                    onChange={({ target }) => {
                      setLicUpload(target.files[0]);
                    }}
                    className="form-control"
                    type="file"
                    id="formFile"
                  />
                </div>
              </Col>
            </Row>
            <h4 className="mt-3 mb-2 textAlignment">Provider Biography</h4>
            <br />
            <Row>
              <Col md={12}>
                <div className="mb-3">
                  <Input
                    type="textarea"
                    maxLength="225"
                    rows="3"
                    value={profile?.about}
                    onChange={({ target }) =>
                      setProfile({ ...profile, about: target.value })
                    }
                    placeholder="Tell us about yourself"
                  />
                </div>
              </Col>
            </Row>
            <div>
              <button onClick={handleSubmit} className="btn btnLog w-md">
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
