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
import { readUserDetail, updateUser } from "../../../store/pages/users/actions";
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
  const option_role = props.option_role;
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
  const [isShowUpdateUser, setIsShowUpdateUser] = useState(false);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [sweetAlertText, setSweeAlertText] = useState(null);

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
      let role_name = null;
      user_detail.roles.map((value) => (role_name = value.name));
      setUpdateUserData(
        user_detail && {
          ...user_detail,
          role: [role_name],
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
              sessionStorage.setItem("name", updateUserData.name);
              sessionStorage.setItem("email", updateUserData.email);
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
      Object.values(updateUserData).every((value) => value !== "")
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
    let isEditUser = permissions.find(
      (value) => value.code === code_all_permissions.edit_user
    );
    if (isEditUser && username !== sessionStorage.getItem("username")) {
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
                    <Col md={4}>
                      <AvField
                        style={{ backgroundColor: "#ced4da" }}
                        name="username"
                        label="Username"
                        value={updateUserData && updateUserData.username}
                        disabled
                      />
                    </Col>
                    <Col md={4}>
                      <AvField
                        style={{ backgroundColor: "#ced4da" }}
                        name="name"
                        label="Name"
                        value={updateUserData && updateUserData.username}
                        disabled
                      />
                    </Col>
                  </Row>
                  <Row className="d-flex justify-content-center">
                    <Col md={3}>
                      <FormGroup className="select2-container">
                        <label className="control-label">Role</label>
                        <div>
                          <select
                            name="role"
                            className="form-control"
                            defaultValue={
                              updateUserData && updateUserData.role[0]
                            }
                            onChange={(event) => (
                              setUpdateUserData({
                                ...updateUserData,
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
                                  setUpdateUserData({
                                    ...updateUserData,
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
                    </Col>
                    <Col md={5}>
                      <FormGroup className="select2-container">
                        <label className="control-label">Status</label>
                        <div>
                          <select
                            name="status"
                            className="form-control"
                            defaultValue={
                              updateUserData && updateUserData.status
                            }
                            onChange={(event) => (
                              setUpdateUserData({
                                ...updateUserData,
                                status: [event.target.value],
                              }),
                              setDirty()
                            )}
                          >
                            {" "}
                            <option
                              value="Inactive"
                              onChange={() => (
                                setUpdateUserData({
                                  ...updateUserData,
                                  status: "Inactive",
                                }),
                                setDirty()
                              )}
                            >
                              Inactive
                            </option>
                            <option
                              value="Active"
                              onChange={() => (
                                setUpdateUserData({
                                  ...updateUserData,
                                  status: "Active",
                                }),
                                setDirty()
                              )}
                            >
                              Active
                            </option>
                          </select>
                        </div>
                      </FormGroup>
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
                        <th>Status</th>
                        <td>{user_detail && user_detail.status}</td>
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
                    </tbody>
                  </Table>
                </div>
              )}
            </CardBody>
          </Card>
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
  const { option_role } = state.Role;
  return {
    message_user,
    loading,
    response_code_user,
    user_detail,
    option_role,
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
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(DetailUser);
