import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Table,
  Button,
  FormGroup,
  Modal,
  Row,
  Col,
} from "reactstrap";
import { readPermission } from "../../../store/pages/permission/actions";
import {
  readUserDetail,
  updateUser,
  resetPassword,
  updateUserStatus,
} from "../../../store/pages/users/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import { readRole } from "../../../store/pages/role/actions";
import { useLocation } from "react-router-dom";
import code_all_permissions from "../../../helpers/code_all_permissions.json";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import SweetAlert from "react-bootstrap-sweetalert";
import general_constant from "../../../helpers/general_constant.json";
import UnsavedChangesWarning from "../../../helpers/unsaved_changes_warning";
import routes from "../../../helpers/routes.json";
import queryString from "query-string";
import CryptoJS from "crypto-js";
require("dotenv").config();

const DetailUser = (props) => {
  const message = props.message_user;
  const response_code = props.response_code_user;
  const user_detail = props.user_detail;
  const list_role = props.list_role;
  const history = useHistory();
  const { search } = useLocation();
  const { username } = queryString.parse(search);
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      sessionStorage.getItem("permission"),
      `${process.env.ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );

  const [updateUserData, setUpdateUserData] = useState(null);
  const [updateStatusData, setUpdateStatusData] = useState(null);
  const [validEmail, setValidEmail] = useState(true);
  const [modalResetPassword, setModalResetPassword] = useState(false);
  const [modalUpdateStatus, setModalUpdateStatus] = useState(false);
  const [isShowUpdateUser, setIsShowUpdateUser] = useState(false);
  const [isShowResetPassword, setIsShowResetPassword] = useState(false);
  const [isShowUpdateStatus, setIsShowUpdateStatus] = useState(false);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [sweetAlertText, setSweeAlertText] = useState(null);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const onChangeData = (event) => {
    setUpdateUserData({
      ...updateUserData,
      [event.target.name]: event.target.value,
    });
    setDirty();
  };
  const onValidateEmail = (email) => {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setUpdateUserData({
      ...updateUserData,
      email: email,
    });
    setDirty();
    if (regex.test(email) === true) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };
  const ShowUpdateStatus = () => {
    setUpdateStatusData(
      user_detail && {
        username: username,
        status: user_detail.status,
      }
    );
    setModalUpdateStatus(!modalUpdateStatus);
  };

  const onSubmitUpdateUser = async () => {
    delete updateUserData.roles;
    delete updateUserData.password;
    delete updateUserData.changepass;
    delete updateUserData.created_at;
    delete updateUserData.update_at;
    props.updateUser({
      ...updateUserData,
    });
    setSweeAlertText("User has successfully updated!");
    setIsShowSweetAlert(true);
    setPristine();
  };
  const onSubmitResetPassword = async () => {
    let password = Math.random().toString(20).substr(2, 8);

    await props.resetPassword({
      username: username,
      newPassword: password,
    });
    setSweeAlertText(`The user new password is ${password}`);
    setModalResetPassword(!modalResetPassword);
    setIsShowSweetAlert(true);
    removeBodyCss();
  };
  const onSubmitUpdateStatus = async () => {
    await props.updateUserStatus(updateStatusData);
    setSweeAlertText("User status has successfully updated!");
    setModalUpdateStatus(!modalUpdateStatus);
    setIsShowSweetAlert(true);
    removeBodyCss();
  };

  const ShowEditUser = () => {
    if (updateUserData === null) {
      let role_id = null;
      user_detail.roles.map((value) => (role_id = value.id));
      setUpdateUserData(
        user_detail && {
          ...user_detail,
          role: role_id.toString(),
        }
      );
    }
    setIsShowUpdateUser(!isShowUpdateUser);
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
              setIsShowUpdateUser(false);
              props.readUserDetail(username);
              setUpdateUserData(null);
              setPristine();
              history.push(routes.detail_user + "?username=" + username);
            }}
          >
            {sweetAlertText}
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

  const ButtonSubmitUpdateUser = () => {
    if (
      updateUserData &&
      Object.keys(updateUserData).length >= 7 &&
      Object.values(updateUserData).every((value) => value !== "") &&
      validEmail === true
    ) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          onClick={() => onSubmitUpdateUser()}
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

  useEffect(() => {
    let isUpdateUser = permissions.find(
      (value) => value.code === code_all_permissions.edit_user
    );
    let isResetPassword = permissions.find(
      (value) => value.code === code_all_permissions.reset_password
    );
    let isUpdateStatus = permissions.find(
      (value) => value.code === code_all_permissions.edit_user_status
    );

    if (isUpdateUser && username !== sessionStorage.getItem("username")) {
      isResetPassword && setIsShowResetPassword(true);
      isUpdateStatus && setIsShowUpdateStatus(true);
      props.readUserDetail(username);
      props.readPermission();
      props.readRole();
    } else {
      history.push(routes.users);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Users"} breadcrumbItem={"Detail User"} />
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
                {!isShowUpdateUser && isShowResetPassword && (
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
                )}
                {isShowUpdateUser ? (
                  <ButtonSubmitUpdateUser />
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light"
                    onClick={ShowEditUser}
                  >
                    <i className="bx bx-edit font-size-16 align-middle mr-2"></i>{" "}
                    Edit
                  </button>
                )}
              </div>
              {isShowUpdateUser ? (
                <AvForm>
                  <Row className="d-flex justify-content-center">
                    <Col md={8}>
                      <Row>
                        <Col md={6}>
                          <AvField
                            style={{ backgroundColor: "#ced4da" }}
                            name="username"
                            label="Username"
                            value={updateUserData && updateUserData.username}
                            disabled
                          />
                        </Col>
                        <Col md={6}>
                          <AvField
                            name="name"
                            label="Name"
                            value={updateUserData && updateUserData.name}
                            placeholder="ex: Admin"
                            type="text"
                            errorMessage="Enter Name"
                            validate={{
                              required: { value: true },
                              maxLength: { value: 30 },
                            }}
                            onChange={onChangeData}
                          />
                        </Col>
                      </Row>
                      <Row className="d-flex justify-content-center">
                        <Col md={5}>
                          <AvField
                            name="email"
                            label="Email"
                            value={updateUserData && updateUserData.email}
                            disabplaceholder="ex: admin@mail.com"
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
                            value={updateUserData && updateUserData.phone}
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
                          <FormGroup className="select2-container">
                            <label className="control-label">Role</label>
                            <div>
                              <select
                                name="role"
                                className="form-control"
                                defaultValue={
                                  updateUserData && updateUserData.role
                                }
                                onChange={(event) => (
                                  setUpdateUserData({
                                    ...updateUserData,
                                    role: event.target.value.toString(),
                                  }),
                                  setDirty()
                                )}
                              >
                                {list_role.map((value, index) => (
                                  <option
                                    key={index}
                                    value={value && value.id}
                                    onChange={(event) => (
                                      setUpdateUserData({
                                        ...updateUserData,
                                        role: event.target.value.toString(),
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
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </AvForm>
              ) : (
                <div className="table-responsive">
                  <Table className="table table-centered">
                    <tbody>
                      <tr>
                        <th>Username</th>
                        <td>{user_detail && user_detail.username}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Name</th>
                        <td>{user_detail && user_detail.name}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{user_detail && user_detail.email}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Phone</th>
                        <td>{user_detail && user_detail.phone}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Role</th>
                        <td>
                          {user_detail &&
                            user_detail.roles.map((value) => value.name)}
                        </td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>{user_detail && user_detail.status}</td>
                        <td
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          {isShowUpdateStatus && (
                            <Button
                              color="light"
                              className="waves-effect waves-light"
                              onClick={ShowUpdateStatus}
                            >
                              Change Status
                            </Button>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Modal ResetPassword */}
          <Modal
            isOpen={modalResetPassword}
            toggle={() => {
              setModalResetPassword(!modalResetPassword);
              removeBodyCss();
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

          <Modal isOpen={modalUpdateStatus}>
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Change Status
              </h5>
              <button
                type="button"
                onClick={() => {
                  setModalUpdateStatus(!modalUpdateStatus);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div
              className="modal-body"
              style={{ paddingLeft: "80px", paddingRight: "80px" }}
            >
              <AvForm>
                <FormGroup className="select2-container">
                  <label className="control-label">Status</label>
                  <div>
                    <select
                      name="status"
                      className="form-control"
                      defaultValue={updateStatusData && updateStatusData.status}
                      onChange={(event) => (
                        setUpdateStatusData({
                          ...updateStatusData,
                          status: event.target.value,
                        }),
                        setDirty()
                      )}
                    >
                      <option
                        value="Active"
                        onChange={() => (
                          setUpdateStatusData({
                            ...updateStatusData,
                            status: "Active",
                          }),
                          setDirty()
                        )}
                      >
                        Active
                      </option>
                      <option
                        value="Inactive"
                        onChange={() => (
                          setUpdateStatusData({
                            ...updateStatusData,
                            status: "Inactive",
                          }),
                          setDirty()
                        )}
                      >
                        Inactive
                      </option>
                    </select>
                  </div>
                </FormGroup>
              </AvForm>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => {
                  setModalUpdateStatus(!modalUpdateStatus);
                  removeBodyCss();
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
                  onSubmitUpdateStatus();
                }}
              >
                Save
              </button>
            </div>
          </Modal>
          {Prompt}
        </Container>
        <ShowSweetAlert />
      </div>
    </React.Fragment>
  );
};
const mapStatetoProps = (state) => {
  const { option_permission, list_permission } = state.Permission;
  const { message_user, loading, response_code_user, user_detail } = state.User;
  const { list_role } = state.Role;
  return {
    message_user,
    loading,
    response_code_user,
    user_detail,
    list_role,
    option_permission,
    list_permission,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readPermission,
      readUserDetail,
      updateUser,
      readRole,
      resetPassword,
      updateUserStatus,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(DetailUser);
