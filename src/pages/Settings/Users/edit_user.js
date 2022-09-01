import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Modal,
  FormGroup,
  Row,
  Col,
} from "reactstrap";
import { updateUser, resetPassword } from "../../../store/pages/users/actions";
import { readRole } from "../../../store/pages/role/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SweetAlert from "react-bootstrap-sweetalert";
import code_all_permissions from "../../../helpers/code_all_permissions.json";
import general_constant from "../../../helpers/general_constant.json";
import UnsavedChangesWarning from "../../../helpers/unsaved_changes_warning";
import routes from "../../../helpers/routes.json";
import CryptoJS from "crypto-js";
import { emailValidation } from "../../../helpers";
require("dotenv").config();

const EditUser = (props) => {
  const message = props.message_user;
  const response_code = props.response_code_user;
  const editUserValue = props.location.editUserValue;
  const option_role = props.option_role;
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      localStorage.getItem("permission"),
      `${process.env.REACT_APP_ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );
  const history = useHistory();
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [resetPassword, setResetPassword] = useState(false);
  const [modalResetPassword, setModalResetPassword] = useState(false);

  const [selectedData, setSelectedData] = useState(null);
  const [validEmail, setValidEmail] = useState(true);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [sweetAlertType, setSweeAlertType] = useState(null);
  const [editUserRole, setEditUserRole] = useState(null);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const onChangeSelectedData = (event) => {
    setSelectedData({
      ...selectedData,
      [event.target.name]: event.target.value,
    });
    setDirty();
  };
  const onValidateEmail = (email) => {
    setSelectedData({
      ...selectedData,
      email: email,
    });
    setValidEmail(emailValidation(email));
    setDirty();
  };

  const onSubmitUpdate = async () => {
    props.updateUser({
      ...selectedData,
    });

    setSweeAlertType("The user has successfully edited!");
    setIsShowSweetAlert(true);
    setPristine();
  };

  const onSubmitResetPassword = async () => {
    let id = selectedData.id.toString();
    let password = Math.random().toString(20).substr(2, 8);

    await props.updateUser({
      ...selectedData,
    });
    await props.resetPassword({
      ...selectedData,
      id: id,
      emailAddress: selectedData.email,
      password: password,
    });
    setSweeAlertType(`The user new password is ${password}`);
    setModalResetPassword(!modalResetPassword);
    setIsShowSweetAlert(true);
    removeBodyCss();
  };

  const ButtonSubmitUpdate = () => {
    if (
      selectedData &&
      Object.values(selectedData).every((value) => value !== "") &&
      validEmail === true
    ) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          onClick={() => {
            onSubmitUpdate();
          }}
        >
          <i className="bx bx bx-save font-size-16 align-middle mr-2"></i>
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
          <i className="bx bx bx-save font-size-16 align-middle mr-2"></i>
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
            title={message}
            success
            confirmBtnBsStyle="success"
            onConfirm={() => {
              setIsShowSweetAlert(false);
              setSelectedData(null);
              history.push(routes.users);
            }}
          >
            {sweetAlertType}
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
    let isEditUser = permissions.find(
      (value) => value.code === code_all_permissions.edit_user
    );
    let isResetPassword = permissions.find(
      (value) => value.code === code_all_permissions.reset_password
    );
    let isEditUserRole = permissions.find(
      (value) => value.code === code_all_permissions.edit_user_role
    );

    if (editUserValue && isEditUser) {
      isResetPassword && setResetPassword(true);
      delete editUserValue.changepass;
      delete editUserValue.created_at;
      delete editUserValue.update_at;
      delete editUserValue.password;

      isEditUserRole && props.readRole();
      isEditUserRole && setEditUserRole(true);
      setSelectedData({
        ...editUserValue,
        role: [editUserValue.roles[0].name],
      });
      setDirty();
    } else {
      history.push(routes.users);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Users"} breadcrumbItem={"Edit User"} />
          <Card>
            <CardBody>
              <div
                className="col-md-12 mb-3"
                style={{
                  display: "grid",
                  justifyItems: "flex-end",
                  gridTemplateColumns: "1fr auto",
                  columnGap: "8px",
                }}
              >
                {resetPassword && (
                  <button
                    type="button"
                    className="btn btn-danger waves-effect waves-light"
                    style={{ minWidth: "max-content" }}
                    onClick={() => {
                      setModalResetPassword(!modalResetPassword);
                    }}
                  >
                    <i className="bx bx-reset font-size-16 align-middle"></i>{" "}
                    Reset Password
                  </button>
                )}{" "}
                <ButtonSubmitUpdate />
              </div>
              <AvForm>
                <Row className="justify-content-center">
                  <Col md={8}>
                    <Row>
                      <Col md={6}>
                        <AvField
                          style={{ backgroundColor: "#ced4da" }}
                          name="username"
                          label="Username"
                          value={selectedData && selectedData.username}
                          disabled
                        />
                      </Col>
                      <Col md={6}>
                        <AvField
                          name="name"
                          label="Name"
                          placeholder="ex: Admin"
                          type="text"
                          errorMessage="Type name"
                          validate={{
                            required: { value: true },
                            maxLength: { value: 25 },
                          }}
                          value={selectedData && selectedData.name}
                          onChange={onChangeSelectedData}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <AvField
                          name="email"
                          label="Email"
                          placeholder="ex: admin@mail.com"
                          type="email"
                          errorMessage="Type valid email"
                          validate={{
                            required: { value: true },
                            maxLength: { value: 40 },
                          }}
                          value={selectedData && selectedData.email}
                          onChange={(event) =>
                            onValidateEmail(event.target.value)
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <FormGroup className="select2-container">
                          <label className="control-label">Gender</label>
                          <div>
                            <select
                              name="gender"
                              className="form-control"
                              defaultValue={selectedData && selectedData.gender}
                              onChange={(event) => (
                                setSelectedData({
                                  ...selectedData,
                                  gender: event.target.value,
                                }),
                                setDirty()
                              )}
                            >
                              <option value="default" disabled>
                                Select Gender
                              </option>
                              <option
                                value="L"
                                onChange={(event) => (
                                  setSelectedData({
                                    ...selectedData,
                                    gender: event.target.value,
                                  }),
                                  setDirty()
                                )}
                              >
                                Laki - laki
                              </option>
                              <option
                                value="P"
                                onChange={(event) => (
                                  setSelectedData({
                                    ...selectedData,
                                    gender: event.target.value,
                                  }),
                                  setDirty()
                                )}
                              >
                                Perempuan
                              </option>
                            </select>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        {editUserRole && (
                          <FormGroup className="select2-container">
                            <label className="control-label">Role</label>
                            <div>
                              <select
                                name="role"
                                className="form-control"
                                defaultValue={
                                  selectedData && selectedData.roles[0].name
                                }
                                onChange={(event) => (
                                  setSelectedData({
                                    ...selectedData,
                                    role: [event.target.value],
                                  }),
                                  setDirty()
                                )}
                              >
                                <option value="" disabled>
                                  Select Role
                                </option>
                                {option_role.map((value, index) => (
                                  <option
                                    key={index}
                                    value={value && value.value}
                                    onChange={(event) => (
                                      setSelectedData({
                                        ...selectedData,
                                        role: [event.target.value],
                                      }),
                                      setDirty()
                                    )}
                                  >
                                    {value.label}
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

          {/* Modal ResetPassword */}
          <Modal
            isOpen={modalResetPassword}
            toggle={() => {
              setModalResetPassword(!modalResetPassword);
              removeBodyCss();
              setSelectedData(null);
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Reset Password
              </h5>
              <button
                type="button"
                onClick={() => {
                  setModalResetPassword(false);
                  setSelectedData(null);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Are you sure want to reset password this user?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => {
                  setModalResetPassword(!modalResetPassword);
                  removeBodyCss();
                  setSelectedData(null);
                }}
                className="btn btn-secondary waves-effect"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger waves-effect waves-light"
                onClick={() => {
                  onSubmitResetPassword();
                }}
              >
                Reset Password
              </button>
            </div>
          </Modal>
        </Container>
        <ShowSweetAlert />
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { message_user, loading, response_code_user } = state.User;
  const { option_role } = state.Role;
  return {
    option_role,
    message_user,
    response_code_user,
    loading,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateUser,
      resetPassword,
      readRole,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(EditUser);
