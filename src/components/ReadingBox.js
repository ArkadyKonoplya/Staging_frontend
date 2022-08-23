// import { Redirect, useHistory, useLocation } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { Link } from "react-router-dom";
import nameWlogo from "../Images/TelePsycRXnameWicon500by300.jpg";

const ReadingBox = (props) => {
  // const { didSubmit } = props;
  // const [title, setTitle] = useState('');
  // const [body, setBody] = useState('');

  // const handleSubmit = event => {
  //     event.preventDefault();
  //     submitAquiz();
  // };

  // const submitInfo = async () => {
  //     await axios.post('/api/info', { title: title, body: body });
  //     setBody('');
  //     setTitle('');
  //     didSubmit();
  // };

  return (
    <main>
      <section className="Form my-lg-4 mx-lg-5 my-sm-1 mx-sm-1">
        <div className="container">
          <div className="row row-box g-0">
            <div className="col-lg-6 termsAndCondition"></div>
            <div className="col-lg-6 px-3 text-center">
              <img src={nameWlogo} alt="TelePsycRX" className="py-3 logo"></img>
              <h2>{props.greetings}</h2>
              <div className="card-footer bg-transparent border-top" />
              <SimpleBar
                forceVisible="y"
                autoHide={false}
                style={{ maxHeight: "350px" }}
              >
                <p>
                  These TERMS AND CONDITIONS OF USE ("Terms of Use") concern the
                  telepsycrx.com website and its subdomains (together with its
                  pages and features, "Website") and mobile software application
                  (together with its pages and features, "App"), as well as
                  those certain products (“Products”) and services (“Services”)
                  provided on, through or in relation to the Website and/or the
                  App. These Terms of Use are made and entered into by and
                  between you and TelePsycRX LLC ("TelePsycRX"). You and
                  TelePsycRX are sometimes referred to herein each as a "Party"
                  and together as the "Parties." The terms “you” and “your”
                  means you, your dependents if any, and any other person
                  accessing your User Account. Note, TelePsycRX is not a medical
                  group. Any telehealth consults obtained through our Website
                  and/or App are provided by independent medical practitioners.
                  (See the Section below titled Supplemental Terms Applicable to
                  Prescribing Providers.) Your medical prescribing provider is
                  responsible for providing you with a Notice of Privacy
                  Practices describing its collection and use of your health
                  information, not TelePsycRX. If you do not agree to be bound
                  by those terms, you are not authorized to access or use our
                  Website or App, and you must promptly exit our Website or App.
                  THE DISPUTE RESOLUTION SECTION OF THIS AGREEMENT CONTAINS A
                  MUTUAL ARBITRATION AGREEMENT AND CLASS ACTION WAIVER THAT
                  REQUIRES YOU AND TELEPSYCRX AND/OR YOUR PRESCIBING PROVIDER TO
                  RESOLVE DISPUTES WITH EACH OTHER ON AN INDIVIDUAL BASIS
                  THROUGH FINAL AND BINDING ARBITRATION. PLEASE REVIEW THE
                  DISPUTE RESOLUTION SECTION OF THIS AGREEMENT CAREFULLY. BY
                  ENTERING INTO THIS AGREEMENT, YOU EXPRESSLY ACKNOWLEDGE THAT
                  YOU HAVE READ AND UNDERSTAND ALL OF THE TERMS OF THIS
                  AGREEMENT AND HAVE TAKEN TIME TO CONSIDER THE CONSEQUENCES OF
                  THIS IMPORTANT DECISION. The professional medical services
                  (which are provided by your Prescribing Provider) and the
                  non-clinical Website or App services (which are provided by
                  TelePsycRX) are collectively referred to in this Terms of Use
                  as the “Services”. Your acceptance of, and compliance with,
                  these Terms of Use is a condition to your use of the Website,
                  App and Services and purchase of Products. By clicking
                  “accept”, you acknowledge that you have read, understand, and
                  accept all terms and conditions contained within these Terms
                  of Use, the Notice of Privacy Practices provided to you by
                  your prescribing provider and our Privacy Policy. If you do
                  not agree to be bound by these terms, you are not authorized
                  to access or use the Website, App or Services; promptly exit
                  the Website or App.
                </p>

                <p>
                  When I first brought my cat home from the humane society she
                  was a mangy, pitiful animal. It cost a lot to adopt her: forty
                  dollars. And then I had to buy litter, a litter box, food, and
                  dishes for her to eat out of. Two days after she came home
                  with me she got taken to the pound by the animal warden.
                  There's a leash law for cats in Fort Collins. If they're not
                  in your yard they have to be on a leash. Anyway, my cat is my
                  best friend. I'm glad I got her. She sleeps under the covers
                  with me when it's cold. Sometimes she meows a lot in the
                  middle of the night and wakes me up, though.
                </p>
                <p>
                  When I first brought my cat home from the humane society she
                  was a mangy, pitiful animal. It cost a lot to adopt her: forty
                  dollars. And then I had to buy litter, a litter box, food, and
                  dishes for her to eat out of. Two days after she came home
                  with me she got taken to the pound by the animal warden.
                  There's a leash law for cats in Fort Collins. If they're not
                  in your yard they have to be on a leash. Anyway, my cat is my
                  best friend. I'm glad I got her. She sleeps under the covers
                  with me when it's cold. Sometimes she meows a lot in the
                  middle of the night and wakes me up, though.
                </p>

                <p>
                  When I first brought my cat home from the humane society she
                  was a mangy, pitiful animal. It cost a lot to adopt her: forty
                  dollars. And then I had to buy litter, a litter box, food, and
                  dishes for her to eat out of. Two days after she came home
                  with me she got taken to the pound by the animal warden.
                  There's a leash law for cats in Fort Collins. If they're not
                  in your yard they have to be on a leash. Anyway, my cat is my
                  best friend. I'm glad I got her. She sleeps under the covers
                  with me when it's cold. Sometimes she meows a lot in the
                  middle of the night and wakes me up, though.
                </p>
              </SimpleBar>

              <div>
                <button
                  type="button"
                  className="mt-3 mb-2"
                  style={{
                    borderRadius: "40px",
                    outline: "none",
                    height: "50px",
                    width: "50%",
                    backgroundColor: "#ac2ce7e0",
                    color: "white",
                    fontWeight: "500",
                    fontSize: "1rem",
                  }}
                  onClick={() => window.location.replace("/")}
                >
                  {props.submit}
                </button>
              </div>
              <p class="mt-3 LogPgTx">
                Patient:{" "}
                <a href={"/patient-SignUp"}>Agree and go to patient signup</a>
              </p>
              <p class="mt-4 LogPgTx">
                Provider:{" "}
                <a href={"/provider-SignUp"}>Agree and go to provider signup</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReadingBox;
