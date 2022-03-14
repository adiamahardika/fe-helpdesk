import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, Col, Row } from "reactstrap";
import { readReport } from "../../store/pages/report/actions";
import {
  readCategory,
  checkCategory,
} from "../../store/pages/category/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { readUser } from "../../store/pages/users/actions";
import { useHistory } from "react-router";
import { CSVLink } from "react-csv";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import general_constant from "../../helpers/general_constant.json";
import routes from "../../helpers/routes.json";
import CryptoJS from "crypto-js";
import "../../assets/css/pagination.css";
require("dotenv").config();

const headers = [
  {
    label: "Ticket Id",
    key: "ticketCode",
  },
  {
    label: "Terminal Id",
    key: "terminalId",
  },
  {
    label: "Location",
    key: "lokasi",
  },
  {
    label: "Email",
    key: "email",
  },
  {
    label: "Owner",
    key: "usernamePembuat",
  },
  {
    label: "Submitted",
    key: "tglDibuat",
  },
  {
    label: "Time Worked",
    key: "totalWaktu",
  },
  {
    label: "Category",
    key: "kategori",
  },
  {
    label: "Status",
    key: "status",
  },
  {
    label: "Updated",
    key: "tglDiperbarui",
  },
  {
    label: "Last Replier",
    key: "usernamePembalas",
  },
  {
    label: "Subject",
    key: "judul",
  },
];

const Report = (props) => {
  const list_report = props.list_report;
  const list_user = props.list_user;
  const list_category = props.list_category;
  const list_checked_category = props.list_checked_category;
  const message = props.message_report;
  const response_code = props.response_code_report;
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      sessionStorage.getItem("permission"),
      `${process.env.ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );

  const username = sessionStorage.getItem("username");
  const history = useHistory();

  const [checkAllCategory, setCheckAllCategory] = useState(true);
  const [showSort, setShowSort] = useState(false);
  const [today, setToday] = useState(null);
  const [statusChecked, setStatusChecked] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [priorityChecked, setPriorityChecked] = useState([
    true,
    true,
    true,
    true,
  ]);

  const [data, setData] = useState(null);
  const handleCheckedAllCategory = async () => {
    let array = [];
    await list_category.map((value, index) => {
      if (!checkAllCategory === true) {
        array.push(value.id.toString());
      } else {
        array = [];
      }
    });
    props.checkCategory(!checkAllCategory);

    setData({ ...data, category: array });
    setCheckAllCategory(!checkAllCategory);
    props.readReport({ ...data, category: [] });
  };
  const handleCheckedCategory = async (value, index) => {
    let array = data.category;
    let findIndex = array.findIndex(
      (newValue) => newValue === value.id.toString()
    );

    if (findIndex >= 0) {
      array.splice(findIndex, 1);
    } else if (list_checked_category[index] === false) {
      array.push(value.id.toString());
    }

    props.checkCategory(index);
    props.readReport({ ...data, category: array });
    setData({ ...data, category: array });
  };
  const handleCheckStatus = (value, index) => {
    let array = [...statusChecked];
    array[index] = !statusChecked[index];
    let status = [...data.status];
    let findIndex =
      data && data.status.findIndex((newValue) => newValue === value);

    if (findIndex < 0) {
      status.push(value);
    } else {
      status.splice(findIndex, 1);
    }
    props.readReport({ ...data, status: status });
    setData({ ...data, status: status });
    setStatusChecked(array);
  };
  const handleCheckPriority = (value, index) => {
    let array = [...priorityChecked];
    array[index] = !priorityChecked[index];
    let priority = [...data.priority];
    let findIndex =
      data && data.priority.findIndex((newValue) => newValue === value);

    if (findIndex < 0) {
      priority.push(value);
    } else {
      priority.splice(findIndex, 1);
    }

    props.readReport({ ...data, priority: priority });
    setData({ ...data, priority: priority });
    setPriorityChecked(array);
  };

  useEffect(() => {
    let year = new Date().getFullYear();
    let month = "" + (new Date().getMonth() + 1);
    let date = "" + new Date().getDate();
    if (month.length < 2) month = "0" + month;
    if (date.length < 2) date = "0" + date;
    let today = year + "-" + month + "-" + date;
    let priorityArray = [];
    let statusArray = [];
    let item = {
      assignedTo: "",
      usernamePembuat: "",
      category: [],
      priority: priorityArray,
      status: statusArray,
      startDate: today,
      endDate: today,
    };

    general_constant.priority.map((value) => {
      priorityArray.push(value.name);
    });
    general_constant.status.map((value) => {
      statusArray.push(value.name);
    });

    props.readReport(item);
    props.readCategory({
      size: 0,
      page_no: 0,
      sort_by: "name",
      order_by: "asc",
      is_check_all: true,
    });
    props.readUser({ size: 0, page_no: 0, search: "*" });
    setData(item);
    setToday(today);
  }, []);

  useEffect(() => {
    props.readReport(data);
  }, [data]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Report"} breadcrumbItem={"Report"} />
          <Row className="d-flex justify-content-center">
            <Col md={10}>
              <Card>
                <CardBody>
                  <Row className="d-flex align-items-start">
                    <Col md={4}>
                      <div className="form-group">
                        <label
                          htmlFor="example-datetime-local-input"
                          style={{ fontWeight: "bold" }}
                        >
                          Start Date
                        </label>
                        <input
                          className="form-control"
                          type="date"
                          id="example-date-input"
                          max={today}
                          defaultValue={today}
                          onChange={(event) =>
                            setData({ ...data, startDate: event.target.value })
                          }
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="form-group">
                        <label
                          htmlFor="example-datetime-local-input"
                          style={{ fontWeight: "bold" }}
                        >
                          End Date
                        </label>
                        <input
                          className="form-control"
                          type="date"
                          id="example-date-input"
                          max={today}
                          min={data && data.start}
                          defaultValue={today}
                          onChange={(event) =>
                            setData({ ...data, endDate: event.target.value })
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={10}>
                      <div className="form-group">
                        <label
                          htmlFor="example-datetime-local-input"
                          style={{ fontWeight: "bold" }}
                        >
                          Status
                        </label>
                        <div
                          style={{
                            display: "grid",
                            gridAutoFlow: "column",
                          }}
                        >
                          {general_constant.status.map((value, index) => (
                            <div
                              className="custom-control custom-checkbox"
                              key={index}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="CustomCheck1"
                                onChange={() => false}
                                checked={statusChecked[index]}
                              />
                              <label
                                className="custom-control-label"
                                style={{ color: value.color }}
                                onClick={() => {
                                  handleCheckStatus(value.name, index);
                                }}
                              >
                                {value.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="form-group">
                        <label
                          htmlFor="example-datetime-local-input"
                          style={{ fontWeight: "bold" }}
                        >
                          Priority
                        </label>
                        <div
                          style={{
                            display: "grid",
                            gridAutoFlow: "column",
                          }}
                        >
                          {general_constant.priority.map((value, index) => (
                            <div
                              className="custom-control custom-checkbox"
                              key={index}
                            >
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="CustomCheck1"
                                onChange={() => false}
                                checked={priorityChecked[index]}
                              />
                              <label
                                className="custom-control-label"
                                style={{ color: value.color }}
                                onClick={() => {
                                  handleCheckPriority(value.name, index);
                                }}
                              >
                                {value.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="form-group">
                        <label
                          htmlFor="example-datetime-local-input"
                          style={{ fontWeight: "bold" }}
                        >
                          Category
                        </label>
                        <div style={{ margin: "4px 0" }}>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="CustomCheck1"
                              onChange={() => false}
                              checked={checkAllCategory}
                            />
                            <label
                              className="custom-control-label"
                              onClick={() => {
                                handleCheckedAllCategory();
                              }}
                            >
                              Check All
                            </label>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                            rowGap: "4px",
                          }}
                        >
                          {list_category &&
                            list_category.map((value, index) => (
                              <div
                                className="custom-control custom-checkbox"
                                key={index}
                              >
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="CustomCheck1"
                                  onChange={() => false}
                                  checked={
                                    list_checked_category &&
                                    list_checked_category[index]
                                  }
                                />
                                <label
                                  className="custom-control-label"
                                  onClick={() => {
                                    handleCheckedCategory(value, index);
                                  }}
                                >
                                  {value.name}
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <div className="form-group">
                        <label
                          htmlFor="example-datetime-local-input"
                          style={{ fontWeight: "bold" }}
                        >
                          Create by
                        </label>
                        <select
                          name="assignedTo"
                          className="form-control"
                          defaultValue=""
                          onChange={(event) => (
                            setData({
                              ...data,
                              usernamePembuat: event.target.value,
                            }),
                            props.readReport({
                              ...data,
                              usernamePembuat: event.target.value,
                            })
                          )}
                        >
                          <option value="">All</option>
                          {list_user &&
                            list_user.map((value, index) => (
                              <option key={index} value={value.username}>
                                {value.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="form-group">
                        <label
                          htmlFor="example-datetime-local-input"
                          style={{ fontWeight: "bold" }}
                        >
                          Assigned to
                        </label>
                        <select
                          name="assignedTo"
                          className="form-control"
                          defaultValue=""
                          onChange={(event) => (
                            setData({
                              ...data,
                              assignedTo: event.target.value,
                            }),
                            props.readReport({
                              ...data,
                              assignedTo: event.target.value,
                            })
                          )}
                        >
                          <option value="">All</option>
                          <option value="Unassigned">Unassigned</option>
                          {list_user &&
                            list_user.map((value, index) => (
                              <option key={index} value={value.username}>
                                {value.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="d-flex justify-content-end">
                      <CSVLink
                        data={list_report && list_report}
                        headers={headers}
                        separator={";"}
                        filename={`Ticket_Report_${data && data.startDate}_${
                          data && data.endDate
                        }.csv`}
                      >
                        <button
                          type="button"
                          className="btn btn-success waves-effect waves-light"
                        >
                          <i className="bx bxs-file-export font-size-16 align-middle mr-2"></i>{" "}
                          Export .csv
                        </button>
                      </CSVLink>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { list_report, message_report, response_code_report, loading } =
    state.Report;
  const { list_category, list_checked_category } = state.Category;
  const { list_user } = state.User;
  return {
    list_report,
    list_category,
    list_checked_category,
    list_user,
    response_code_report,
    message_report,
    loading,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readReport,
      readCategory,
      checkCategory,
      readUser,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(Report);
