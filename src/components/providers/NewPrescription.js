import React, { useState, useEffect, useCallback } from "react";
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
} from "reactstrap";
import Select from "react-select";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import axiosInstance from "../../api/TelePsyAPI";

const NewPrescription = (props) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dosage, setDosage] = useState("");
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateList, setUpdateList] = useState(false);

  const stateOptionGroup = [
    {
      options: [
        { label: "Ambien", value: "Ambien" },
        { label: "Gabapentin", value: "Gabapentin" },
        { label: "Methocarbamol", value: "Methocarbamol" },
        { label: "Cipro", value: "Cipro" },
        { label: "Buspirone", value: "Buspirone" },
      ],
    },
  ];

  const customStyles = {
    control: (styles) => ({
      ...styles,
      borderRadius: 12,
    }),
    input: (styles) => ({ ...styles }),
  };

  const handleAdd = (event) => {
    event.preventDefault();
    if (!selectedProduct) {
      return;
    }
    if (!quantity) {
      return;
    }

    if (!dosage) {
      return;
    }

    props.handleAdd(selectedProduct, quantity, dosage);
    setSelectedProduct("");
    setQuantity("");
    setDosage("");
  };

  const removeProduct = (i) => {
    props.productList.splice(i, 1);
    setUpdateList(!updateList);
  };

  useEffect(() => {
    setLoading(true);
    setProductList(props.productList);
    setLoading(false);
  }, [props.productList, updateList]);

  return (
    <Row>
      <Col lg={12}>
        <Card style={{ backgroundColor: "#8aceb6", borderRadius: 15 }}>
          <CardHeader className="mb-2" tag="h4">
            New Prescriptions
          </CardHeader>

          <CardBody>
            {/* <Col lg={12} className="card-header"> */}
            <Row>
              <Col lg={4}>
                <h4 className="card-header2">Add Prescription </h4>
              </Col>
              <Col lg={6}>
                <div className="form-check">
                  {props.adhd_consult_confirmed ? (
                    <>
                      <input
                        type="checkbox"
                        className="office-hours-toggle form-check-input"
                      />
                      <h5 className="form-check-label"> Schedule II</h5>
                    </>
                  ) : null}
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="office-hours-toggle form-check-input"
                  />
                  <h5 className="form-check-label"> Schedule III</h5>
                </div>
              </Col>

              <Col lg={2}>
                <a
                  onClick={() => {
                    props.productList.splice(0, props.productList.length);
                    setUpdateList(!updateList);
                  }}
                  style={{ fontSize: 15, color: "blue", cursor: "pointer" }}
                >
                  Reset
                </a>
              </Col>
              <hr />
            </Row>

            <Form
              onSubmit={handleAdd}
              className="row gy-2 gx-3 align-items-center"
            >
              <Col lg={4} className="mb-2 mt-4">
                <Select
                  value={
                    selectedProduct.length !== 0
                      ? { value: selectedProduct, label: selectedProduct }
                      : selectedProduct
                  }
                  onChange={({ value }) => {
                    setSelectedProduct(value);
                  }}
                  options={stateOptionGroup}
                  classNamePrefix="select2-selection"
                  placeholder="Select Product..."
                  styles={customStyles}
                />
              </Col>
              <Col lg={4} className="mb-2 mt-4">
                <input
                  type="text"
                  className="form-control"
                  value={quantity}
                  placeholder="Quantity"
                  onChange={({ target }) => {
                    setQuantity(target.value);
                  }}
                />
              </Col>
              <Col lg={2} className="mb-2 mt-4">
                <input
                  type="text"
                  className="form-control"
                  value={dosage}
                  placeholder="Dosage"
                  onChange={({ target }) => {
                    setDosage(target.value);
                  }}
                />
              </Col>
              <Col lg={2} className="mb-2 mt-4">
                <button type="submit" className="btn btn-success w-md">
                  Add
                </button>
              </Col>
            </Form>

            <br />
            <Col lg={12}>
              <div className="table-responsive  mt-1">
                <table width="100%" className=" m-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Dosage</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((product, i) => (
                      <tr>
                        <th scope="row">{i + 1}</th>
                        <td>{product.product}</td>
                        <td>{product.quantity}</td>
                        <td>{product.dosage}</td>
                        <td>
                          <a
                            onClick={() => removeProduct(i)}
                            style={{
                              fontSize: 18,
                              color: "blue",
                              cursor: "pointer",
                            }}
                          >
                            Remove
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {productList.length === 0 && (
                  <h4 className="mb-5 mt-5 text-center">
                    <i>Added Prescriptions will appear here</i>
                  </h4>
                )}
              </div>
            </Col>

            <div className="modal-footer">
              <button
                type="button"
                className="btn w-md profileProviderPageSendPrescriptionButton buttonBoxShadow"
                onClick={() => {
                  props.setShowNewPrescriptionModal();
                }}
              >
                Send Prescription
              </button>
              {/* <button
                type="button"
                className="btn w-md profileProviderPageResetPrescriptionButton buttonBoxShadow"
                onClick={() => {
                  props.productList.splice(0, props.productList.length);
                  setUpdateList(!updateList);
                }}
              >
                Reset
              </button> */}
              <button
                type="button"
                className="btn w-md profileProviderPageButton buttonBoxShadow"
                onClick={() => {
                  props.setShowNewPrescriptionModal();
                }}
              >
                Cancel
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default NewPrescription;
