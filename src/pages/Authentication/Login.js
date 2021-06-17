import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { readCaptcha } from "../../store/auth/captcha/actions";
import logo from "../../assets/images/logo-bri.png";
import login2 from "../../assets/images/img-login2.svg";
import general_constant from "../../helpers/general_constant.json";
import { bindActionCreators } from "redux";
import "../../assets/css/style.css";
require("dotenv").config();

const Login = (props) => {
  const captcha = props.captcha;
  const image_captcha = props.image_captcha;
  const [data, setData] = useState(null);
  const [message, setMessage] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [captchaValidation, setCaptchaValidation] = useState(null);
  const history = useHistory();

  let year = new Date().getFullYear();
  const handleValidSubmit = async () => {
    if (captchaValidation === captcha) {
      await fetch(`${process.env.REACT_APP_API}/api/auth/signin`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((value) => {
          if (value.responseCode === general_constant.success_response_code) {
            localStorage.setItem("accessToken", value.response.accessToken);
            localStorage.setItem("username", value.response.username);
            localStorage.setItem("name", value.response.name);
            localStorage.setItem("email", value.response.email);
            localStorage.setItem("role", value.response.roles);
            localStorage.setItem(
              "permission",
              JSON.stringify(value.response.role[0].listPermission)
            );
            localStorage.setItem("isAuth", true);
            history.push("/");
          } else {
            setMessage(value.description);
          }
        })
        .catch((error) => console.log(error.message));
    } else {
      setMessage("Captcha Not Match");
    }
  };
  useEffect(() => {
    localStorage.clear();
    props.readCaptcha();
  }, []);

  return (
    <React.Fragment>
      <Row style={{ height: "100vh", width: "100vw" }}>
        <Col
          md={6}
          className="d-flex flex-column justify-content-center"
          style={{
            backgroundColor: "#556ee6",
            padding: "5%",
          }}
        >
          <img
            src={login2}
            className="img-fluid"
            style={{ width: "85%", alignSelf: "center" }}
            alt=""
          />
          <h5
            style={{
              color: "white",
              fontSize: "14px",
              marginLeft: "4rem",
              marginTop: "10%",
            }}
          >
            {" "}
            &copy; {year} Trilogi Persada - All Rights Reserved
          </h5>
        </Col>
        <Col
          md={6}
          className="d-flex flex-column justify-content-center"
          style={{
            paddingTop: "5vh",
            paddingBottom: "5vh",
            paddingLeft: "10vw",
            paddingRight: "10vw",
          }}
        >
          <img
            src={logo}
            className="logo mr-auto"
            style={{ width: "40%" }}
            alt=""
          />
          <h3
            style={{
              fontSize: "30px",
              fontWeight: "bold",
            }}
            className="mt-3"
          >
            Welcome Back!
          </h3>
          <div style={{ color: "#6A7482" }}>
            To keep connected with us please login with <br />
            your personal info
          </div>
          <div className="mt-4">
            <AvForm
              className="form-horizontal"
              onValidSubmit={() => handleValidSubmit()}
            >
              {message && <Alert color="danger">{message}</Alert>}
              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <AvField
                      name="username"
                      label="Username"
                      className="form-control"
                      placeholder="Enter Username"
                      type="username"
                      errorMessage="This field cannot be empty"
                      required
                      onChange={(event) => {
                        setData({
                          ...data,
                          username: event.target.value,
                        });
                      }}
                    />
                  </div>
                </Col>
                <Col md={6} className="pl-0">
                  <div className="form-group" style={{ display: "grid" }}>
                    <label
                      htmlFor="example-datetime-local-input"
                      className="col-form-label pt-0"
                    >
                      Password
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 48px",
                        alignItems: "flex-start",
                        columnGap: "8px",
                      }}
                    >
                      <AvField
                        name="password"
                        className="form-control"
                        placeholder="Enter Password"
                        type={isShowPassword ? "text" : "password"}
                        errorMessage="This field cannot be empty"
                        required
                        onChange={(event) => {
                          setData({
                            ...data,
                            password: event.target.value,
                          });
                        }}
                      />
                      <Button
                        color="secondary"
                        style={{ color: "white" }}
                        onClick={() => setIsShowPassword(!isShowPassword)}
                      >
                        {isShowPassword ? (
                          <i className="bx bx-hide font-size-16 align-middle"></i>
                        ) : (
                          <i className="bx bx-show font-size-16 align-middle"></i>
                        )}
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
              <Col
                style={{
                  display: "grid",
                  gridTemplateColumns: "min-content",
                }}
              >
                <Row
                  className="mb-2"
                  style={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridTemplateColumns: "max-content min-content",
                    columnGap: "1rem",
                  }}
                >
                  {" "}
                  <img src={`data:image/jpeg;base64,${image_captcha}`} />{" "}
                  <Button
                    color="secondary"
                    style={{ color: "white" }}
                    onClick={() => props.readCaptcha()}
                  >
                    <i className="bx bx-refresh font-size-16 align-middle"></i>
                  </Button>
                </Row>
                <Row>
                  <AvField
                    name="captcha"
                    label=""
                    className="form-control"
                    placeholder="Re-Type Text Above"
                    type="text"
                    errorMessage="This field cannot be empty"
                    required
                    onChange={(event) => {
                      setCaptchaValidation(event.target.value);
                    }}
                  />
                </Row>
              </Col>
              <div className="mt-3">
                <button
                  className="btn btn2 btn-primary btn-block waves-effect waves-light"
                  type="submit"
                >
                  Log In
                </button>
              </div>
            </AvForm>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { error } = state.Login;
  const { captcha, image_captcha } = state.Captcha;
  return { error, captcha, image_captcha };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readCaptcha,
    },
    dispatch
  );

export default withRouter(connect(mapStatetoProps, mapDispatchToProps)(Login));
