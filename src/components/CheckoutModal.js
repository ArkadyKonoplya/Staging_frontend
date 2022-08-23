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
  Modal,
  ModalHeader,
} from "reactstrap";
import PricingCard from "./patients/PricingCard";
import React, { useState, useEffect } from "react";

function CheckoutModal({ setSubscribemodal, subscribemodal }) {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [userDoctors, setUserDoctors] = useState([]);
  const [provider, setProvider] = useState("");
  const [providerEmail, setProviderEmail] = useState("");

  const [showAppoint, setShowAppoint] = useState(false);
  const [showRefer, setShowRefer] = useState(false);
  const [showResch, setShowResch] = useState(false);
  const [modal_center, setmodal_center] = useState(false);

  const pricings = [
    {
      id: 1,
      title: "Free Account",
      price: "0",
      duration: "month",
      category: "single",
      link: "",
      features: [
        {
          title:
            "The personal Journal is a free application that gives you a safe space to enter your thoughts and sort through your issues",
        },
        {
          title:
            "We regularly post blog articles with general self-help information to help inform your research or to provide some limited in sight for common issues",
        },
        { title: "Tip on mindfulness practices and meditation techniques" },
      ],
      buttonColor: "rgba(244, 106, 106, 0.4)",
    },
    {
      id: "79eb9b90-e5e9-4dbd-ab53-eeb13676ab58",
      title: "Support Counseling",
      category: "multiple",

      sections: [
        {
          id: "79eb9b90-e5e9-4dbd-ab53-eeb13676ab58",
          name: null,
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
          price: "100",
          duration: "month",
          buttonColor: "rgba(244, 106, 106, 0.4)",
        },
        {
          id: "d85902f5-5283-4e26-9957-b1437a0088fe",
          name: "Pay As You Use",
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
          price: "100",
          duration: "month",
          buttonColor: "rgba(241, 180, 76, 0.4)",
        },
        {
          id: "12233e64-4a49-482c-82f5-8d24c3064404",
          name: "Add Medication Care",
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
          price: "100",
          duration: "month",
          buttonColor: "rgba(52, 195, 143, 0.4)",
        },
      ],
      price: null,
      duration: null,
      link: "",
      features: null,
      buttonColor: null,
    },
    {
      id: "2be20e6a-a78c-4657-8ae9-0ae34aa11219",
      title: "Therapy",
      category: "multiple",

      sections: [
        {
          id: "2be20e6a-a78c-4657-8ae9-0ae34aa11219",
          name: null,
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
          price: "300",
          duration: "month",
          buttonColor: "rgba(244, 106, 106, 0.4)",
        },
        {
          id: "2dffdc8c-5883-4125-8333-2738b1961e49",
          name: "Pay As You Use",
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
          price: "300",
          duration: "month",
          buttonColor: "rgba(241, 180, 76, 0.4)",
        },
        {
          id: "426d27a4-06e4-45fb-87e9-52f1d0213d49",
          name: "Add Medication Care",
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
          price: "300",
          duration: "month",
          buttonColor: "rgba(52, 195, 143, 0.4)",
        },
      ],
      price: null,
      duration: null,
      link: "",
      features: null,
      buttonColor: null,
    },
  ];

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const onClickRe = () => {
    setShowResch(!showResch);
    setShowAppoint(false);
    setShowRefer(false);
    removeBodyCss();
  };

  return (
    <Modal
      isOpen={subscribemodal}
      role="dialog"
      autoFocus={true}
      centered
      data-toggle="modal"
      size="xl"
      scrollable={true}
      toggle={() => {
        setSubscribemodal();
      }}
    >
      <div>
        <ModalHeader
          className="border-bottom-0"
          toggle={() => {
            setSubscribemodal();
          }}
        ></ModalHeader>
      </div>
      <div className="modal-body">
        <div className="mb-1">
          <div className="row justify-content-center text-center">
            <div className="col-xl-10">
              <h3 className="text-success">Our Membership Plans</h3>
            </div>
          </div>
        </div>

        <Row className="p-2">
          {pricings.map((pricing, key) => (
            <PricingCard pricing={pricing} key={"_pricing_" + key} />
          ))}
        </Row>
      </div>
    </Modal>
  );
}

export default CheckoutModal;
