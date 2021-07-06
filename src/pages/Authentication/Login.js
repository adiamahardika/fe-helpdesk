import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { readCaptcha } from "../../store/auth/captcha/actions";
import { bindActionCreators } from "redux";
import logo from "../../assets/images/mygrapari.png";
import login2 from "../../assets/images/login-image.svg";
import general_constant from "../../helpers/general_constant.json";
import routes from "../../helpers/routes.json";
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
            history.push(routes.ticket);
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
          md={8}
          className="d-flex flex-column justify-content-center text-center"
        >
          <img
            src={login2}
            className="img-fluid"
            style={{ width: "85%", alignSelf: "center" }}
            alt=""
          />
          <h5
            style={{
              color: "#EC1C24",
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
          md={4}
          className="d-flex flex-column justify-content-center"
          style={{
            paddingTop: "5vh",
            paddingBottom: "5vh",
            paddingLeft: "3vw",
            paddingRight: "3vw",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
            }}
            className="mt-3"
          >
            Welcome! Please log in.
          </div>
          <div className="mt-4">
            <AvForm
              className="form-horizontal"
              onValidSubmit={() => handleValidSubmit()}
            >
              {message && <Alert color="danger">{message}</Alert>}
              <Row>
                <Col>
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
              </Row>
              <Row>
                <Col>
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
                  className="btn btn2 btn-block waves-effect waves-light"
                  style={{
                    color: "white",
                    backgroundImage:
                      "linear-gradient(to right, #EC1C24 10%, #FFA20A 60%)",
                  }}
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
