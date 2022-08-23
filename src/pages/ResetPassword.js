import React, { useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import nameWlogo from "../Images/TelePsycRXnameWicon500by300.jpg";
import axiosInstance from "../api/TelePsyAPI";

export default function ResetPassword() {
  const { email, code } = useParams();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [resetPasswordFormDisplay, setResetPasswordFormDisplay] =
    useState("block");
  const [passwordSuccessDisplay, setPasswordSuccessDisplay] = useState("none");
  const [passwordInfoDisplay, setPasswordInfoDisplay] = useState("block");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== passwordConfirm) {
      setErrorMessage("Passwords do not match");
      setPasswordConfirmErrorMessage("err");
      isErr = true;
    }
    console.log(password, code);
    if (email !== undefined && code !== undefined) {
      axiosInstance
        .post("accounts/users/password_reset/", {
          email: email,
          code: code,
          password: password,
        })
        .then((res) => {
          // Can display message based on the response
          console.log(res);
          console.log("Password reset successfully");
          setPasswordInfoDisplay("none");
          setPasswordSuccessDisplay("block");
          setResetPasswordFormDisplay("none");
          setPassword("");
          setPasswordConfirm("");
        });
    }
  };
  return (
    <main>
      <section className="Form my-4">
        <div className="container">
          <div className="row row-box justify-content-center">
            <div className="col-lg-7 p-5 center">
              <img src={nameWlogo} alt="TelePsycRX" className="py-3 logo"></img>
              <h3 style={{ display: passwordInfoDisplay }}>
                Enter your new password below.
              </h3>
              <h3 style={{ display: passwordSuccessDisplay }}>
                Your password was successfully reset. You can now{" "}
                <NavLink to="/">Login</NavLink>.
              </h3>
              <form
                onSubmit={handleSubmit}
                style={{ display: resetPasswordFormDisplay }}
              >
                <div className="form-row">
                  <div className="col-lg-7">
                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type="password"
                      placeholder="* New Password"
                      className="form-control2 my-4 p-4"
                    ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-lg-7">
                    <input
                      value={passwordConfirm}
                      onChange={(event) =>
                        setPasswordConfirm(event.target.value)
                      }
                      type="password"
                      placeholder="* Confirm New Password"
                      className="form-control2 my-4 p-4"
                    ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-lg-7">
                    {/* Change error message */}
                    {/* {errorMessage && (
                      <div className="errLogin" style={{ color: "red" }}>
                        {errorMessage}
                      </div> */}
                    {/* )} */}
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
    </main>
  );
}
