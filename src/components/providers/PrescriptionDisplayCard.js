import React, { useState, useEffect } from "react";
import { CardTitle, Modal, Spinner } from "reactstrap";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import axiosInstance from "../../api/TelePsyAPI";
import moment from "moment-timezone";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
// import { useLocalStorage } from '@rehooks/local-storage';

function PrescriptionDisplayCard(props) {
  return (
    // #AC888F
    <div className="card prescriptionDisplayCard">
      <div className="DspCarHead mb-5 text-center">
        <h6 className="text-center">Prescriptions</h6>
        <button className="DisCarHeadBtn">See All</button>
      </div>
      {props.productList.length === 0 ? (
        <h4 className="currentPatRecH1">
          You have not assigned any Prescriptions to this patient
        </h4>
      ) : (
        <>
          <SimpleBar
            forceVisible="y"
            autoHide={false}
            style={{ maxHeight: "300px" }}
          >
            {props.productList.map((value, i) => (
              <div className="DspCarBody mb-3">
                <p className="DspCarP">{value.product}</p>
                <p className="DspCarP">
                  <span className={`status blue`}></span>
                  {value.quantity}
                </p>
                <button className="DspCarBodyBtn DCBBtnEdit">View</button>
              </div>
            ))}
          </SimpleBar>
          {/* <Modal
            isOpen={modal_scroll}
            toggle={() => {
              tog_scroll();
            }}
            scrollable={true}
          >
            <div className="modal-body">
              <CardTitle className="mt-0 .text-bold">
                <b>Date</b>
              </CardTitle>
              <p>kkk</p>
              <CardTitle className="mt-0">
                <b>Time</b>
              </CardTitle>
              <p>mmm</p>
              <CardTitle className="mt-0">
                <b>Notes</b>
              </CardTitle>
              <p>hhhh</p>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </Modal> */}
        </>
      )}
    </div>
  );
}

export default PrescriptionDisplayCard;
