import { useParams, useHistory, useLocation } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import ReactTooltip from "react-tooltip";
import nameWlogo from "../Images/TelePsycRXnameWicon500by300.jpg";
import axiosInstance from "../api/TelePsyAPI";
import { localStorageHelper } from "../helpers/localStorage";
import { SubscriptionContext } from "../helpers/subscriptionContext";
// import ToolTip from "../components/ToolTip";

const LoginBox = (props) => {
  // https://stackoverflow.com/questions/67129304/how-to-get-route-params-in-react-functional-component
  const { email, code } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [disableRegister, setDisableRegister] = useState(true);
  const { userContext, setUserContext } = useContext(SubscriptionContext);
  // Send the correct email and code to validate-new-user on page load
  useEffect(() => {
    if (email !== undefined && code !== undefined) {
      axiosInstance
        .post("accounts/validate-new-user/", {
          email: email,
          code: code,
        })
        .then((res) => {
          // Can display message based on the response
          console.log(res);
        });
    }
  }, []);

  const initialFormData = Object.freeze({
    email: "",
    password: "",
  });

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = { email: formData.email, password: formData.password };
    if (!payload.email) {
      setErrorMessage("Email Address is Required.");
      setEmailErrorMessage("err");
      return;
    } else if (!payload.password) {
      setErrorMessage("Forgot to enter Password.");
      setPasswordErrorMessage("err");
      return;
    }
    console.log(payload);

    axiosInstance
      .post(`token/`, {
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        console.log("login res here >>>", res);
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        axiosInstance.defaults.headers["Authorization"] =
          "JWT " + localStorage.getItem("access_token");

        // store the user in localStorage
        localStorage.setItem("user", JSON.stringify(res.data));

        const { from } = location?.state || {};
        localStorageHelper.store("user_type", res.data.type);
        setUserContext({
          is_approved: res?.data?.is_approved,
          is_partner_account: res?.data?.is_partner_account,
          is_subscribed: res?.data?.is_subscribed,
          is_identified: res?.data?.is_identified,
          user_type: res?.data?.type,
        });
        if (from) {
          history.push(from);
        } else if (res.data.type === "Doctor") {
          history.push("/provider-dashboard");
        } else {
          history.push("/patient-dashboard");
        }
      });
  };

  return (
    <main>
      <section class="Form my-lg-4 mx-lg-5 my-sm-1 mx-sm-1">
        <div class="container">
          <div class="row row-box g-0">
            <div className="col-lg-6 img-fluid"></div>
            <div className="col-lg-6 px-3 text-center">
              <img src={nameWlogo} alt="TelePsycRX" class="py-3 logo"></img>
              <h2>{props.instructions}</h2>
              <form onSubmit={handleSubmit}>
                <div class="form-row">
                  <div class="col-lg-6 offset-lg-3">
                    <input
                      id={emailErrorMessage}
                      // value={email}
                      name="email"
                      onChange={handleChange}
                      type="email"
                      placeholder="Email@address"
                      class="form-control2 my-4 p-4 mx-0"
                    ></input>
                  </div>
                  <div class="col-lg-6 offset-lg-3">
                    <input
                      id={passwordErrorMessage}
                      // value={password}
                      name="password"
                      onChange={handleChange}
                      type="password"
                      placeholder="**********"
                      class="form-control2 my-4 p-4 mx-0"
                    ></input>
                  </div>
                </div>
                <div class="col-lg-6 offset-lg-3">
                  {errorMessage && (
                    <div className="errLogin" style={{ color: "red" }}>
                      {errorMessage}
                    </div>
                  )}
                  <button type="submit" class="btnLog mt-3 mb-5">
                    Login
                  </button>
                </div>
                <a class="LogPgTx" href={"/password-reset"}>
                  Forget your Password?
                </a>
                <p class=" mt-1">
                  <a class="LogPgTx" href={"/termsAndConditions"}>
                    Terms and Conditions
                  </a>
                </p>
                <p
                  class="mt-3 LogPgTx"
                  style={{
                    filter: disableRegister ? "blur(1px)" : null,
                  }}
                >
                  New Patient?
                  <a
                    disabled={true}
                    href={disableRegister ? "/" : "/patient-SignUp"}
                  >
                    Click here to Register
                  </a>
                </p>
                {disableRegister ? (
                  <div class="col-lg-8 offset-lg-2">
                    <p className="loginPrompt tooltip-innerH">
                      Only recruiting doctors at this time to better serve you
                      more
                    </p>
                  </div>
                ) : null}

                <p class="mt-3 LogPgTx">
                  To Become a Provider:
                  <a href={"/provider-SignUp"}>Click here to Register</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginBox;
