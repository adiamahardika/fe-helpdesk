import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, FormGroup, Row, Col } from "reactstrap";
import { createUser } from "../../../store/pages/users/actions";
import { readRole } from "../../../store/pages/role/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import code_all_permissions from "../../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import general_constant from "../../../helpers/general_constant.json";
import UnsavedChangesWarning from "../../../helpers/unsaved_changes_warning";
import routes from "../../../helpers/routes.json";
import CryptoJS from "crypto-js";
require("dotenv").config();

const AddUser = (props) => {
  const message = props.message_user;
  const response_code = props.response_code_user;
  const loading = props.loading;
  const list_role = props.list_role;
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      sessionStorage.getItem("permission"),
      `${process.env.ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );
  const history = useHistory();
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [data, setData] = useState(null);
  const [validEmail, setValidEmail] = useState(false);
  const [validUsername, setValidUsername] = useState(false);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [password, setPassword] = useState(null);
  const [editUserRole, setEditUserRole] = useState(false);

  const onChangeData = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    setDirty();
  };
  const onValidateEmail = (email) => {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setData({
      ...data,
      email: email,
    });
    setDirty();
    if (regex.test(email) === true) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };
  const onValidateUsername = (username) => {
    let regex = /^[A-Za-z0-9]+S*$/;
    setData({
      ...data,
      username: username,
    });
    setDirty();
    if (regex.test(username) === true) {
      setValidUsername(true);
    } else {
      setValidUsername(false);
    }
  };

  const onSubmitCreate = async () => {
    let generatePassword = Math.random().toString(20).substr(2, 8);
    props.createUser({
      ...data,
      password: generatePassword,
    });
    setPassword(generatePassword);
    setIsShowSweetAlert(setTimeout(1500, true));
    setPristine();
  };
  const ButtonSubmitCreate = () => {
    if (
      data &&
      Object.keys(data).length >= 5 &&
      Object.values(data).every((value) => value !== "") &&
      validEmail === true &&
      validUsername === true
    ) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          onClick={() => {
            onSubmitCreate();
          }}
        >
          <i className="bx bx-save font-size-16 align-middle mr-2"></i>
          Save
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          disabled
          style={{ cursor: "default" }}
        >
          <i className="bx bx-save font-size-16 align-middle mr-2"></i>
          Save
        </button>
      );
    }
  };

  const ShowSweetAlert = () => {
    let value = null;
    if (isShowSweetAlert) {
      if (response_code === general_constant.success_response_code) {
        value = (
          <SweetAlert
            title={general_constant.success_message}
            success
            confirmBtnBsStyle="success"
            onConfirm={() => {
              setIsShowSweetAlert(false);
              setData(null);
              history.push(routes.users);
            }}
          >
            The user password is : <b>{password}</b>
          </SweetAlert>
        );
      } else {
        value = (
          <SweetAlert
            title={general_constant.error_message}
            error
            confirmBtnBsStyle="success"
            onConfirm={() => {
              setIsShowSweetAlert(false);
            }}
          >
            {message}
          </SweetAlert>
        );
      }
    }
    return value;
  };

  useEffect(() => {
    let isAddUser = permissions.find(
      (value) => value.code === code_all_permissions.add_user
    );
    let isEditUserRole = permissions.find(
      (value) => value.code === code_all_permissions.edit_user_role
    );

    if (isAddUser) {
      !isEditUserRole && setData({ role: "USER" });

      props.readRole();
      isEditUserRole && setEditUserRole(true);
    } else {
      history.push(routes.users);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Users"} breadcrumbItem={"Add User"} />
          <Card>
            <CardBody>
              <div
                className="col-md-12 mb-3"
                style={{
                  display: "grid",
                  justifyItems: "flex-end",
                  gridTemplateColumns: "1fr",
                  columnGap: "8px",
                }}
              >
                {" "}
                <ButtonSubmitCreate />
              </div>
              <AvForm>
                <Row className="justify-content-center">
                  <Col md={8}>
                    <Row>
                      <Col md={6}>
                        <AvField
                          name="username"
                          label="Username"
                          placeholder="ex: admin"
                          type="text"
                          errorMessage="Username cannot contain special character and whitespace"
                          validate={{
                            required: { value: true },
                            maxLength: { value: 16 },
                            pattern: { value: "^[A-Za-z0-9]+S*$" },
                          }}
                          onChange={(event) =>
                            onValidateUsername(event.target.value)
                          }
                        />
                      </Col>
                      <Col md={6}>
                        <AvField
                          name="name"
                          label="Name"
                          placeholder="ex: Admin"
                          type="text"
                          errorMessage="Enter Name"
                          validate={{
                            required: { value: true },
                            maxLength: { value: 16 },
                          }}
                          onChange={onChangeData}
                        />
                      </Col>
                    </Row>{" "}
                    <Row>
                      <Col md={5}>
                        <AvField
                          name="email"
                          label="Email"
                          placeholder="ex: admin@mail.com"
                          type="email"
                          errorMessage="Enter valid Email"
                          validate={{
                            required: { value: true },
                            maxLength: { value: 40 },
                          }}
                          onChange={(event) =>
                            onValidateEmail(event.target.value)
                          }
                        />
                      </Col>
                      <Col md={4}>
                        <AvField
                          name="phone"
                          label="Phone"
                          placeholder=""
                          type="text"
                          errorMessage="Enter Phone"
                          validate={{
                            required: { value: true },
                            maxLength: { value: 14 },
                          }}
                          onChange={onChangeData}
                        />
                      </Col>
                      <Col md={3}>
                        {editUserRole && (
                          <FormGroup className="select2-container">
                            <label className="control-label">Role</label>
                            <div>
                              <select
                                name="role"
                                className="form-control"
                                defaultValue=""
                                onChange={(event) => (
                                  setData({
                                    ...data,
                                    role: event.target.value,
                                  }),
                                  setDirty()
                                )}
                              >
                                <option value="" disabled>
                                  Select Role
                                </option>
                                {list_role &&
                                  list_role.map((value, index) => (
                                    <option
                                      key={index}
                                      value={value && value.id}
                                      onChange={(event) => (
                                        setData({
                                          ...data,
                                          role: event.target.value,
                                        }),
                                        setDirty()
                                      )}
                                    >
                                      {value.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </FormGroup>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </AvForm>
            </CardBody>
          </Card>
          {Prompt}
          <ShowSweetAlert />
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { message_user, loading, response_code_user } = state.User;
  const { option_role, list_role } = state.Role;
  return {
    option_role,
    list_role,
    response_code_user,
    message_user,
    loading,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      createUser,
      readRole,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(AddUser);
