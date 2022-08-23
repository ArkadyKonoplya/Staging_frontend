import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Card,
  Form,
  FormGroup,
  Label,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Modal,
} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link } from "react-router-dom";
import Sidebar from "../../components/patients/SidebarPatient";
import Header from "../../components/patients/HeaderPatient";
import PricingCard from "../../components/patients/PricingCard";
import nameWlogo from "../../Images/TelePsycRXnameWicon500by300.jpg";
import { SubscriptionContext } from "../../helpers/subscriptionContext";

const Checkout = (props) => {
  const [activeTab, setactiveTab] = useState("1");
  const [selectedGroup, setselectedGroup] = useState(null);
  const [priceData, setPriceData] = useState({});
  const [hasAgreedTerms, setHasAgreedTerms] = useState("");
  const [modal_scroll, setmodal_scroll] = useState(false);
  const [loadFeatures, setLoadFeatures] = useState(true);
  const [successMessageShow, setSuccessMessageShow] = useState(false);
  const [failureMessageShow, setFailureMessageShow] = useState(false);
  const { userContext, setUserContext } = useContext(SubscriptionContext);
  const history = useHistory();
  // payment info
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvvCode, setCvvCode] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");

  const params = new URLSearchParams(window.location.search);

  //   Medication & Care Counseling
  const SupportCounseling = "79eb9b90-e5e9-4dbd-ab53-eeb13676ab58";
  const SupportCounseling1 = "d85902f5-5283-4e26-9957-b1437a0088fe";
  const SupportCounseling2 = "12233e64-4a49-482c-82f5-8d24c3064404";

  //   Therapy
  const Therapy = "2be20e6a-a78c-4657-8ae9-0ae34aa11219";
  const Therapy1 = "2dffdc8c-5883-4125-8333-2738b1961e49";
  const Therapy2 = "426d27a4-06e4-45fb-87e9-52f1d0213d49";

  const filterPrice = (key) => {
    switch (key) {
      case SupportCounseling:
        setPriceData({
          title: "Support Counseling",
          duration: "month",
          type: "main",
          name: null,
          type: "main",
          cost: "$100",
          amount: "100",
          features: [
            {
              title:
                "Evaluation, diagnosis, and prescription, if needed, by a medical provider",
            },
            {
              title:
                "Monthly medication review and updated prescriptions, if needed.",
            },
            {
              title:
                "Regular video/phone sessions with an assigned care counselor ",
            },
            {
              title:
                "Evidence-based behavioral health counseling & regular progress checks",
            },
          ],
        });
        setLoadFeatures(false);
        break;

      case SupportCounseling1:
        setPriceData({
          title: "Support Counseling",
          type: "category",
          name: "Pay As You Use",
          duration: "month",
          cost: "$100",
          amount: "100",
          features: [
            {
              title:
                "Evaluation, diagnosis, and prescription, if needed, by a medical provider",
            },
            {
              title:
                "Monthly medication review and updated prescriptions, if needed.",
            },
            {
              title:
                "Regular video/phone sessions with an assigned care counselor ",
            },
            {
              title:
                "Evidence-based behavioral health counseling & regular progress checks",
            },
          ],
        });
        setLoadFeatures(false);
        break;

      case SupportCounseling2:
        setPriceData({
          title: "Support Counseling",
          type: "category",
          name: "Add Medication Care",
          duration: "month",
          cost: "$100",
          amount: "100",
          features: [
            {
              title:
                "Evaluation, diagnosis, and prescription, if needed, by a medical provider",
            },
            {
              title:
                "Monthly medication review and updated prescriptions, if needed.",
            },
            {
              title:
                "Regular video/phone sessions with an assigned care counselor ",
            },
            {
              title:
                "Evidence-based behavioral health counseling & regular progress checks",
            },
          ],
        });
        setLoadFeatures(false);
        break;
      case Therapy:
        setPriceData({
          title: "Therapy",
          duration: "month",
          type: "main",
          name: null,
          cost: "$260",
          amount: "260",
          features: [
            { title: "Weekly video/phone sessions with a licensed therapist" },
            { title: "Chat securely with your therapist anytime" },
            { title: "Regular progress tracking by your therapist" },
          ],
        });
        setLoadFeatures(false);
        break;

      case Therapy1:
        setPriceData({
          title: "Therapy",
          duration: "month",
          type: "category",
          name: "Pay As You Use",
          cost: "$260",
          amount: "260",
          features: [
            { title: "Weekly video/phone sessions with a licensed therapist" },
            { title: "Chat securely with your therapist anytime" },
            { title: "Regular progress tracking by your therapist" },
          ],
        });
        setLoadFeatures(false);
        break;
      case Therapy2:
        setPriceData({
          title: "Therapy",
          duration: "month",
          type: "category",
          name: "Add Medication Care",
          cost: "$260",
          amount: "260",
          features: [
            { title: "Weekly video/phone sessions with a licensed therapist" },
            { title: "Chat securely with your therapist anytime" },
            { title: "Regular progress tracking by your therapist" },
          ],
        });
        setLoadFeatures(false);
        break;

      default:
        setPriceData({
          title: "Therapy",
          duration: "month",
          type: "category",
          name: "Add Medication Care",
          cost: "$260",
          amount: "260",
          features: [
            { title: "Weekly video/phone sessions with a licensed therapist" },
            { title: "Chat securely with your therapist anytime" },
            { title: "Regular progress tracking by your therapist" },
          ],
        });
        setLoadFeatures(false);
        break;
    }
  };

  const handleCheckboxChange = (e) => {
    setHasAgreedTerms(e.target.checked);
  };
  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const togScroll = () => {
    setmodal_scroll(!modal_scroll);
    removeBodyCss();
  };

  const submitPayment = () => {
    const payload = {
      cardNumber,
      nameOnCard,
      expDate,
      cvvCode,
      firstname,
      lastName,
      phoneNumber,
      address,
      zip,
      amount: priceData.amount,
    };
    if (cardNumber === "") {
      setFailureMessageShow(true);
    } else {
      setSuccessMessageShow(true);
      setUserContext((prevState)=> ({...prevState, is_subscribed: true}))
    }
    console.log(payload, "payload");
  };
console.log({userContext})
  useEffect(() => {
    let id = params.get("info");
    filterPrice(id);
  }, []);

  return (
    <section className="FrontPgs">
      <main>
        <section className="Form my-4">
          <div className="container">
            <div className="row justify-content-center">
              <Container fluid>
                <Card
                  className="plan-box"
                  style={{
                    borderRadius: 37,
                  }}
                >
                  <CardBody className="p-4">
                    <div
                      style={{
                        display: "block",
                        margin: "auto",
                      }}
                      className="col-lg-4 px-3 center"
                    >
                      <img
                        src={nameWlogo}
                        alt="TelePsycRX"
                        className="py-3 logo"
                      ></img>
                    </div>
                    <Row>
                      <Col sm={4}>
                        <CardBody>
                          {loadFeatures ? (
                            <h3>Loading...</h3>
                          ) : (
                            <div className="row cal">
                              <Col>
                                <Card
                                  className="plan-box"
                                  style={{
                                    borderRadius: 37,
                                  }}
                                >
                                  <CardBody className="p-4">
                                    <div className="d-flex">
                                      <div className="flex-grow-1">
                                        <h5>
                                          <strong>{priceData.title}</strong>
                                        </h5>
                                        <p>{priceData.name}</p>
                                      </div>
                                    </div>
                                    <div className="py-4">
                                      <h4>
                                        {priceData.cost}/{" "}
                                        <span className="font-size-13">
                                          Each {priceData.duration}
                                        </span>
                                      </h4>
                                      <div className="plan-features mt-3">
                                        {priceData &&
                                          priceData.features.map(
                                            (feature, key) => (
                                              <p key={"_feature_" + key}>
                                                - {feature?.title}
                                              </p>
                                            )
                                          )}
                                      </div>
                                    </div>
                                  </CardBody>
                                </Card>
                              </Col>
                            </div>
                          )}
                        </CardBody>
                      </Col>
                      <Col sm={8}>
                        <div>
                          <CardTitle>
                            <b>Payment information</b>
                          </CardTitle>

                          <div
                            className="p-4 border"
                            style={{
                              borderRadius: 37,
                            }}
                          >
                            <Form>
                              <FormGroup className="mb-0">
                                <Label htmlFor="cardnumberInput">
                                  Card Number
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="cardnumberInput"
                                  placeholder="0000 0000 0000 0000"
                                  onChange={({ target: { value } }) =>
                                    setCardNumber(value)
                                  }
                                />
                              </FormGroup>
                              <Row>
                                <Col lg="6">
                                  <FormGroup className="mt-4 mb-0">
                                    <Label htmlFor="cardnameInput">
                                      Name on card
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="cardnameInput"
                                      placeholder="e.g Jordan Khan"
                                      onChange={({ target: { value } }) =>
                                        setNameOnCard(value)
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg="3">
                                  <FormGroup className=" mt-4 mb-0">
                                    <Label htmlFor="expirydateInput">
                                      Expiry date
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="expirydateInput"
                                      placeholder="MM/YY"
                                      onChange={({ target: { value } }) =>
                                        setExpDate(value)
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg="3">
                                  <FormGroup className="mt-4 mb-0">
                                    <Label htmlFor="cvvcodeInput">
                                      CVV Code
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="cvvcodeInput"
                                      placeholder="Enter CVV Code"
                                      onChange={({ target: { value } }) =>
                                        setCvvCode(value)
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Row>
                                <Col lg="6">
                                  <FormGroup className="mt-4 mb-0">
                                    <Label htmlFor="cardnameInput">
                                      First name
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      // id="cardnameInput"
                                      placeholder="e.g Jordan"
                                      onChange={({ target: { value } }) =>
                                        setFirstName(value)
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg="6">
                                  <FormGroup className=" mt-4 mb-0">
                                    <Label htmlFor="expirydateInput">
                                      Last name
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      // id="expirydateInput"
                                      placeholder="e.g Khan"
                                      onChange={({ target: { value } }) =>
                                        setLastName(value)
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg="3">
                                  <FormGroup className="mt-4 mb-0">
                                    <Label htmlFor="tel">Phone Number</Label>
                                    <Input
                                      type="number"
                                      className="form-control"
                                      // id="cvvcodeInput"
                                      placeholder="e.g 01904 717700"
                                      onChange={({ target: { value } }) =>
                                        setPhoneNumber(value)
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg="6">
                                  <FormGroup className="mt-4 mb-0">
                                    <Label htmlFor="cvvcodeInput">
                                      Address
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      // id="cvvcodeInput"
                                      placeholder="e.g North Yorkshire Hull Rd"
                                      onChange={({ target: { value } }) =>
                                        setAddress(value)
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                                <Col lg="3">
                                  <FormGroup className="mt-4 mb-0">
                                    <Label htmlFor="tel">Zip Code</Label>
                                    <Input
                                      type="number"
                                      className="form-control"
                                      // id="cvvcodeInput"
                                      placeholder="Enter Zip Code"
                                      onChange={({ target: { value } }) =>
                                        setZip(value)
                                      }
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>
                            </Form>
                          </div>
                        </div>
                        <br />
                        <div className="form-check form-check-inline textAlignment">
                          <input
                            onChange={handleCheckboxChange}
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheckbox1"
                            value={hasAgreedTerms}
                            defaultChecked={hasAgreedTerms}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheckbox1"
                          >
                            I agree to the{" "}
                            <a
                              href={"#"}
                              onClick={() => {
                                togScroll();
                              }}
                            >
                              Membership Terms
                            </a>
                          </label>
                          <br />
                          <Modal
                            isOpen={modal_scroll}
                            toggle={() => {
                              togScroll();
                            }}
                            scrollable={true}
                            size="lg"
                          >
                            <div className="modal-header">
                              <h5 className="modal-title mt-0">
                                TELEPSYCRX – MEMBERSHIP AGREEMENT
                              </h5>
                            </div>
                            <div className="modal-body">
                              <p>
                                This Membership Agreement (“Agreement”) is made
                                by and between and TelePsycRX, LLC, a Nevada
                                limited liability company (“TelePsycRX”, “We”,
                                “Us” or “Our”) and You (“Patient”, “You” “Your”
                                or “I”) and it consists of the terms and
                                conditions below, as well as the online Terms
                                and Conditions of Use and Privacy Policy on Our
                                website. This Agreement It is effective on the
                                date You sign up for Our services on our website
                                or mobile app. You are agreeing to the
                                following:
                              </p>

                              <p
                                style={{
                                  textDecorationLine: "underline",
                                }}
                              >
                                Services
                              </p>
                              <p>
                                TelePsycRX is not a medical group and does not
                                provide medical care or treatment. We provide a
                                on-line platform to connect patients and mental
                                health providers, conduct telehealth consults
                                and therapy sessions, and send prescriptions to
                                Your pharmacy. Any telehealth consults obtained
                                through our website and/or App are provided by
                                independently contracted medical practitioners.
                                The details of this arrangement are fully set
                                forth in the Terms and Conditions of Use on Our
                                website.
                              </p>
                              <p
                                style={{
                                  textDecorationLine: "underline",
                                }}
                              >
                                Relationship of the Parties
                              </p>
                              <p>
                                Nothing in this Agreement is intended to be
                                construed to suggest that Patient and TelePsycRX
                                are partners or engaged in joint venture. We are
                                acting solely as an independent contractor
                                acting under Our own direction and control in
                                providing the Service to You. Neither We, nor
                                Our employees or contract personnel are Your
                                employees. We shall be responsible for all taxes
                                incurred while performing the Service, including
                                all applicable taxes required to be paid by an
                                employer. We shall not hold Ourselves out as
                                Your agent and We do not have any right, power
                                or authority to create any contractual
                                obligation on behalf of or binding upon You.
                              </p>
                              <div className="modal-header">
                                <h5 className="modal-title mt-0">
                                  MEMBERSHIP SERVICES
                                </h5>
                              </div>

                              <p
                                style={{
                                  textDecorationLine: "underline",
                                }}
                              >
                                Member Access Pages
                              </p>
                              <p>
                                To secure the right to access and use the
                                membership pages of the Website or the App, and
                                to maintain Your User Account in good standing
                                and receive the Services, You must be a member
                                of TelePsycRX’s paid Services (“Membership”).
                                With the exception of any free trial periods, We
                                will charge You a recurring membership fee in
                                exchange for Your right to access and use the
                                membership pages of the Website or the App in
                                accordance with this Agreement (“Membership
                                Fee”). We will charge the Membership Fee to Your
                                credit card or debit card on file with Us, as
                                identified in Your User Account; the payment
                                transaction will be facilitated through an
                                online payment processing application that is
                                provided by a third-party vendor(s) and
                                accessible through the Website and/or the App,
                                and You will receive a receipt through Your User
                                Account. As a Member, You hereby agree to abide
                                by Our policies and applicable laws. Any breach
                                of such policies or these Terms may result in
                                cancellation of Your Membership.
                              </p>

                              <p
                                style={{
                                  textDecorationLine: "underline",
                                }}
                              >
                                Membership Fees
                              </p>
                              <p>
                                The amount of each Membership Fee will be set by
                                TelePsycRX in its sole discretion. By accepting
                                the terms and conditions of this Terms of Use,
                                You understand and acknowledge that We reserves
                                the right, but not the obligation, to increase
                                its Membership Fee rate amounts at any time and
                                as We see fit in its sole discretion.
                                <br />
                                <p
                                  style={{
                                    textDecorationLine: "underline",
                                  }}
                                >
                                  Discounts
                                </p>
                                TelePsycRX may periodically offer discounts to
                                its Membership Services in the form of free
                                trial periods or discounted Membership Fees.
                                Upon the expiration of any such discount, You
                                further agree to the terms and conditions of
                                this Terms of Use and pay the applicable
                                Membership Fees in order to continue to receive
                                Our paid Services.
                                <br />
                                <p
                                  style={{
                                    textDecorationLine: "underline",
                                  }}
                                >
                                  Automatic Renewals
                                </p>
                                Your Membership will automatically renew on a
                                monthly basis at the end of an existing
                                subscription period. TelePsycRX will bill You
                                for the subsequent membership period on a
                                monthly basis. You are responsible for paying
                                for this. Should You cancel Your Membership (see
                                below) before the end of the current billing
                                cycle, then access to the Membership Services
                                will be removed, but You will continue to have
                                access to the membership pages as they may
                                contain personal health information.
                              </p>
                              <div className="modal-footer">
                                <input
                                  onChange={handleCheckboxChange}
                                  className="form-check-input"
                                  type="checkbox"
                                  id="inlineCheckbox1"
                                  value={hasAgreedTerms}
                                  defaultChecked={hasAgreedTerms}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="inlineCheckbox1"
                                >
                                  I agree to the Membership Terms{" "}
                                </label>
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
                        </div>
                        <br />
                        <button
                          disabled={!hasAgreedTerms}
                          className="btn btnLog w-md"
                          onClick={submitPayment}
                        >
                          Submit Payment
                        </button>

                        {successMessageShow ? (
                          <SweetAlert
                            title="Your Payment Has Been Received"
                            success
                            confirmBtnBsStyle="success"
                            cancelBtnBsStyle="danger"
                            onConfirm={() => {
                              setSuccessMessageShow(false);
                              history.push("/patient-dashboard");
                            }}
                            onCancel={() => {
                              setSuccessMessageShow(false);
                            }}
                          >
                            <h4>Thank you!</h4>
                            <p className="text-muted">
                              A confirmation has been sent to your email.
                            </p>
                          </SweetAlert>
                        ) : null}

                        {failureMessageShow ? (
                          <SweetAlert
                            title={
                              <span>
                                Unable to process your card information
                              </span>
                            }
                            warning
                            onConfirm={() => {
                              setFailureMessageShow(false);
                            }}
                          >
                            Please check your card information and try again
                          </SweetAlert>
                        ) : null}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Container>
            </div>
          </div>
        </section>
      </main>
    </section>
  );
};

export default Checkout;
