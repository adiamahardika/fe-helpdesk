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
import "../../assets/css/pagination.css";

const Category = (props) => {
  const list_category = props.list_category;
  const message = props.message_category;
  const response_code = props.response_code_category;
  const total_pages_category = props.total_pages_category;
  const active_page_category = props.active_page_category;
  const permissions = JSON.parse(localStorage.getItem("permission"));
  const history = useHistory();

  const [data, setData] = useState({
    size: 10,
    page_no: 0,
    sort_by: "nama",
    order_by: "asc",
  });
  const [selectedData, setSelectedData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);

  const [modalDelete, setModalDelete] = useState(false);

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

  useEffect(() => {
    props.readCategory(data);
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Category"} breadcrumbItem={"Category"} />
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
                              props.readCategory({
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
                    <Col md="2">
                      <div className="form-group mb-0">
                        <label>Sort By</label>
                        <div>
                          <select
                            className="form-control"
                            defaultValue="nama"
                            onChange={(event) => (
                              setData({
                                ...data,
                                sort_by: event.target.value,
                              }),
                              props.readCategory({
                                ...data,
                                sort_by: event.target.value,
                              })
                            )}
                          >
                            <option value="nama">Name</option>
                            <option value="codeLevel">Code Level</option>
                            <option value="parent">Parent</option>
                            <option value="updateAt">Last Update</option>
                          </select>
                        </div>
                      </div>
                    </Col>
                    <Col md="2">
                      <div className="form-group mb-0">
                        <label>Sort By</label>
                        <div>
                          <select
                            className="form-control"
                            defaultValue="asc"
                            onChange={(event) => (
                              setData({
                                ...data,
                                order_by: event.target.value,
                              }),
                              props.readCategory({
                                ...data,
                                order_by: event.target.value,
                              })
                            )}
                          >
                            <option value="asc">ASC</option>
                            <option value="desc">DESC</option>
                          </select>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col md="2" className="d-flex justify-content-end">
                  <Link to={routes.add_category}>
                    <button
                      type="button"
                      className="btn btn-primary waves-effect waves-light"
                    >
                      <i className="bx bx-edit-alt font-size-16 align-middle mr-2"></i>{" "}
                      New
                    </button>
                  </Link>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md={10}>
                  <div className="table-responsive">
                    <Table className="table table-centered table-striped">
                      <thead>
                        <tr>
                          <th scope="col">No</th>
                          <th scope="col">Name</th>
                          <th scope="col">Code Level</th>
                          <th scope="col">Parent</th>
                          <th scope="col">Last Update</th>
                          <th scope="col">Action</th>
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
                                <td>{value.nama}</td>
                                <td>{value.codeLevel}</td>
                                <td>{value.parent}</td>
                                <td>{parseFullDate(value.updateAt)}</td>
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
                                    <Link
                                      to={{
                                        pathname: routes.edit_category,
                                        editValue: value,
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
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                    {list_category && list_category.length <= 0 && (
                      <div style={{ textAlign: "center" }}>No Data</div>
                    )}
                  </div>
                  <Row className="d-flex align-items-end">
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
                  </Row>
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
