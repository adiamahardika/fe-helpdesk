import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, Table, Col, Row, Modal } from "reactstrap";
import {
  readCategory,
  deleteCategory,
} from "../../store/pages/category/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { parseFullDate } from "../../helpers/index";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactPaginate from "react-paginate";
import general_constant from "../../helpers/general_constant.json";
import routes from "../../helpers/routes.json";
import CryptoJS from "crypto-js";
import "../../assets/css/pagination.css";
import "../../assets/css/style.css";
require("dotenv").config();

const Category = (props) => {
  const list_category = props.list_category;
  const message = props.message_category;
  const response_code = props.response_code_category;
  const total_pages_category = props.total_pages_category;
  const active_page_category = props.active_page_category;
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      sessionStorage.getItem("permission"),
      `${process.env.ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );;
  const history = useHistory();

  const [data, setData] = useState({
    size: 0,
    page_no: 0,
    sort_by: "nama",
    order_by: "asc",
  });
  const [selectedData, setSelectedData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [isAddCategory, setIsAddCategory] = useState(false);

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
              history.push(routes.category);
            }}
          >
            The category has successfully deleted!
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
    let viewCategory = permissions.find(
      (value) => value.code === code_all_permissions.view_category
    );
    let addCategory = permissions.find(
      (value) => value.code === code_all_permissions.add_category
    );
    if (viewCategory) {
      props.readCategory(data);

      addCategory && setIsAddCategory(true);
    } else {
      history.push(routes.ticket);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Category"} breadcrumbItem={"Category"} />
          <Card>
            <CardBody>
              <Row className="mb-3 d-flex align-items-end">
                <Col className="d-flex justify-content-end">
                  {isAddCategory && (
                    <Link to={routes.add_category}>
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
              <Row>
                <Col>
                  <ol
                    className="sub-menu "
                    aria-expanded="true"
                    style={{
                      listStyle: "upper-alpha",
                      fontSize: "24px",
                      fontWeight: "600",
                      display: "grid",
                      gridTemplateColumns: "repeat(2,1fr)",
                      columnGap: "32px",
                    }}
                  >
                    {list_category &&
                      list_category.map(
                        (value) =>
                          value.parent === "0" && (
                            <div>
                              <li
                                style={{
                                  borderBottomColor: "#cfcfcf",
                                  borderBottomStyle: "solid",
                                  borderBottomWidth: "0.5px",
                                  marginBottom: "8px",
                                }}
                              >
                                <div
                                  className="custom-checkbox d-flex hover-text"
                                  style={{ width: "max-content" }}
                                >
                                  <Link
                                    to={{
                                      pathname: routes.edit_category,
                                      search: `?code=${value.codeLevel}`,
                                    }}
                                    style={{
                                      color: "#343a40",
                                    }}
                                    className=" waves-effect text-right"
                                  >
                                    {value.nama}
                                  </Link>
                                </div>
                              </li>
                              <ol
                                className="sub-menu"
                                aria-expanded="true"
                                style={{
                                  listStyleType: "number",
                                  fontSize: "20px",
                                  fontWeight: "500",
                                }}
                              >
                                {list_category &&
                                  list_category.map(
                                    (sl1_value, sl1_index) =>
                                      sl1_value.parent === value.codeLevel && (
                                        <>
                                          <li
                                            style={{
                                              borderBottomColor: "#cfcfcf",
                                              borderBottomStyle: "solid",
                                              borderBottomWidth: "0.5px",
                                              marginBottom: "8px",
                                            }}
                                          >
                                            <div
                                              className="d-flex custom-checkbox hover-text"
                                              style={{ width: "max-content" }}
                                            >
                                              <Link
                                                to={{
                                                  pathname:
                                                    routes.edit_category,
                                                  search: `?code=${sl1_value.codeLevel}`,
                                                }}
                                                style={{ color: "#343a40" }}
                                                className=" waves-effect text-right "
                                              >
                                                {sl1_value.nama}
                                              </Link>
                                            </div>
                                          </li>
                                          <ol
                                            className="sub-menu"
                                            aria-expanded="true"
                                            style={{
                                              listStyleType: "upper-alpha",
                                              fontSize: "18px",
                                              fontWeight: "500",
                                            }}
                                          >
                                            {list_category &&
                                              list_category.map(
                                                (sl2_value, sl2_index) =>
                                                  sl2_value.parent ===
                                                    sl1_value.codeLevel && (
                                                    <>
                                                      <li
                                                        style={{
                                                          borderBottomColor:
                                                            "#cfcfcf",
                                                          borderBottomStyle:
                                                            "solid",
                                                          borderBottomWidth:
                                                            "0.5px",
                                                          marginBottom: "8px",
                                                        }}
                                                      >
                                                        <div
                                                          className="d-flex custom-checkbox hover-text"
                                                          style={{
                                                            width:
                                                              "max-content",
                                                          }}
                                                        >
                                                          <Link
                                                            to={{
                                                              pathname:
                                                                routes.edit_category,
                                                              search: `?code=${sl2_value.codeLevel}`,
                                                            }}
                                                            style={{
                                                              color: "#343a40",
                                                            }}
                                                            className=" waves-effect text-right "
                                                          >
                                                            {sl2_value.nama}
                                                          </Link>
                                                        </div>
                                                      </li>
                                                      <ol
                                                        className="sub-menu"
                                                        aria-expanded="true"
                                                        style={{
                                                          listStyleType:
                                                            "number",
                                                          fontSize: "16px",
                                                          fontWeight: "400",
                                                        }}
                                                      >
                                                        {list_category &&
                                                          list_category.map(
                                                            (sl3_value) =>
                                                              sl3_value.parent ===
                                                                sl2_value.codeLevel && (
                                                                <li
                                                                  style={{
                                                                    borderBottomColor:
                                                                      "#cfcfcf",
                                                                    borderBottomStyle:
                                                                      "solid",
                                                                    borderBottomWidth:
                                                                      "0.5px",
                                                                    marginBottom:
                                                                      "8px",
                                                                  }}
                                                                >
                                                                  <div
                                                                    className="d-flex custom-checkbox hover-text"
                                                                    style={{
                                                                      width:
                                                                        "max-content",
                                                                    }}
                                                                  >
                                                                    <Link
                                                                      to={{
                                                                        pathname:
                                                                          routes.edit_category,
                                                                        search: `?code=${sl3_value.codeLevel}`,
                                                                      }}
                                                                      style={{
                                                                        color:
                                                                          "#343a40",
                                                                      }}
                                                                      className=" waves-effect text-right "
                                                                    >
                                                                      {
                                                                        sl3_value.nama
                                                                      }
                                                                    </Link>
                                                                  </div>
                                                                </li>
                                                              )
                                                          )}
                                                      </ol>
                                                    </>
                                                  )
                                              )}
                                          </ol>
                                        </>
                                      )
                                  )}
                              </ol>
                            </div>
                          )
                      )}
                  </ol>
                </Col>
              </Row>
            </CardBody>
          </Card>
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
              Are you sure want to delete this category?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger waves-effect waves-light"
                onClick={() => {
                  setIsShowSweetAlert(true);
                  props.deleteCategory({ ...data, id: selectedData.id });
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
    list_category,
    message_category,
    response_code_category,
    loading,
    total_pages_category,
    active_page_category,
  } = state.Category;
  return {
    list_category,
    response_code_category,
    message_category,
    total_pages_category,
    active_page_category,
    loading,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readCategory,
      deleteCategory,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(Category);
