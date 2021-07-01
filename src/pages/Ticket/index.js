import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Modal,
  Table,
  Col,
  Row,
  Badge,
} from "reactstrap";
import { readTicket } from "../../store/pages/ticket/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { parseFullDate } from "../../helpers/index";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactPaginate from "react-paginate";
import general_constant from "../../helpers/general_constant.json";
import routes from "../../helpers/routes.json";
import "../../assets/css/pagination.css";

const Ticket = (props) => {
  const list_ticket = props.list_ticket;
  const message = props.message_ticket;
  const response_code = props.response_code_ticket;
  const total_pages_ticket = props.total_pages_ticket;
  const active_page_ticket = props.active_page_ticket;
  const permissions = JSON.parse(localStorage.getItem("permission"));
  const history = useHistory();

  const [modalDetail, setModalDetail] = useState(false);

  const [data, setData] = useState({
    pageSize: 10,
    pageNo: 0,
    search: "*",
    sortBy: "tglDibuat",
    sortType: "desc",
  });
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
              history.push(routes.ticket);
            }}
          >
            The ticket has successfully deleted!
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
    props.readTicket({ ...data, pageNo: value.selected });
    setData({ ...data, pageNo: value.selected });
  };
  const StatusLabel = (value) => {
    let color = null;
    if (value) {
      switch (value.value) {
        case "New":
          color = "#f46a6a";
          break;
        case "Waiting Reply":
          color = "#f1b44c";
          break;
        case "Replied":
          color = "#556ee6";
          break;
        case "In Progress":
          color = "#34c38f";
          break;
        case "Resolved":
          color = "#34c38f";
          break;
        case "On Hold":
          color = "#343a40";
          break;
        default:
          color = "#34c38f";
      }
      return <td style={{ color: color }}>{value.value}</td>;
    }
  };
  const PriorityLabel = (value) => {
    let color = null;
    if (value) {
      switch (value.value) {
        case "High":
          color = "#f46a6a";
          break;
        case "Medium":
          color = "#f1b44c";
          break;
        case "Critical":
          color = "#9400d3";
          break;
        case "Low":
          color = "#34c38f";
          break;
        default:
          color = "#34c38f";
      }
      return (
        <span
          style={{
            fontSize: "12px",
            display: "inlineBlock",
            padding: "0.5rem 0.75rem",
            fontWeight: "bold",
            borderRadius: "0.5rem",
            backgroundColor: color,
            color: "#ffffff",
          }}
        >
          #{value.value}
        </span>
      );
    }
  };

  useEffect(() => {
    props.readTicket(data);
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Ticket"} breadcrumbItem={"Ticket"} />
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
                                pageSize: parseInt(event.target.value),
                                pageNo: 0,
                              }),
                              props.readTicket({
                                ...data,
                                pageSize: parseInt(event.target.value),
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
                    <Col md="2">
                      <div className="form-group mb-0">
                        <label>Sort By</label>
                        <div>
                          <select
                            className="form-control"
                            defaultValue={10}
                            onChange={(event) => (
                              setData({
                                ...data,
                                sortBy: event.target.value,
                              }),
                              props.readTicket({
                                ...data,
                                sortBy: event.target.value,
                              })
                            )}
                          >
                            <option value="tglDibuat">Submitted</option>
                            <option value="judul">Subject</option>
                            <option value="terminalId">Terminal Id</option>
                            <option value="status">Status</option>
                          </select>
                        </div>
                      </div>
                    </Col>
                    <Col md="2">
                      <div className="form-group mb-0">
                        <div>
                          <select
                            className="form-control"
                            defaultValue={10}
                            onChange={(event) => (
                              setData({
                                ...data,
                                sortType: event.target.value,
                              }),
                              props.readTicket({
                                ...data,
                                sortType: event.target.value,
                              })
                            )}
                          >
                            <option value="desc">DESC</option>
                            <option value="asc">ASC</option>
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
                                ? (props.readTicket({ ...data, search: "*" }),
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
                          props.readTicket(data);
                        }}
                      >
                        <i className="bx bx-search-alt-2 font-size-16 align-middle mr-2"></i>{" "}
                        Search
                      </button>
                    </div>
                  </Row>
                </Col>
                <Col md="2" className="d-flex justify-content-end">
                  <Link to={routes.add_ticket}>
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

              <div className="table-responsive">
                <Table className="table table-centered table-striped">
                  <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th scope="col">Ticket Id</th>
                      <th scope="col">Terminal Id</th>
                      <th scope="col">Location</th>
                      <th scope="col">Submitted</th>
                      <th scope="col">Category</th>
                      <th scope="col">Subject</th>
                      <th scope="col">Status</th>
                      <th scope="col">Priority</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list_ticket &&
                      list_ticket.map((value, index) => {
                        return (
                          <tr key={value.id}>
                            <th scope="row">
                              <div>{index + 1}</div>
                            </th>
                            <td>{value.kodeTicket}</td>
                            <td>{value.terminalId}</td>
                            <td>{value.lokasi}</td>
                            <td style={{ minWidth: "100px" }}>
                              {parseFullDate(value.tglDibuat)}
                            </td>
                            <td>{value.kategori}</td>
                            <td>{value.judul}</td>
                            <StatusLabel value={value.status} />
                            <td>
                              {" "}
                              <PriorityLabel value={value.prioritas} />
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "grid",
                                  gridAutoFlow: "column",
                                  columnGap: "4px",
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
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
                {list_ticket && list_ticket.length <= 0 && (
                  <div style={{ textAlign: "center" }}>No Data</div>
                )}
              </div>
              <Row className="d-flex align-items-end">
                <ReactPaginate
                  previousLabel={"previous"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={total_pages_ticket}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={5}
                  forcePage={active_page_ticket}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              </Row>
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
                Ticket {selectedData && selectedData.kodeTicket}
              </h5>
              <PriorityLabel value={selectedData && selectedData.prioritas} />
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
              <div className="table-responsive">
                <Table className="table table-centered">
                  <tbody>
                    <tr>
                      <th>Ticket Id</th>
                      <td>{selectedData && selectedData.kodeTicket}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Terminal Id</th>
                      <td>{selectedData && selectedData.terminalId}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Location</th>
                      <td>{selectedData && selectedData.lokasi}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{selectedData && selectedData.email}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Submitted</th>
                      <td>
                        {selectedData && parseFullDate(selectedData.tglDibuat)}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Category</th>
                      <td>{selectedData && selectedData.kategori}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Subject</th>
                      <td>{selectedData && selectedData.judul}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <StatusLabel
                        value={selectedData && selectedData.status}
                      />
                      <td></td>
                    </tr>
                    <tr>
                      <th>Replies</th>
                      <td>0</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Replies Staff</th>
                      <td>0</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Owner</th>
                      <td>{selectedData && selectedData.usernamePembuat}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Time Worked</th>
                      <td>{selectedData && selectedData.totalWaktu}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Last Replier</th>
                      <td>{selectedData && selectedData.usernamePembalas}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Updated</th>
                      <td>
                        {selectedData &&
                          parseFullDate(selectedData.tglDiperbarui)}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
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
    list_ticket,
    message_ticket,
    response_code_ticket,
    loading,
    page_ticket,
    total_pages_ticket,
    active_page_ticket,
  } = state.Ticket;
  return {
    list_ticket,
    response_code_ticket,
    message_ticket,
    page_ticket,
    total_pages_ticket,
    active_page_ticket,
    loading,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readTicket,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(Ticket);
