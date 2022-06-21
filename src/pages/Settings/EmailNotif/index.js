import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Modal,
  Table,
  Collapse,
  Row,
  Col,
} from "reactstrap";
import {
  readEmailNotif,
  deleteEmailNotif,
} from "../../../store/pages/emailNotif/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import code_all_permissions from "../../../helpers/code_all_permissions.json";
import list_all_permission from "../../../helpers/list_all_permission.json";
import SweetAlert from "react-bootstrap-sweetalert";
import general_constant from "../../../helpers/general_constant.json";
import routes from "../../../helpers/routes.json";
import CryptoJS from "crypto-js";
require("dotenv").config();

const EmailNotif = (props) => {
  const message = props.message_email_notif;
  const response_code = props.response_code_email_notif;
  const list_email_notif = props.list_email_notif;
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      sessionStorage.getItem("permission"),
      `${process.env.ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );
  const history = useHistory();

  const [addEmailNotif, setAddEmailNotif] = useState(true);
  const [editEmailNotif, setEditEmailNotif] = useState(true);
  const [deleteEmailNotif, setDeleteEmailNotif] = useState(false);

  const [modalDetail, setModalDetail] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [selectedData, setSelectedData] = useState(null);

  const [accordion, setAccordion] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };
  const handleUpdate = (value) => {
    setSelectedData(value);
  };

  const handleAccordion = (index, sub_level_1_index) => {
    if (accordion) {
      let newArray = [...accordion];

      if (sub_level_1_index >= 0) {
        newArray[index].sub_level_1[sub_level_1_index].isOpen =
          !accordion[index].sub_level_1[sub_level_1_index].isOpen;
      } else {
        newArray[index].isOpen = !accordion[index].isOpen;
      }

      setAccordion(newArray);
    }
  };

  const IsPermisiionIcon = (value) => {
    if (
      selectedData &&
      selectedData.listPermission.find(
        (listPermissionValue) => listPermissionValue.code === value.code
      )
    ) {
      return (
        <i
          className="bx bx-check-circle font-size-16 align-middle"
          style={{ color: "#34c38f" }}
        ></i>
      );
    } else {
      return (
        <i
          className="bx bx-x-circle font-size-16 align-middle"
          style={{ color: "#f46a6a" }}
        ></i>
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
              setSelectedData(null);
              setModalDelete(!modalDelete);
              setModalDetail(!modalDetail);
              removeBodyCss();
              history.push(routes.email_notif);
            }}
          >
            EmailNotif has successfully deleted!
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
    let newAccordion = [];
    // let viewEmailNotifs = permissions.find(
    //   (value) => value.code === code_all_permissions.view_email_notif
    // );
    // let isAddEmailNotif = permissions.find(
    //   (value) => value.code === code_all_permissions.add_email_notif
    // );
    // let isEditEmailNotif = permissions.find(
    //   (value) => value.code === code_all_permissions.edit_email_notif
    // );
    // let isDeleteEmailNotif = permissions.find(
    //   (value) => value.code === code_all_permissions.delete_email_notif
    // );

    // if (viewEmailNotifs) {
    props.readEmailNotif();

    // isAddEmailNotif && setAddEmailNotif(true);
    // isEditEmailNotif && setEditEmailNotif(true);
    // isDeleteEmailNotif && setDeleteEmailNotif(true);

    list_all_permission.map(
      (value, index) => (
        newAccordion.push({ isOpen: false, sub_level_1: [] }),
        value.sub_level_1 &&
          value.sub_level_1.map(() =>
            newAccordion[index].sub_level_1.push({
              isOpen: false,
            })
          )
      )
    );
    setAccordion(newAccordion);
    // } else {
    //   history.push(routes.ticket);
    // }
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Settings"} breadcrumbItem={"Email Notif"} />
          <Card>
            <CardBody>
              <CardTitle>Email Notif</CardTitle>
              {addEmailNotif && (
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
                  <Link to={routes.add_email_notif}>
                    <button
                      type="button"
                      className="btn btn-primary waves-effect waves-light"
                    >
                      <i className="bx bx-edit-alt font-size-16 align-middle mr-2"></i>{" "}
                      New
                    </button>
                  </Link>
                </div>
              )}
              <div className="table-responsive">
                <Table className="table table-centered">
                  <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Email</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list_email_notif &&
                      list_email_notif.map((value, index) => {
                        return (
                          <tr key={value.id}>
                            <th scope="row">
                              <div>{index + 1}</div>
                            </th>
                            <td>{value.email}</td>
                            <td>
                              <div
                                style={{
                                  display: "grid",
                                  rowGap: "8px",
                                  gridAutoFlow: "column",
                                  gridAutoColumns: "max-content",
                                  columnGap: "4px",
                                }}
                              >
                                {editEmailNotif && (
                                  <Link
                                    to={{
                                      pathname: routes.edit_email_notif,
                                      search: `?id=${value.id}`,
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className="btn btn-primary waves-effect waves-light"
                                      style={{ minWidth: "max-content" }}
                                      onClick={() => {
                                        handleUpdate(value);
                                      }}
                                    >
                                      <i className="bx bx-edit font-size-16 align-middle"></i>
                                    </button>
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                {list_email_notif && list_email_notif.length <= 0 && (
                  <div style={{ textAlign: "center" }}>No Data</div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Modal Detail */}
          <Modal
            isOpen={modalDetail}
            toggle={() => {
              setModalDetail(!modalDetail);
              removeBodyCss();
              setSelectedData(null);
            }}
            scrollable={true}
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                EmailNotif Detail
              </h5>
              <button
                type="button"
                onClick={() => {
                  setModalDetail(false);
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
              <table>
                <tr>
                  <th>Name</th>
                  <td>:</td>
                  <td>{selectedData && selectedData.name}</td>
                </tr>
                <tr>
                  <th>Permission</th>
                  <td>:</td>
                  <td>
                    {list_all_permission.map((value, index) => (
                      <div id="accordion" key={index}>
                        <div className="mb-2">
                          <div className="p-1" id="headingOne">
                            <h6 className="m-0 font-14">
                              <Row
                                onClick={() => handleAccordion(index)}
                                style={{ cursor: "pointer" }}
                                className="text-dark has-arrow align-content-center"
                              >
                                <Col md={2}>
                                  <IsPermisiionIcon
                                    code={value.code}
                                  ></IsPermisiionIcon>
                                </Col>
                                <Col md={2} className="pr-0">
                                  {value.code}
                                </Col>
                                <Col md={6} className="justify-content-start">
                                  {value.name}
                                </Col>
                                <Col md={2}>
                                  <i
                                    className={`bx ${
                                      accordion && accordion[index].isOpen
                                        ? `bx-chevron-up`
                                        : `bx-chevron-down`
                                    }  font-size-16 align-middle`}
                                  ></i>
                                </Col>
                              </Row>
                            </h6>
                          </div>

                          <Collapse
                            isOpen={accordion && accordion[index].isOpen}
                          >
                            {value.sub_level_1 &&
                              value.sub_level_1.map(
                                (sub_level_1_value, sub_level_1_index) => (
                                  <ul
                                    style={{
                                      listStyle: "none",
                                      paddingLeft: "1rem",
                                      marginBottom: "0.5rem",
                                    }}
                                    key={sub_level_1_index}
                                  >
                                    <li>
                                      <div className="has-arrow">
                                        <span
                                          onClick={() =>
                                            handleAccordion(
                                              index,
                                              sub_level_1_index
                                            )
                                          }
                                          style={{
                                            cursor: `${
                                              sub_level_1_value.sub_level_2
                                                ? "pointer"
                                                : "default"
                                            }`,
                                          }}
                                        >
                                          <Row className="align-content-center">
                                            <Col md={2}>
                                              <IsPermisiionIcon
                                                code={sub_level_1_value.code}
                                              ></IsPermisiionIcon>
                                            </Col>
                                            <Col md={2}>
                                              {sub_level_1_value.code}
                                            </Col>
                                            <Col
                                              md={
                                                sub_level_1_value.sub_level_2
                                                  ? 6
                                                  : 8
                                              }
                                              className="justify-content-start"
                                            >
                                              {sub_level_1_value.name}
                                            </Col>
                                            {sub_level_1_value.sub_level_2 && (
                                              <Col md={2}>
                                                <i
                                                  className={`bx ${
                                                    accordion &&
                                                    accordion[index]
                                                      .sub_level_1[
                                                      sub_level_1_index
                                                    ].isOpen
                                                      ? `bx-chevron-up`
                                                      : `bx-chevron-down`
                                                  }  font-size-16 align-middle`}
                                                ></i>
                                              </Col>
                                            )}
                                          </Row>
                                        </span>
                                      </div>
                                      <Collapse
                                        isOpen={
                                          accordion &&
                                          accordion[index].sub_level_1[
                                            sub_level_1_index
                                          ].isOpen
                                        }
                                      >
                                        {sub_level_1_value.sub_level_2 &&
                                          sub_level_1_value.sub_level_2.map(
                                            (
                                              sub_level_2_value,
                                              sub_level_2_index
                                            ) => (
                                              <Row
                                                className="align-content-center pl-3"
                                                key={sub_level_2_index}
                                              >
                                                <Col md={2}>
                                                  <IsPermisiionIcon
                                                    code={
                                                      sub_level_2_value.code
                                                    }
                                                  ></IsPermisiionIcon>
                                                </Col>
                                                <Col md={2} className="pr-0">
                                                  {sub_level_2_value.code}
                                                </Col>
                                                <Col
                                                  md={8}
                                                  className="justify-content-start"
                                                >
                                                  {sub_level_2_value.name}
                                                </Col>
                                              </Row>
                                            )
                                          )}
                                      </Collapse>
                                    </li>
                                  </ul>
                                )
                              )}
                          </Collapse>
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              </table>
            </div>
            <div className="modal-footer">
              {deleteEmailNotif && (
                <button
                  type="button"
                  className="btn btn-danger waves-effect waves-light"
                  style={{ minWidth: "max-content" }}
                  onClick={() => {
                    setModalDelete(!modalDelete);
                  }}
                >
                  <i className="bx bx-trash font-size-16 align-middle"></i>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setModalDetail(!modalDetail);
                  removeBodyCss();
                  setSelectedData(null);
                }}
                className="btn btn-secondary waves-effect"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </Modal>

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
                Delete EmailNotif
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
              Are you sure want to delete this email_notif?
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
                  props.deleteEmailNotif(selectedData.id);
                  setIsShowSweetAlert(true);
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
    list_email_notif,
    loading,
    response_code_email_notif,
    message_email_notif,
  } = state.EmailNotif;
  return {
    list_email_notif,
    loading,
    response_code_email_notif,
    message_email_notif,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readEmailNotif,
      deleteEmailNotif,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(EmailNotif);
