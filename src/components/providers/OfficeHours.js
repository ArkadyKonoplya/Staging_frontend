// const daysOfWeeks = ['Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
import {
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  Label,
  Button,
  Form,
  Input,
  InputGroup,
  CardHeader,
  FormGroup,
  Modal as ModalBootstrap,
  Table,
} from "reactstrap";
import { useState } from "react";

// {daysOfWeeks.map((daysOfWeek) => <h6 className="dayOH">{daysOfWeek}</h6>)}
const timesOHs = [
  "8:00am",
  "9:00am",
  "10:00am",
  "11:00am",
  "12:00pm",
  "1:00pm",
  "2:00pm",
  "3:00pm",
  "4:00pm",
  "5:00pm",
];
// {timesOHs.map((timesOH) => <option>{timesOH}</option>)}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const OfficeHours = ({
  hoursData,
  setHoursData,
  officeIsActive,
  setOfficeIsActive,
  isApproved,
  isPartner,
}) => {
  const updateHour = (day, ops, event) => {
    setHoursData((prevData) => ({
      ...prevData,

      [day]: {
        ...prevData[day],
        closed:
          ops === "open" &&
          timesOHs.indexOf(event.target.value) >
            timesOHs.indexOf(prevData[day].closed)
            ? event.target.value
            : prevData[day].closed,
        [ops]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
    }));
  };

  const [acceptingNewPatients, setAcceptingNewPatients] = useState(false);

  // console.log(hoursData);
  return (
    <Row>
      <Card>
        <Col lg={4}>
          <h5>Office Hours</h5>
        </Col>
        <Row>
          <Col lg="6">
            <FormGroup className="mb-3">
              <div className="form-check form-switch form-switch-lg mb-3">
                <input
                  type="checkbox"
                  className="office-hours-toggle form-check-input"
                  id="customSwitchsizelg"
                  defaultChecked
                  onChange={(e) => {
                    setOfficeIsActive(e.target.checked);
                  }}
                  checked={officeIsActive}
                  disabled={!isApproved || isPartner}
                />
                <Label
                  className="form-check-label"
                  htmlFor="customSwitchsizelg"
                >
                  {" "}
                  Status
                </Label>
              </div>
            </FormGroup>
          </Col>
          <Col lg="6">
            <FormGroup className="mb-3">
              <div className="form-check form-switch form-switch-lg mb-3">
                <input
                  type="checkbox"
                  className="office-hours-toggle form-check-input"
                  id="customSwitchsizelg"
                  defaultChecked
                  onChange={({ target }) => {
                    setAcceptingNewPatients(!acceptingNewPatients);
                  }}
                  checked={acceptingNewPatients}
                />
                <Label
                  className="form-check-label"
                  htmlFor="customSwitchsizelg"
                >
                  {" "}
                  Accepting New Patients
                </Label>
              </div>
            </FormGroup>
          </Col>
        </Row>

        {officeIsActive && (
          <div style={{ width: "100%" }}>
            <div className="hoursTable">
              {Object.keys(hoursData).map((dow) => (
                <Col lg={12}>
                  {/* <Card> */}
                  <div key={dow} className="hours-row">
                    <h6 className="dayOH">{capitalizeFirstLetter(dow)}</h6>
                    <div className="hours-rows">
                      <select
                        value={hoursData[dow].open}
                        onChange={updateHour.bind(null, dow, "open")}
                        className="OHselect"
                        disabled={!isApproved || isPartner}
                      >
                        {timesOHs.map((timesOH) => (
                          <option disabled={!isApproved || isPartner}>
                            {timesOH}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="hours-rows">--</div>
                    <div className="hours-rows">
                      <select
                        value={hoursData[dow].closed}
                        onChange={updateHour.bind(null, dow, "closed")}
                        className="OHselect"
                        disabled={!isApproved || isPartner}
                      >
                        {timesOHs
                          .slice(timesOHs.indexOf(hoursData[dow].open))
                          .map((timesOH) => (
                            <option disabled={!isApproved || isPartner}>
                              {timesOH}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="hours-rows">
                      <label className="containerOC">
                        Office Closed
                        <input
                          type="checkbox"
                          onChange={updateHour.bind(null, dow, "isClosed")}
                          checked={hoursData[dow].isClosed}
                          disabled={!isApproved || isPartner}
                        ></input>
                        <span className="checkmarkOC"></span>
                      </label>
                    </div>
                  </div>
                  {/* </Card> */}
                </Col>
              ))}
            </div>
          </div>
        )}
      </Card>
    </Row>
  );
};

export default OfficeHours;
