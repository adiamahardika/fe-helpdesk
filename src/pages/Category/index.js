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
  );
  const history = useHistory();

  const [data, setData] = useState({
    size: 10,
    page_no: 0,
    sort_by: "name",
    order_by: "asc",
  });
  const [selectedData, setSelectedData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
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
  const handlePageClick = (value) => {
    props.readCategory({ ...data, page_no: value.selected });
    setData({ ...data, page_no: value.selected });
  };
  const PriorityLabel = (value) => {
    if (value) {
      let index = general_constant.priority.findIndex(
        (item) => item.name === value.value
      );
      let color =
        index >= 0 ? general_constant.priority[index].color : "#343a40";

      return (
        <h6 style={{ color: color }}>
          <span
            className="badge"
            style={{
              fontSize: "12px",
              display: "inlineBlock",
              padding: "0.25rem 0.5rem",
              fontWeight: "bold",
              borderRadius: "0.5rem",
              backgroundColor: color,
              color: "#ffffff",
            }}
          >
            {value.value}
          </span>
        </h6>
      );
    }
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
              <Row className="justify-content-center">
                <Col md={8}>
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
                  <div className="table-responsive">
                    <Table className="table table-centered table-striped">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list_category &&
                          list_category.map((value, index) => {
                            return (
                              <tr key={value.id}>
                                <th scope="row">
                                  <div>{index + 1}</div>
                                </th>
                                <td>{value.name}</td>
                                <td>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridAutoFlow: "column",
                                      columnGap: "4px",
                                      gridTemplateColumns:
                                        "repeat(2, max-content)",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className="btn btn-info waves-effect waves-light"
                                      style={{ minWidth: "max-content" }}
                                      onClick={() => {
                                        setSelectedData(value);
                                        setModalDetail(!modalDetail);
                                      }}
                                    >
                                      <i className="bx bx-show-alt font-size-16 align-middle"></i>
                                    </button>
                                    <Link
                                      to={{
                                        pathname: routes.edit_category,
                                        search: `?id=${value.id}`,
                                      }}
                                    >
                                      <button
                                        type="button"
                                        className="btn btn-primary waves-effect waves-light"
                                        style={{ minWidth: "max-content" }}
                                      >
                                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                                      </button>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                  {list_category && list_category.length > 0 && (
                    <Row className="d-flex align-items-end">
                      <Col md="6">
                        <div className="form-group mb-0 d-flex flex-row align-items-end">
                          <label>Show Data</label>
                          <div className="ml-2">
                            <select
                              className="form-control"
                              defaultValue={10}
                              onChange={(event) => (
                                setData({
                                  ...data,
                                  size: parseInt(event.target.value),
                                  pageNo: 0,
                                }),
                                props.readCategory({
                                  ...data,
                                  size: parseInt(event.target.value),
                                  pageNo: 0,
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
                      <Col
                        className="justify-content-end"
                        style={{ display: "grid" }}
                      >
                        <ReactPaginate
                          previousLabel={"previous"}
                          nextLabel={"next"}
                          breakLabel={"..."}
                          breakClassName={"break-me"}
                          pageCount={total_pages_category}
                          marginPagesDisplayed={1}
                          pageRangeDisplayed={5}
                          forcePage={active_page_category}
                          onPageChange={handlePageClick}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                        />
                      </Col>
                    </Row>
                  )}
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

          <Modal
            isOpen={modalDetail}
            toggle={() => {
              setModalDetail(!modalDetail);
              removeBodyCss();
              setSelectedData(null);
            }}
            size="lg"
          >
            <div
              className="modal-header"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr repeat(2, max-content)",
                columnGap: "1rem",
                alignItems: "center",
              }}
            >
              <h5 className="modal-title mt-0" id="myModalLabel">
                Detail Category
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
              <Row className="justify-content-center">
                <Col>
                  <div className="table-responsive">
                    <Table className="table table-centered">
                      <tbody>
                        <tr>
                          <th>Name</th>
                          <td>{selectedData && selectedData.name}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Sub Category</th>
                          <td></td>
                          <td></td>
                        </tr>
                        {selectedData &&
                          selectedData.subCategory.map((value, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{value.name}</td>
                              <td>
                                <PriorityLabel value={value.priority} />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
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
