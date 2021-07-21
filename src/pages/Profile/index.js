import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Table,
  Button,
  FormGroup,
  Modal,
} from "reactstrap";
import { readPermission } from "../../store/pages/permission/actions";
import {
  readUserDetail,
  updateUserProfile,
  updateUser,
} from "../../store/pages/users/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import { readRole } from "../../store/pages/role/actions";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import SweetAlert from "react-bootstrap-sweetalert";
import general_constant from "../../helpers/general_constant.json";
import UnsavedChangesWarning from "../../helpers/unsaved_changes_warning";
import routes from "../../helpers/routes.json";
import queryString from "query-string";

const Profile = (props) => {
  const message = props.message_user;
  const response_code = props.response_code_user;
  const user_detail = props.user_detail;
  const history = useHistory();
  const { search } = useLocation();
  const { username } = queryString.parse(search);
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [updateUserData, setUpdateUserData] = useState(null);
  const [validEmail, setValidEmail] = useState(true);
  const [validNik, setValidNik] = useState(true);
  const [validOldPassword, setValidOldPassword] = useState(false);
  const [validNewPassword, setValidNewPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState(null);

  const [isShowChangePassword, setIsShowChangePassword] = useState(false);
  const [isShowUpdateUser, setIsShowUpdateUser] = useState(false);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [isShowOldPassword, setIsShowOldPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [sweetAlertText, setSweeAlertText] = useState(null);

  const onChangeUpdateUserData = (event) => {
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
  const onValidateNik = (nik) => {
    let regex = /^[0-9]+$/;
    setUpdateUserData({
      ...updateUserData,
      nik: nik,
    });
    setDirty();
    if (regex.test(nik) === true) {
      setValidNik(true);
    } else {
      setValidNik(false);
    }
  };
  const onValidateNewPassword = (value) => {
    let regex = /^[A-Za-z0-9]+$/;
    setUpdateUserData({
      ...updateUserData,
      newPassword: value,
    });
    setDirty();
    if (regex.test(value) === true && value.length >= 8 && value.length <= 12) {
      setValidNewPassword(true);
    } else {
      setValidNewPassword(false);
    }
  };
  const onValidateOldPassword = (value) => {
    let regex = /^[A-Za-z0-9]+$/;
    setUpdateUserData({
      ...updateUserData,
      oldPassword: value,
    });
    setDirty();
    if (regex.test(value) === true && value.length >= 8 && value.length <= 12) {
      setValidOldPassword(true);
    } else {
      setValidOldPassword(false);
    }
  };
  const onSubmitChangePassword = async () => {
    delete updateUserData.roles;
    delete updateUserData.password;
    delete updateUserData.changepass;
    delete updateUserData.created_at;
    delete updateUserData.updated_at;
    await props.updateUserProfile({
      ...updateUserData,
    });
    setSweeAlertText("Password has successfully changed!");
    setIsShowSweetAlert(true);
    setPristine();
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
    setSweeAlertText("Your profile has successfully edited!");
    setIsShowSweetAlert(true);
    delete updateUserData.oldPassword;
    delete updateUserData.newPassword;
    setPristine();
  };

  const ShowEditUser = () => {
    if (updateUserData === null) {
      setUpdateUserData(
        user_detail && {
          ...user_detail,
          role: [user_detail.roles[0].name],
        }
      );
    }
    setIsShowUpdateUser(!isShowUpdateUser);
  };
  const ShowChangePassword = () => {
    if (updateUserData === null) {
      setUpdateUserData(
        user_detail && {
          ...user_detail,
          role: [user_detail.roles[0].name],
        }
      );
    }
    setIsShowChangePassword(!isShowChangePassword);
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
              setIsShowChangePassword(false);
              setIsShowUpdateUser(false);
              setConfirmNewPassword(null);
              props.readUserDetail(username);
              sessionStorage.setItem("name", updateUserData.name);
              sessionStorage.setItem("email", updateUserData.email);
              setUpdateUserData(null);
              setPristine();
              history.push(routes.profile + "?username=" + username);
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

  const ButtonSubmitChangePassword = () => {
    if (
      updateUserData &&
      updateUserData.newPassword &&
      updateUserData.oldPassword &&
      updateUserData.newPassword === confirmNewPassword &&
      validNewPassword &&
      validOldPassword &&
      confirmNewPassword &&
      Object.keys(updateUserData).length >= 9 &&
      Object.values(updateUserData).every((value) => value !== "")
    ) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          onClick={() => {
            onSubmitChangePassword();
          }}
        >
          <i className="bx bx bx-save font-size-16 align-middle mr-2"></i>
          Save Password
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
          Save Password
        </button>
      );
    }
  };

  const ButtonSubmitUpdateUser = () => {
    if (
      updateUserData &&
      Object.keys(updateUserData).length >= 7 &&
      Object.values(updateUserData).every((value) => value !== "") &&
      validEmail === true &&
      validNik === true
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
    if (props.location.editUserValue) {
      setIsShowUpdateUser(true);
      setUpdateUserData(props.location.editUserValue);
    }
    props.readUserDetail(username);
    props.readPermission();
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Users"} breadcrumbItem={"Profile"} />
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
                  <AvField
                    style={{ backgroundColor: "#ced4da" }}
                    name="username"
                    label="Username"
                    value={updateUserData && updateUserData.username}
                    disabled
                  />
                  <AvField
                    name="name"
                    label="Name"
                    placeholder="ex: Admin"
                    type="text"
                    errorMessage="Type your name"
                    validate={{
                      required: { value: true },
                      maxLength: { value: 16 },
                    }}
                    value={updateUserData && updateUserData.name}
                    onChange={onChangeUpdateUserData}
                  />
                  <AvField
                    name="nik"
                    label="NIK"
                    placeholder="ex: 3175000000000"
                    type="text"
                    errorMessage="Length of NIK must be 16 character"
                    validate={{
                      required: { value: true },
                      maxLength: { value: 16 },
                      minLength: { value: 16 },
                      pattern: { value: "^[0-9]+$" },
                    }}
                    value={updateUserData && updateUserData.nik}
                    onChange={(event) => onValidateNik(event.target.value)}
                  />
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
                    value={updateUserData && updateUserData.email}
                    onChange={(event) => onValidateEmail(event.target.value)}
                  />
                  <FormGroup className="select2-container">
                    <label className="control-label">Gender</label>
                    <div>
                      <select
                        name="gender"
                        className="form-control"
                        defaultValue={updateUserData && updateUserData.gender}
                        onClick={(event) => (
                          setUpdateUserData({
                            ...updateUserData,
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
                          onClick={(event) => (
                            setUpdateUserData({
                              ...updateUserData,
                              gender: event.target.value,
                            }),
                            setDirty()
                          )}
                        >
                          Laki - laki
                        </option>
                        <option
                          value="P"
                          onClick={(event) => (
                            setUpdateUserData({
                              ...updateUserData,
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
                        <th>NIK</th>
                        <td>{user_detail && user_detail.nik}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{user_detail && user_detail.email}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Gender</th>
                        <td>{user_detail && user_detail.gender}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Role</th>
                        <td>{user_detail && user_detail.roles[0].name}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Password</th>
                        <td>********</td>
                        <td
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            color="light"
                            className="waves-effect waves-light"
                            onClick={ShowChangePassword}
                          >
                            Change Password
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              )}
            </CardBody>
          </Card>
          {Prompt}
          <Modal isOpen={isShowChangePassword}>
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Change Password
              </h5>
              <button
                type="button"
                onClick={() => {
                  setIsShowChangePassword(!isShowChangePassword);
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
              <div className="d-flex justify-content-center">
                <AvForm>
                  <div className="form-group mb-0" style={{ display: "grid" }}>
                    <label
                      htmlFor="example-datetime-local-input"
                      className="col-form-label"
                    >
                      Current Password
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
                        name="oldPassword"
                        type={isShowOldPassword ? "text" : "password"}
                        errorMessage="Type your valid current password"
                        validate={{
                          required: { value: true },
                          maxLength: { value: 12 },
                          minLength: { value: 8 },
                          pattern: { value: "^[A-Za-z0-9]+$" },
                        }}
                        value={updateUserData && updateUserData.oldPassword}
                        onChange={(event) =>
                          onValidateOldPassword(event.target.value)
                        }
                      />
                      <Button
                        color="light"
                        outline
                        onClick={() => setIsShowOldPassword(!isShowOldPassword)}
                      >
                        {isShowOldPassword ? (
                          <i className="bx bx-hide font-size-16 align-middle"></i>
                        ) : (
                          <i className="bx bx-show font-size-16 align-middle"></i>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="form-group mb-0" style={{ display: "grid" }}>
                    <label
                      htmlFor="example-datetime-local-input"
                      className="col-form-label"
                    >
                      New Password
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
                        name="newPassword"
                        type={isShowNewPassword ? "text" : "password"}
                        errorMessage="New password must be 8 - 12 character and cannot contain special character"
                        validate={{
                          required: { value: true },
                          maxLength: { value: 12 },
                          minLength: { value: 8 },
                          pattern: { value: "^[A-Za-z0-9]+$" },
                        }}
                        value={updateUserData && updateUserData.newPassword}
                        onChange={(event) =>
                          onValidateNewPassword(event.target.value)
                        }
                      />
                      <Button
                        color="light"
                        outline
                        onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                      >
                        {isShowNewPassword ? (
                          <i className="bx bx-hide font-size-16 align-middle"></i>
                        ) : (
                          <i className="bx bx-show font-size-16 align-middle"></i>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="form-group mb-0" style={{ display: "grid" }}>
                    <label
                      htmlFor="example-datetime-local-input"
                      className="col-form-label"
                    >
                      Re-Type New Password
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
                        name="confirmNewPassword"
                        type={isShowConfirmPassword ? "text" : "password"}
                        errorMessage="New Password do not match"
                        validate={{
                          required: { value: true },
                          maxLength: { value: 12 },
                          pattern: { value: "^[A-Za-z0-9]+$" },
                          match: { value: "newPassword" },
                        }}
                        onChange={(event) =>
                          setConfirmNewPassword(event.target.value)
                        }
                        value={confirmNewPassword}
                      />
                      <Button
                        color="light"
                        outline
                        onClick={() =>
                          setIsShowConfirmPassword(!isShowConfirmPassword)
                        }
                      >
                        {isShowConfirmPassword ? (
                          <i className="bx bx-hide font-size-16 align-middle"></i>
                        ) : (
                          <i className="bx bx-show font-size-16 align-middle"></i>
                        )}
                      </Button>
                    </div>
                  </div>
                </AvForm>
              </div>
            </div>
            <div className="modal-footer">
              <ButtonSubmitChangePassword />
            </div>
          </Modal>
        </Container>
        <ShowSweetAlert />
      </div>
    </React.Fragment>
  );
};
const mapStatetoProps = (state) => {
  const { option_permission, list_permission } = state.Permission;
  const { message_user, loading, response_code_user, user_detail } = state.User;
  return {
    message_user,
    loading,
    response_code_user,
    user_detail,
    option_permission,
    list_permission,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readPermission,
      readUserDetail,
      updateUserProfile,
      updateUser,
      readRole,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(Profile);
