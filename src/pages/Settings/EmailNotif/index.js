import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, CardTitle, Modal, Table } from "reactstrap";
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
      localStorage.getItem("permission"),
      `${process.env.REACT_APP_ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );
  const history = useHistory();

  const [addEmailNotif, setAddEmailNotif] = useState(false);
  const [editEmailNotif, setEditEmailNotif] = useState(false);
  const [deleteEmailNotif, setDeleteEmailNotif] = useState(false);

  const [modalDetail, setModalDetail] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [selectedData, setSelectedData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };
  const handleUpdate = (value) => {
    setSelectedData(value);
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
            Email notif has successfully deleted!
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
    let viewEmailNotif = permissions.find(
      (value) => value.code === code_all_permissions.view_email_notif
    );
    let isAddEmailNotif = permissions.find(
      (value) => value.code === code_all_permissions.add_email_notif
    );
    let isEditEmailNotif = permissions.find(
      (value) => value.code === code_all_permissions.edit_email_notif
    );
    let isDeleteEmailNotif = permissions.find(
      (value) => value.code === code_all_permissions.delete_email_notif
    );

    if (viewEmailNotif) {
      props.readEmailNotif();

      isAddEmailNotif && setAddEmailNotif(true);
      isEditEmailNotif && setEditEmailNotif(true);
      isDeleteEmailNotif && setDeleteEmailNotif(true);
    } else {
      history.push(routes.ticket);
    }
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
                                )}{" "}
                                {deleteEmailNotif && (
                                  <button
                                    type="button"
                                    className="btn btn-danger waves-effect waves-light"
                                    style={{ minWidth: "max-content" }}
                                    onClick={() => {
                                      setModalDelete(!modalDelete);
                                      setSelectedData(value);
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
                {list_email_notif && list_email_notif.length <= 0 && (
                  <div style={{ textAlign: "center" }}>No Data</div>
                )}
              </div>
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
                Delete Email Notif
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
              Are you sure want to delete this email notif?
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
