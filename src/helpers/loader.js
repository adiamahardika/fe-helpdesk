import React from "react";
import { Container } from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TailSpin } from "react-loader-spinner";
import { Row, Col } from "reactstrap";
require("dotenv").config();

const Loader = (props) => {
  return (
    <React.Fragment>
      <div
        className="page-content"
        style={{
          position: "fixed",
          zIndex: 100,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          minWidth: "80vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container
          fluid
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Row>
            <Col>
              <TailSpin
                color="#556ee6"
                height={100}
                width={100}
                wrapperStyle
                wrapperClass
              />
              <h3 className="mt-3" style={{ color: "#ffffff" }}>
                Please wait!
              </h3>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default connect(mapStatetoProps, mapDispatchToProps)(Loader);
