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
import ReactExport from "react-export-excel";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import general_constant from "../../helpers/general_constant.json";
import routes from "../../helpers/routes.json";
import CryptoJS from "crypto-js";
import "../../assets/css/pagination.css";
import { getShortDate } from "../../helpers";
require("dotenv").config();

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

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
  const [checkAllPriority, setCheckAllPriority] = useState(true);
  const [checkAllStatus, setCheckAllStatus] = useState(true);
  const [today, setToday] = useState(null);
  const [statusChecked, setStatusChecked] = useState([true, true, true, true]);
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
    props.readReport({ ...data, category: array });
  };
  const handleCheckedAllStatus = async () => {
    let reqStatus = [];
    let checked = [];
    general_constant.status.map((value) => {
      if (!checkAllStatus === true) {
        reqStatus.push(value.name);
        checked.push(true);
      } else {
        reqStatus = [];
        checked.push(false);
      }
    });

    setData({ ...data, status: reqStatus });
    setCheckAllStatus(!checkAllStatus);
    setStatusChecked(checked);
    props.readReport({ ...data, status: reqStatus });
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
    if (array.every((value) => value === true)) {
      setCheckAllStatus(true);
    } else {
      setCheckAllStatus(false);
    }

    props.readReport({ ...data, status: status });
    setData({ ...data, status: status });
    props.readReport({ ...data, status: status });
    setStatusChecked(array);
  };
  const handleCheckedAllPriority = async () => {
    let reqPriority = [];
    let checked = [];
    general_constant.priority.map((value) => {
      if (!checkAllPriority === true) {
        reqPriority.push(value.name);
        checked.push(true);
      } else {
        reqPriority = [];
        checked.push(false);
      }
    });

    setData({ ...data, priority: reqPriority });
    setCheckAllPriority(!checkAllPriority);
    setPriorityChecked(checked);
    props.readReport({ ...data, priority: reqPriority });
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
    if (array.every((value) => value === true)) {
      setCheckAllPriority(true);
    } else {
      setCheckAllPriority(false);
    }

    props.readReport({ ...data, priority: priority });
    setData({ ...data, priority: priority });
    props.readReport({ ...data, priority: priority });
    setPriorityChecked(array);
  };

  useEffect(() => {
    let generateReport = permissions.find(
      (value) => value.code === code_all_permissions.generate_report
    );

    if (generateReport) {
      let start = new Date().setDate(new Date().getDate() - 30);

      let priorityArray = [];
      let statusArray = [];
      let item = {
        assignedTo: "",
        usernamePembuat: "",
        category: [],
        priority: priorityArray,
        status: statusArray,
        startDate: getShortDate(start),
        endDate: getShortDate(new Date()),
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
    } else {
      history.push(routes.ticket);
    }
  }, []);

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
                          max={data && data.endDate}
                          defaultValue={data && data.startDate}
                          onChange={(event) => (
                            setData({ ...data, startDate: event.target.value }),
                            props.readReport({
                              ...data,
                              startDate: event.target.value,
                            })
                          )}
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
                          min={data && data.startDate}
                          max={getShortDate(new Date())}
                          defaultValue={data && data.endDate}
                          onChange={(event) => (
                            setData({ ...data, endDate: event.target.value }),
                            props.readReport({
                              ...data,
                              endDate: event.target.value,
                            })
                          )}
                        />
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
                          Status
                        </label>
                        <div style={{ margin: "4px 0" }}>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="CustomCheck1"
                              onChange={() => false}
                              checked={checkAllStatus}
                            />
                            <label
                              className="custom-control-label"
                              onClick={() => {
                                handleCheckedAllStatus();
                              }}
                            >
                              Check All
                            </label>
                          </div>
                        </div>
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
                        </label>{" "}
                        <div style={{ margin: "4px 0" }}>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="CustomCheck1"
                              onChange={() => false}
                              checked={checkAllPriority}
                            />
                            <label
                              className="custom-control-label"
                              onClick={() => {
                                handleCheckedAllPriority();
                              }}
                            >
                              Check All
                            </label>
                          </div>
                        </div>
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
                      <ExcelFile
                        element={
                          <button
                            type="button"
                            className="btn btn-success waves-effect waves-light"
                          >
                            <i className="bx bxs-file-export font-size-16 align-middle mr-2"></i>{" "}
                            Export .xlsx
                          </button>
                        }
                      >
                        <ExcelSheet
                          data={list_report && list_report}
                          name={`${data && data.startDate}_${
                            data && data.endDate
                          }`}
                        >
                          <ExcelColumn label="Ticket Id" value="ticketCode" />
                          <ExcelColumn label="Terminal Id" value="terminalId" />
                          <ExcelColumn label="Location" value="lokasi" />
                          <ExcelColumn label="Email" value="email" />
                          <ExcelColumn label="Owner" value="usernamePembuat" />
                          <ExcelColumn label="Submitted" value="tglDibuat" />
                          <ExcelColumn label="Time Worked" value="totalWaktu" />
                          <ExcelColumn label="Category" value="category" />
                          <ExcelColumn label="Status" value="status" />
                          <ExcelColumn label="Updated" value="tglDiperbarui" />
                          <ExcelColumn
                            label="Last Replier"
                            value="usernamePembalas"
                          />
                          <ExcelColumn label="Subject" value="judul" />
                          <ExcelColumn label="Isi" value="isi" />
                        </ExcelSheet>
                      </ExcelFile>
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
