import React from "react";

const NewUserRequirement = ({ requiredInformation }) => {
    return (
        <div className="requirement-float-box">
            <h3>
                You must verify your identity by uploading the following files.{" "}
            </h3>
            <br />
            <h5><b>Accepted form of identification are:</b></h5>
            <p>
                {requiredInformation.map((requirement, index) => <><i className="bx bxs-circle text-dark me-2" /><a href="/patient-profile" style={{ textDecoration: "none" }}>{requirement}</a>{" "}</>)}
            </p>
        </div>
    );
};

export default NewUserRequirement;
