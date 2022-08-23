import PropTypes from "prop-types";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "reactstrap";
import { SubscriptionContext } from "../../helpers/subscriptionContext";

const PricingCard = (props) => {
  const { userContext } = useContext(SubscriptionContext);
  return (
    <React.Fragment>
      <Col xl="4" md="6" className="p-3">
        <Card
          className="plan-box"
          style={{ borderColor: "#eeebe7", backgroundColor: "#eeebe7" }}
        >
          <CardBody className="p-1">
            <div className="text-center p-4 d-flex">
              <div className="flex-grow-0">
                <h5>
                  <b>{props.pricing.title}</b>
                </h5>
                {props.pricing.title === "Free Account" &&
                userContext?.is_subscribed === false ? (
                  <p
                    className="text-success"
                    style={{
                      position: "absolute",
                      alignContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <i>{"Active"}</i>
                  </p>
                ) : null}
              </div>
            </div>

            {/* if category is multiple map another */}

            {props.pricing.category === "multiple" ? (
              <>
                {props.pricing.sections.map((section, i) => (
                  <>
                    <div className="p-4 plan-features">
                      {section.name !== null && (
                        <p>
                          <b>{section.name}</b>
                        </p>
                      )}
                      {section.features.map((feature, key) => (
                        <p key={"_feature_" + key}>
                          <i className="bx bxs-circle text-dark me-2" />{" "}
                          {feature.title}
                        </p>
                      ))}
                    </div>
                    <div className="p-2 d-flex">
                      <div className="flex-grow-1">
                        <h6>
                          <b>
                            Pricing: <span>$</span> {section.price}/{" "}
                            <span className="font-size-13">
                              {section.duration}
                            </span>
                          </b>
                        </h6>
                      </div>
                      {section.id === 1 ? null : (
                        <div className="">
                          <Link
                            style={{
                              textDecoration: "none",
                              backgroundColor: `${section.buttonColor}`,
                            }}
                            to={`/patient-checkout?info=${section.id}`}
                            className="btn btn-sm "
                          >
                            Upgrade
                          </Link>
                        </div>
                      )}
                      <hr />
                    </div>
                  </>
                ))}
              </>
            ) : (
              <>
                <div className="p-4 plan-features">
                  {props.pricing.features.map((feature, key) => (
                    <p key={"_feature_" + key}>
                      <i className="bx bxs-circle text-dark me-2" />{" "}
                      {feature.title}
                    </p>
                  ))}
                </div>

                <div className="p-2 d-flex">
                  <div className="flex-grow-1">
                    <h6>
                      <b>
                        Pricing: <span>$</span> {props.pricing.price}/{" "}
                        <span className="font-size-13">
                          {props.pricing.duration}
                        </span>
                      </b>
                    </h6>
                  </div>
                  {props.pricing.id === 1 ? null : (
                    <div className="">
                      <Link
                        style={{
                          backgroundColor: `${props.pricing.buttonColor}`,
                        }}
                        to={`/patient-checkout?info=${props.pricing.id}`}
                        className="btn btn-sm"
                      >
                        Upgrade
                      </Link>
                    </div>
                  )}
                  <hr />
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

PricingCard.propTypes = {
  pricing: PropTypes.object,
};

export default PricingCard;
