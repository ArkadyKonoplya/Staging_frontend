import { Card, Col, Row } from "reactstrap";
import telePsycRxIcon from "../../Images/TelePsycRXicon.jpg";

function NeededDocsPa(props) {
  return (
    <Row>
      <Col lg="12">
        <Card
          style={{
            backgroundColor: "#EEEBE7",
            borderRadius: 22,
            // padding: 10,
          }}
        >
          <div className="card-header">
            <h3>Requested Action</h3>
          </div>
          <div className="card-body">
            {props.items.map((item, i) => (
              <div className="newConsult">
                <div className="info">
                  <img
                    src={telePsycRxIcon}
                    height="40px"
                    width="40px"
                    alt="colleague"
                  ></img>
                  <div>
                    <h4>TelePsycRX</h4>
                    <small>{item.file_subject}</small>
                  </div>
                </div>
                <div className="contact">
                  <a
                    href={item.file}
                    target="_blank"
                    className="las la-download refer"
                  ></a>
                  {/* <span className="las la-download refer"></span> */}
                  <span className="las la-times-circle reject"></span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Col>
    </Row>
  );
}

export default NeededDocsPa;
