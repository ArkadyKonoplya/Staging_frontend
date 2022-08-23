// const daysOfWeeks = ['Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
import {
  Col,
  Row,
  Card,
  CardBody,
  Modal,
  Table,
  DropdownItem,
  DropdownMenu,
  Dropdown,
} from "reactstrap";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useState, useEffect } from "react";
import { stringTruncate } from "../../helpers";

const PatientDoctorInfo = ({ toggle, newDoctors, fetchNewDoctors, checkIdentityToRender }) => {
  const [openDoctorInfo, setOpenDoctorInfo] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState({});
  const [searchResponse, setSearchResponse] = useState(
    "Select State and Specialty. Doctor list search results will appear here..."
  );

  const stateOptionGroup = [
    {
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

  const specialtyOptionGroup = [
    {
      options: [
        { label: "Neurology", value: "Neurology" },
        {
          label: "Psychiatry",
          value: "Psychiatry",
        },
        { label: "Addiction Recovery", value: "Addiction Recovery" },
        // { label: "Allergy and Immunology", value: "Allergy and Immunology" },
      ],
    },
  ];

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const togScroll = () => {
    setOpenDoctorInfo(false);
    removeBodyCss();
  };

  const searchDoctors = () => {
    fetchNewDoctors(selectedSpecialty, selectedState, setSearchResponse);
    // setSearchResponse("Loading results...");
    // const filteredDoctors = [];
    // doctors.forEach((val) => {
    //   val.state.forEach((element) => {
    //     if (element === selectedState) {
    //       if (val.specialty === selectedSpecialty) {
    //         filteredDoctors.push(val);
    //       }
    //     }
    //   });
    // });
    // if (filteredDoctors.length === 0) {
    //   setSearchResponse(
    //     `Currently interviewing ${selectedSpecialty} Providers in the state of ${selectedState}`
    //   );
    // }
    // setSearchResults(filteredDoctors);
  };

  const resetSearch = () => {
    setSelectedDoctor({});
    setSelectedSpecialty("");
    setSelectedState("");
    setSearchResponse(
      "Select State and Specialty. Doctor list search results will appear here..."
    );
  };

  useEffect(() => {
    if (selectedSpecialty.length !== 0) searchDoctors();
  }, [selectedSpecialty]);

  useEffect(() => {
    if (selectedState.length !== 0) searchDoctors();
  }, [selectedState]);

  const customStyles = {
    control: (styles) => ({
      ...styles,
      borderRadius: 12,
    }),
    input: (styles) => ({ ...styles }),
  };

  return (
    <Row>
      <Col lg="12">
        <Card
          className="find-doctors-card"
          style={{
            borderRadius: 22,
          }}
        >
          <h4 className="card-header card-title">
            Find Your Doctor{" "}
            {/* <a onClick={resetSearch} style={{ fontSize: 15, color: "blue" }}> */}
            <a
              onClick={resetSearch}
              style={{ fontSize: 15, color: "blue", cursor: "pointer" }}
            >
              Reset
            </a>
          </h4>
          <CardBody>
            <Col lg={12} className="mb-2 mt-0">
              <Select
                value={
                  selectedState.length !== 0
                    ? { value: selectedState, label: selectedState }
                    : selectedState
                }
                onChange={({ value }) => {
                  setSelectedState(value);
                }}
                options={stateOptionGroup}
                classNamePrefix="select2-selection"
                placeholder="Select State..."
                styles={customStyles}
                isDisabled={checkIdentityToRender}
              />
            </Col>

            {/* <Col lg={12} className="mb-2">
              <Select
                value={
                  selectedSpecialty.length !== 0
                    ? { value: selectedSpecialty, label: selectedSpecialty }
                    : selectedSpecialty
                }
                onChange={({ value }) => {
                  setSelectedSpecialty(value);
                }}
                options={specialtyOptionGroup}
                classNamePrefix="select2-selection"
                placeholder="Select Specialty..."
                isDisabled={selectedState.length === 0}
                styles={customStyles}
              />
            </Col> */}
            <Col lg={12} className="mb-0">
              <h5 className="card-title">Search Results</h5>
              {newDoctors.length === 0 && (
                <p className="card-title-desc">
                  <i>{searchResponse}</i>
                </p>
              )}

              <SimpleBar
                forceVisible="y"
                autoHide={false}
                style={{ maxHeight: "140px" }}
              >
                {newDoctors.map((value) => {
                  const { id, image, first_name, last_name } = value;
                  return (
                    <Dropdown
                      key={id}
                      container="body"
                      isOpen={false}
                      toggle={() => {
                        console.log(value, 'value >>>>');
                        setSelectedDoctor(value);
                        setOpenDoctorInfo(true);
                      }}
                    >
                      <DropdownItem
                        className="d-flex"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="me-2" style={{ borderRadius: 10 }}>
                          <img
                            className="rounded-circle avatar-sm"
                            src={image}
                            alt={first_name}
                            width={"30"}
                            height={"30"}
                            style={{
                              objectFit: "cover",
                              cursor: "cell",
                            }}
                          />
                        </div>
                        <div className="">
                          <p>{`${first_name} ${last_name}`}</p>
                          {/* <p>
                            {stringTruncate(`${firstname} ${lastname}`, 15)}
                          </p> */}
                        </div>
                      </DropdownItem>
                    </Dropdown>
                  );
                })}
              </SimpleBar>
            </Col>
            {openDoctorInfo && (
              <Modal
                isOpen={openDoctorInfo}
                toggle={() => {
                  togScroll();
                }}
                scrollable={true}
              >
                <div className="text-center modal-header">
                  <h5 className="modal-title mt-0 ">Doctor Information</h5>
                </div>
                <div className="modal-body">
                  <Col lg={12}>
                    <CardBody>
                      <div className="p-2">
                        <div className="text-center">
                          <div className="avatar-md mx-auto">
                            <div className="avatar-title avatar-sm rounded-circle">
                              <img
                                src={selectedDoctor?.image}
                                alt={selectedDoctor?.first_name}
                                width={"150"}
                                height={"150"}
                                class="rounded-circle"
                                style={{
                                  objectFit: "cover",
                                  cursor: "cell",
                                }}
                              />
                            </div>
                          </div>
                          <div className="p-2 mt-4">
                            <h4>{`${selectedDoctor?.first_name} ${selectedDoctor?.last_name}`}</h4>
                            <p>{selectedDoctor?.board_certified_speciality}</p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Col>
                  <Col lg={12}>
                    <h4 className="card-title mt-0">Available Days</h4>

                    <div className="table-responsive  mt-1">
                      <table width="100%" className=" m-0">
                        <thead>
                          <tr>
                            <th>Day</th>
                            <th>From</th>
                            <th>To</th>
                          </tr>
                        </thead>
                        {/* <tbody>
                          {selectedDoctor?.available_days.map((day, i) => (
                            <tr>
                              <th scope="row">{i + 1}</th>
                              <td>{day.day}</td>
                              <td>{day.from}</td>
                              <td>{day.to}</td>
                            </tr>
                          ))}
                        </tbody> */}
                      </table>
                    </div>
                  </Col>
                  <hr />

                  <Col lg={12} className="mt-4">
                    <h4 className="card-title mt-0">Biography</h4>
                    <p>{selectedDoctor?.about}</p>
                  </Col>

                  <div className="modal-footer">
                    <button
                      type="button"
                      style={{
                        backgroundColor: "palevioletred",
                      }}
                      className="btn waves-effect waves-light"
                      onClick={() => {
                        toggle();
                        setOpenDoctorInfo(false);
                      }}
                    >
                      Schedule Consult
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setOpenDoctorInfo(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default PatientDoctorInfo;
