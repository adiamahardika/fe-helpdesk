import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, Modal, Table, Col, Row } from "reactstrap";
import { readUser, deleteUser } from "../../../store/pages/users/actions";
import { readRole } from "../../../store/pages/role/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { parseFullDate } from "../../../helpers/index";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import code_all_permissions from "../../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactPaginate from "react-paginate";
import general_constant from "../../../helpers/general_constant.json";
import routes from "../../../helpers/routes.json";
import "../../../assets/css/pagination.css";

const Users = (props) => {
  const list_user = props.list_user;
  const message = props.message_user;
  const response_code = props.response_code_user;
  const total_pages_user = props.total_pages_user;
  const active_page_user = props.active_page_user;
  const permissions = JSON.parse(sessionStorage.getItem("permission"));
  const history = useHistory();

  const [deleteUser, setDeleteUser] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [editUser, setEditUser] = useState(false);

  const [modalDelete, setModalDelete] = useState(false);

  const [data, setData] = useState({ size: 10, page_no: 0, search: "*" });
  const [selectedData, setSelectedData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
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
              setSelectedData(null);
              history.push(routes.users);
            }}
          >
            The user has successfully deleted!
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
  const handlePageClick = (value) => {
    props.readUser({ ...data, page_no: value.selected });
    setData({ ...data, page_no: value.selected });
  };
  const EditButton = (value) => {
    let button = null;
    if (value.value.username === sessionStorage.getItem("username")) {
      button = (
        <Link
          to={{
            pathname: routes.profile,
            editUserValue: value.value,
          }}
        >
          <button
            type="button"
            className="btn btn-primary waves-effect waves-light"
            style={{ minWidth: "max-content" }}
          >
            <i className="bx bx-edit font-size-16 align-middle"></i>
          </button>
        </Link>
      );
    } else {
      button = (
        <Link
          to={{
            pathname: routes.edit_user,
            editUserValue: value.value,
          }}
        >
          <button
            type="button"
            className="btn btn-primary waves-effect waves-light"
            style={{ minWidth: "max-content" }}
          >
            <i className="bx bx-edit font-size-16 align-middle"></i>
          </button>
        </Link>
      );
    }
    return button;
  };

  useEffect(() => {
    let viewUsers = permissions.find(
      (value) => value.code === code_all_permissions.view_users
    );
    let isAddUser = permissions.find(
      (value) => value.code === code_all_permissions.add_user
    );
    let isEditUser = permissions.find(
      (value) => value.code === code_all_permissions.edit_user
    );
    let isDeleteUser = permissions.find(
      (value) => value.code === code_all_permissions.delete_user
    );

    if (viewUsers) {
      props.readUser(data);
      props.readRole();

      isAddUser && setAddUser(true);
      isEditUser && setEditUser(true);
      isDeleteUser && setDeleteUser(true);
    } else {
      history.push(routes.ticket);
    }
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Settings"} breadcrumbItem={"Users"} />
          <Card>
            <CardBody>
              <Row className="mb-3 d-flex align-items-end">
                <Col md="10">
                  <Row className="d-flex align-items-end">
                    <Col md="2">
                      <div className="form-group mb-0">
                        <label>Show Data</label>
                        <div>
                          <select
                            className="form-control"
                            defaultValue={10}
                            onChange={(event) => (
                              setData({
                                ...data,
                                size: parseInt(event.target.value),
                                page_no: 0,
                              }),
                              props.readUser({
                                ...data,
                                size: parseInt(event.target.value),
                                page_no: 0,
                              })
                            )}
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </div>
                      </div>
                    </Col>
                    <Col sm="4">
                      <div className="form-group mb-0">
                        <div>
                          <input
                            className="form-control"
                            type="search"
                            placeholder="Search..."
                            onChange={(event) =>
                              event.target.value === ""
                                ? (props.readUser({ ...data, search: "*" }),
                                  setData({
                                    ...data,
                                    search: event.target.value,
                                  }))
                                : setData({
                                    ...data,
                                    search: event.target.value,
                                  })
                            }
                          />
                        </div>
                      </div>
                    </Col>
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary waves-effect waves-light"
                        onClick={() => {
                          props.readUser(data);
                        }}
                      >
                        <i className="bx bx-search-alt-2 font-size-16 align-middle mr-2"></i>{" "}
                        Search
                      </button>
                    </div>
                  </Row>
                </Col>
                <Col md="2" className="d-flex justify-content-end">
                  {addUser && (
                    <Link to={routes.add_user}>
                      <button
                        type="button"
                        className="btn btn-primary waves-effect waves-light"
                      >
                        <i className="bx bx-edit-alt font-size-16 align-middle mr-2"></i>{" "}
                        New
                      </button>
                    </Link>
                  )}
                </Col>
              </Row>

              <div className="table-responsive">
                <Table className="table table-centered table-striped">
                  <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Name</th>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">NIK</th>
                      <th scope="col">Roles</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Create At</th>
                      <th scope="col">Last Update</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list_user &&
                      list_user.map((value, index) => {
                        return (
                          <tr key={value.id}>
                            <th scope="row">
                              <div>{index + 1}</div>
                            </th>
                            <td>{value.name}</td>
                            <td>{value.username}</td>
                            <td>{value.email}</td>
                            <td>{value.nik}</td>
                            <td>
                              {value.roles.map((rolesValue, index) => {
                                return (
                                  <div key={rolesValue.id}>
                                    {value.roles.length > 1 && index + 1 + "."}{" "}
                                    {rolesValue.name}
                                    <br />
                                  </div>
                                );
                              })}
                            </td>
                            <td>{value.gender}</td>
                            <td>{parseFullDate(value.created_at)}</td>
                            <td>{parseFullDate(value.update_at)}</td>
                            <td>
                              <div
                                style={{
                                  display: "grid",
                                  gridAutoFlow: "column",
                                  columnGap: "4px",
                                }}
                              >
                                {editUser && <EditButton value={value} />}
                                {deleteUser &&
                                  value.username !==
                                    sessionStorage.getItem("username") && (
                                    <button
                                      type="button"
                                      className="btn btn-danger waves-effect waves-light"
                                      style={{ minWidth: "max-content" }}
                                      onClick={() => {
                                        setSelectedData(value);
                                        setModalDelete(!modalDelete);
                                      }}
                                    >
                                      <i className="bx bx-trash font-size-16 align-middle"></i>
                                    </button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                {list_user && list_user.length <= 0 && (
                  <div style={{ textAlign: "center" }}>No Data</div>
                )}
              </div>
              <Row className="d-flex align-items-end">
                <ReactPaginate
                  previousLabel={"previous"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={total_pages_user}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={5}
                  forcePage={active_page_user}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              </Row>
            </CardBody>
          </Card>

          {/* Modal Delete */}
          <Modal
            isOpen={modalDelete}
            toggle={() => {
              setModalDelete(!modalDelete);
              removeBodyCss();
              setSelectedData(null);
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Delete User
              </h5>
              <button
                type="button"
                onClick={() => {
                  setModalDelete(false);
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
              Are you sure want to delete this user?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => {
                  setModalDelete(!modalDelete);
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
                  setIsShowSweetAlert(true);
                  props.deleteUser({ ...data, id: selectedData.id });
                  setModalDelete(!modalDelete);
                  removeBodyCss();
                }}
              >
                Delete
              </button>
            </div>
          </Modal>
          <ShowSweetAlert />
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const {
    list_user,
    message_user,
    response_code_user,
    loading,
    page_user,
    total_pages_user,
    active_page_user,
  } = state.User;
  const { option_role } = state.Role;
  return {
    list_user,
    option_role,
    response_code_user,
    message_user,
    page_user,
    total_pages_user,
    active_page_user,
    loading,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readUser,
      deleteUser,
      readRole,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(Users);
