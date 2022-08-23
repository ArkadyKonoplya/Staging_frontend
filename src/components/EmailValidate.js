// import { Redirect, useHistory, useLocation } from 'react-router-dom';
import React, { useState } from 'react'
import axiosInstance from "../api/TelePsyAPI";
import nameWlogo from '../Images/TelePsycRXnameWicon500by300.jpg';

const EmailValidate = (props) => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        const payload = { email: email }
        if (!payload.email) {
            setErrorMessage('Email Address is Required.');
            return;
        }

        axiosInstance
            .post("accounts/users/request_password_reset/", {
                email: email,
            })
            .then((res) => {
                // Can display message based on the response
                console.log(res);
                console.log("Sent password reset email");
                // Change to successfully sent email page
            });

        console.log(payload);
        setEmail('');

    };
    return (
        <main>
            <section className="Form my-4">
                <div className="container">
                    <div className="row row-box justify-content-center">
                        <div className="col-lg-7 p-5 center">
                            <img src={nameWlogo} alt='TelePsycRX' className="py-3 logo"></img>
                            <h3>{props.greetings}</h3>
                            <h5 className="mt-3">{props.instructions}</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="col-lg-7">
                                        <input
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            type="email"
                                            placeholder="* Email"
                                            className="form-control2 my-4 p-4"
                                        ></input>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-lg-7">
                                        {errorMessage && <div className='errLogin' style={{ color: 'red' }}>{errorMessage}</div>}
                                        <button type="submit" className="btnLog mt-3 mb-5">{props.submit}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <section></section>
            <section></section>
        </main>

    )
}

export default EmailValidate;

