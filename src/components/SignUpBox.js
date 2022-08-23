import nameWlogo from "../Images/TelePsycRXnameWicon500by300.jpg";
// import { Redirect, useHistory, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
// import axios from 'axios';
import { useHistory } from "react-router";
import axiosInstance from "../api/TelePsyAPI";

const SignUpBox = (props) => {
  const history = useHistory();

  const [hasAgreedTerms, setHasAgreedTerms] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] =
    useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneValidationCode, setPhoneValidationCode] = useState();
  const [newUserPhoneNumber, setNewUserPhoneNumber] = useState();
  const [newUserID, setNewUserID] = useState();

  // Dynamic displays
  const [registrationFormDisplay, setRegistrationFormDisplay] =
    useState("block");
  const [phoneValidationFormDisplay, setPhoneValidationFormDisplay] =
    useState("none");
  const [phoneValidationSuccessDisplay, setPhoneValidationSuccessDisplay] =
    useState("none");
  const [phoneValidationInfoDisplay, setPhoneValidationInfoDisplay] =
    useState("block");

  const handleCheckboxChange = (e) => {
    setHasAgreedTerms(e.target.checked);
  };

  // Signing up a user
  const initialFormData = Object.freeze({
    signUpEmail: "",
    firstName: "",
    lastName: "",
    signUpPassword: "",
    passwordConfirm: "",
  });

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
    console.log(formData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let isErr = false;

    const payload = {
      signUpEmail: formData.email,
      phone_number: formData.phone_number, // Make this camel case
      firstName: formData.firstName,
      lastName: formData.lastName,
      signUpPassword: formData.signUpPassword,
      passwordConfirm: formData.passwordConfirm,
    };
    if (!payload.signUpEmail) {
      setEmailErrorMessage("err");
      setErrorMessage("Hey, you forgot something.");
      isErr = true;
    }

    if (!payload.firstName) {
      setErrorMessage("Hey, you forgot something.");
      setFirstNameErrorMessage("err");
      isErr = true;
    }

    if (!payload.lastName) {
      setErrorMessage("Hey, you forgot something.");
      setLastNameErrorMessage("err");
      isErr = true;
    }

    if (!payload.signUpPassword) {
      setErrorMessage("Hey, you forgot something.");
      setPasswordErrorMessage("err");
      isErr = true;
    }

    if (!payload.passwordConfirm) {
      setErrorMessage("Hey, you forgot something.");
      setPasswordConfirmErrorMessage("err");
      isErr = true;
    }

    if (payload.signUpPassword !== payload.passwordConfirm) {
      setErrorMessage("Passwords do not match");
      setPasswordConfirmErrorMessage("err");
      isErr = true;
    }

    if (isErr) {
      return;
    }

    console.log(payload);

    axiosInstance
      .post(`/accounts/create/`, {
        email: formData.email,
        phone_number: formData.phone_number,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.signUpPassword,
        type: props.userType,
      })
      .then((res) => {
        setNewUserID(res.data.id);
        setNewUserPhoneNumber(res.data.phone_number);
        setRegistrationFormDisplay("none");
        setPhoneValidationFormDisplay("block");
      });
  };

  const handlePhoneValidationSubmit = (e) => {
    e.preventDefault();
    console.log(newUserPhoneNumber, phoneValidationCode);
    axiosInstance
      .post(`accounts/users/${newUserID}/validate_phone/`, {
        phone_number: newUserPhoneNumber,
        code: phoneValidationCode,
      })
      .then((res) => {
        console.log(res);
        setPhoneValidationCode(null);
        setPhoneValidationInfoDisplay("none");
        setPhoneValidationSuccessDisplay("block");
        // history.push("");
      });
  };

  return (
    // Using handleChange instead of value for auth.
    <main>
      <section className="Form my-4">
        <div className="container">
          <div className="row justify-content-center row-box">
            <div
              style={{ display: registrationFormDisplay }}
              className="col-lg-7 p-5 center"
            >
              <img src={nameWlogo} alt="TelePsycRX" className="py-3 logo"></img>
              <h3 className="text-center">{props.greetings}</h3>
              <h5 className="mt-3 text-center">{props.instructions}</h5>
              <form onSubmit={handleSubmit}>
                <div className="input-group mt-3 mb-3"></div>
                <div className="text-center">
                  <div className="form-check form-check-inline">
                    <input
                      onChange={handleCheckboxChange}
                      className="form-check-input"
                      type="checkbox"
                      id="inlineCheckbox1"
                      value="option1"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="inlineCheckbox1"
                    >
                      I agree with the{" "}
                      <a href={"/termsAndConditions"}>Terms and Conditions</a>
                    </label>
                  </div>
                </div>
                <div className="text-center">
                  <input
                    id={emailErrorMessage}
                    name="email"
                    onChange={handleChange}
                    type="email"
                    placeholder="* Email"
                    className="form-control2 my-4 p-4"
                  ></input>
                </div>
                <div className="text-center">
                  <input
                    id={emailErrorMessage}
                    name="phone_number"
                    onChange={handleChange}
                    type="phonenumber"
                    placeholder="+19876543210"
                    className="form-control2 my-4 p-4"
                  ></input>
                </div>
                <div className="text-center">
                  <input
                    id={firstNameErrorMessage}
                    // value={firstName}
                    name="firstName"
                    onChange={handleChange}
                    type="firstName"
                    placeholder="* First name"
                    className="form-control2 my-4 p-4"
                  ></input>
                </div>
                <div className="text-center">
                  <input
                    id={lastNameErrorMessage}
                    // value={lastName}
                    name="lastName"
                    onChange={handleChange}
                    type="lastName"
                    placeholder="* Last name"
                    className="form-control2 my-4 p-4"
                  ></input>
                </div>
                <div className="text-center">
                  <input
                    id={passwordErrorMessage}
                    // value={signUpPassword}
                    name="signUpPassword"
                    onChange={handleChange}
                    type="password"
                    placeholder="* Create a Password"
                    className="form-control2 my-4 p-4"
                  ></input>
                </div>
                <div className="text-center">
                  <input
                    name="passwordConfirm"
                    id={passwordConfirmErrorMessage}
                    // value={passwordConfirm}
                    onChange={handleChange}
                    type="password"
                    placeholder="* Confirm Password"
                    className="form-control2 my-4 p-4"
                  ></input>
                </div>
                <div className="text-center">
                  {errorMessage && (
                    <div className="errLogin" style={{ color: "red" }}>
                      {errorMessage}
                    </div>
                  )}
                  <button
                    disabled={!hasAgreedTerms}
                    type="submit"
                    className="btnLog mt-3 mb-5"
                  >
                    Register
                  </button>
                </div>
                <div className="text-center">
                  <a className="LogPgTx" href={"/"}>
                    Already Have an Account?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="row justify-content-center row-box">
            <div className="col-lg-7 p-5 center">
              <form
                onSubmit={handlePhoneValidationSubmit}
                style={{ display: phoneValidationFormDisplay }}
              >
                <img
                  src={nameWlogo}
                  alt="TelePsycRX"
                  className="py-3 logo"
                ></img>
                <h3 style={{ display: phoneValidationSuccessDisplay }}>
                  Success! Your phone number is now confirmed. Check your email
                  to activate your account.
                </h3>
                <h3 style={{ display: phoneValidationInfoDisplay }}>
                  Confirm your phone number with code we sent you.
                </h3>
                <div className="form-row">
                  <div className="col-lg-7">
                    <input
                      // Make new error message for phone validation
                      //   id={emailErrorMessage}
                      value={phoneValidationCode}
                      onChange={(e) => setPhoneValidationCode(e.target.value)}
                      type="number"
                      placeholder=""
                      className="form-control2 my-4 p-4 no-number-arrows"
                    ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-lg-7">
                    {/* Make new error message */}
                    {/* {errorMessage && (
                      <div className="errLogin" style={{ color: "red" }}>
                        {errorMessage}
                      </div>
                    )} */}
                    <button type="submit" className="btnLog mt-3 mb-5">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section></section>
    </main>
  );
};

export default SignUpBox;

{
  /* <section className="Form my-4 mx-5">
    <div className="container">
        <div className="row g-0">
            <div className="col-lg-5">
                <img src="../Images/loginPg.jpg" className="img-fluid" alt="">
            </div>
            <div className="col-lg-7 px-5 pt-5">
                <img src="../Images/TelePsycRXname&icon500by300.jpg" className="py-3 logo"></img>
                <h2>Sign into your account</h2>
                <form>
                    <div className="form-row">
                        <div className="col-lg-7">
                            <input type="email" placeholder="Email@address" className="form-control2 my-4 p-4">
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-lg-7">
                            <input type="password" placeholder="**********" className="form-control2 my-4 p-4">
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-lg-7">
                            <button type="button" className="btnLog mt-3 mb-5">Login</button>
                        </div>
                    </div>
                    <a className="LogPgTx" href="#">Forget your Password?</a>
                    <p className=" mt-2"><a className="LogPgTx" href="#">Terms and Conditions</a></p>
                    <p className="mt-3 LogPgTx">New Patient? <a href="../Pages/PatientSignUp.html">Click here to Register</a></p>
                    <p className="mt-5 pt-5 LogPgTx">To Become a Provider: <a href="../Pages/ProviderSignUp.html">Click here to
                        Register</a></p>

                </form>
            </div>
        </div>
    </div>
</section> */
}
