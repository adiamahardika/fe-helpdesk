import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Modal,
  Table,
  Col,
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  FormGroup,
} from "reactstrap";
import { readTicket } from "../../store/pages/ticket/actions";
import {
  readCategory,
  checkCategory,
  uncheckCategory,
} from "../../store/pages/category/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getShortDate, parseFullDate } from "../../helpers/index";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { AvForm } from "availity-reactstrap-validation";
import { readArea } from "../../store/pages/area/actions";
import { readRegional } from "../../store/pages/regional/actions";
import { readGrapari } from "../../store/pages/grapari/actions";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactPaginate from "react-paginate";
import general_constant from "../../helpers/general_constant.json";
import routes from "../../helpers/routes.json";
import classnames from "classnames";
import CryptoJS from "crypto-js";
import Select from "react-select";
import "../../assets/css/pagination.css";
require("dotenv").config();

const Ticket = (props) => {
  const list_ticket = props.list_ticket;
  const list_category = props.list_category;
  const list_checked_category = props.list_checked_category;
  const message = props.message_ticket;
  const response_code = props.response_code_ticket;
  const total_pages_ticket = props.total_pages_ticket;
  const active_page_ticket = props.active_page_ticket;
  const option_area = props.option_area;
  const option_regional = props.option_regional;
  const option_grapari = props.option_grapari;
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      sessionStorage.getItem("permission"),
      `${process.env.ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );
  const area_code = JSON.parse(sessionStorage.getItem("areaCode"));
  const regional = JSON.parse(sessionStorage.getItem("regional"));
  const grapari_id = JSON.parse(sessionStorage.getItem("grapariId"));
  const username = sessionStorage.getItem("username");
  const history = useHistory();

  const [modalDetail, setModalDetail] = useState(false);
  const [activeTabJustify, setactiveTabJustify] = useState("");
  const [category, setCategory] = useState(false);
  const [isAddTicket, setIsAddTicket] = useState(false);
  const [isDetailTicket, setIsDetailTicket] = useState(false);
  const [isViewAllTicket, setIsViewAllTicket] = useState(false);
  const [isViewSentTicket, setIsViewSentTicket] = useState(false);
  const [isViewAssignedToMeTicket, setIsViewAssignedToMeTicket] =
    useState(false);
  const [activeTicketSideNav, setActiveTicketSideNav] = useState("");
  const [data, setData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedRegional, setSelectedRegional] = useState(null);
  const [requestRegional, setRequestRegional] = useState(null);
  const [selectedGrapari, setSelectedGrapari] = useState(null);
  const [requestGrapari, setRequestGrapari] = useState(null);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };
  const toggleCustomJustified = (tab) => {
    if (activeTabJustify !== tab) {
      setactiveTabJustify(tab);
    }
  };
  const handlePageClick = (value) => {
    props.readTicket({ ...data, pageNo: value.selected });
    setData({ ...data, pageNo: value.selected });
  };
  const handleIsCheckedCategory = async (value, index) => {
    let array = data.category;
    if (value !== "") {
      let findIndex = array.findIndex(
        (newValue) => newValue === value.id.toString()
      );

      if (findIndex >= 0) {
        array.splice(findIndex, 1);
      } else if (list_checked_category[index] === false) {
        array.push(value.id.toString());
      }
      props.checkCategory(index);
    } else {
      array = [];
      props.checkCategory(false);
    }

    props.readTicket({ ...data, category: array });
    setData({ ...data, category: array });
  };
  const handleArea = async (event) => {
    let area_code = [];
    await event.map((item) => area_code.push(item.value));

    setSelectedArea(event);
    setSelectedRegional(null);
    setSelectedGrapari(null);
    setData({ ...data, areaCode: area_code, regional: [], grapariId: [] });

    props.readRegional({
      ...requestRegional,
      areaCode: area_code,
    });
    props.readGrapari({
      ...requestGrapari,
      areaCode: area_code,
    });
    props.readTicket({
      ...data,
      areaCode: area_code,
      regional: [],
      grapariId: [],
    });
    delete data.areaCode;
    delete data.regional;
    delete data.grapariId;
  };
  const handleRegional = async (event) => {
    let regional = [];
    await event.map((item) => regional.push(item.value));

    setSelectedRegional(event);
    setSelectedGrapari(null);
    setData({ ...data, regional: regional, grapariId: [] });

    props.readGrapari({
      ...requestGrapari,
      regional: regional,
    });
    props.readTicket({
      ...data,
      regional: regional,
      grapariId: [],
    });
    delete data.regional;
    delete data.grapariId;
  };
  const handleGrapari = async (event) => {
    let grapari_id = [];
    await event.map((item) => grapari_id.push(item.value));

    setSelectedGrapari(event);
    setData({ ...data, grapariId: grapari_id });

    props.readTicket({
      ...data,
      grapariId: grapari_id,
    });
    delete data.grapariId;
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
  const StatusLabel = (value) => {
    let color = null;
    if (value) {
      switch (value.value) {
        case "New":
          color = "#f46a6a";
          break;
        case "Process":
          color = "#556ee6";
          break;
        case "Finish":
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
          className="badge mr-2"
          style={
            value.type === "modal"
              ? {
                  fontSize: "12px",
                  display: "inlineBlock",
                  padding: "0.5rem 0.75rem",
                  fontWeight: "bold",
                  borderRadius: "0.5rem",
                  backgroundColor: color,
                  color: "#ffffff",
                }
              : {
                  display: "inlineBlock",
                  fontWeight: "bold",
                  backgroundColor: color,
                  color: "#ffffff",
                }
          }
        >
          {value.value}
        </span>
      );
    }
  };

  useEffect(() => {
    let viewTicket = permissions.find(
      (value) => value.code === code_all_permissions.view_ticket
    );
    let detailTicket = permissions.find(
      (value) => value.code === code_all_permissions.detail_ticket
    );
    let addTicket = permissions.find(
      (value) => value.code === code_all_permissions.add_ticket
    );
    let viewAllTicket = permissions.find(
      (value) => value.code === code_all_permissions.view_all_ticket
    );
    let viewSentTicket = permissions.find(
      (value) => value.code === code_all_permissions.view_sent_ticket
    );
    let viewAssignedToMeTicket = permissions.find(
      (value) => value.code === code_all_permissions.view_assigned_to_me_ticket
    );
    if (viewTicket) {
      let reqArea = {
        areaCode: area_code && area_code[0] !== "0" ? area_code : [],
        areaName: "",
        status: "A",
      };
      props.readArea(reqArea);

      let reqRegional = {
        areaCode: area_code && area_code[0] !== "0" ? area_code : [],
        regional: regional && regional[0] !== "0" ? regional : [],
        status: "A",
      };
      props.readRegional(reqRegional);
      setRequestRegional(reqRegional);

      let reqGrapari = {
        areaCode: area_code && area_code[0] !== "0" ? area_code : [],
        regional: regional && regional[0] !== "0" ? regional : [],
        grapariId: grapari_id && grapari_id[0] !== "0" ? grapari_id : [],
        status: "Active",
      };
      props.readGrapari(reqGrapari);
      setRequestGrapari(reqGrapari);

      let start = new Date().setDate(new Date().getDate() - 30);

      let item = {
        assignedTo: "",
        usernamePembuat: "",
        category: [],
        areaCode: area_code && area_code[0] !== "0" ? area_code : [],
        regional: regional && regional[0] !== "0" ? regional : [],
        grapariId: grapari_id && grapari_id[0] !== "0" ? grapari_id : [],
        pageNo: 0,
        pageSize: 10,
        priority: "",
        search: "",
        sortBy: "tglDiperbarui",
        sortType: "desc",
        status: "",
        startDate: getShortDate(start),
        endDate: getShortDate(new Date()),
      };
      if (!viewAllTicket && viewSentTicket) {
        item = { ...item, usernamePembuat: username };
        setActiveTicketSideNav("sent_ticket");
      } else if (!viewAllTicket && viewAssignedToMeTicket) {
        item = { ...item, assignedTo: username };
        setActiveTicketSideNav("assigned_to_me");
      }
      props.readTicket(item);
      props.readCategory({
        size: 0,
        page_no: 0,
        sort_by: "name",
        order_by: "asc",
      });
      setData(item);

      detailTicket && setIsDetailTicket(true);
      addTicket && setIsAddTicket(true);
      viewAllTicket && setIsViewAllTicket(true);
      viewSentTicket && setIsViewSentTicket(true);
      viewAssignedToMeTicket && setIsViewAssignedToMeTicket(true);
    } else {
      history.push(routes.login);
    }
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Ticket"} breadcrumbItem={"Ticket"} />
          <Row>
            <Col md={3}>
              <Card className="p-3">
                {isAddTicket && (
                  <Link to={routes.add_ticket}>
                    <Button
                      type="button"
                      color="primary"
                      className="waves-effect waves-light"
                      block
                    >
                      <i className="bx bx-edit-alt font-size-16 align-middle mr-2"></i>
                      New
                    </Button>
                  </Link>
                )}
                <div className={`mail-list ${isAddTicket && `mt-4`}`}>
                  {isViewAllTicket && (
                    <Link
                      to="#"
                      className={
                        (activeTicketSideNav === "" && "active") +
                        " d-flex align-items-center"
                      }
                      onClick={() => (
                        props.readTicket({
                          ...data,
                          usernamePembuat: "",
                          assignedTo: "",
                        }),
                        setData({
                          ...data,
                          usernamePembuat: "",
                          assignedTo: "",
                        }),
                        setActiveTicketSideNav("")
                      )}
                    >
                      <i className="mdi mdi-email-outline mr-2 font-size-16"></i>{" "}
                      All Ticket{" "}
                    </Link>
                  )}
                  {isViewSentTicket && (
                    <Link
                      to="#"
                      className={
                        (activeTicketSideNav === "sent_ticket" && "active") +
                        " d-flex align-items-center"
                      }
                      onClick={() => (
                        props.readTicket({
                          ...data,
                          usernamePembuat: username,
                          assignedTo: "",
                        }),
                        setData({
                          ...data,
                          usernamePembuat: username,
                          assignedTo: "",
                        }),
                        setActiveTicketSideNav("sent_ticket")
                      )}
                    >
                      <i className="bx bx-mail-send mr-2 font-size-16"></i>Sent
                      Ticket
                    </Link>
                  )}
                  {isViewAssignedToMeTicket && (
                    <Link
                      to="#"
                      className={
                        (activeTicketSideNav === "assigned_to_me" && "active") +
                        " d-flex align-items-center"
                      }
                      onClick={() => (
                        props.readTicket({
                          ...data,
                          usernamePembuat: "",
                          assignedTo: username,
                        }),
                        setData({
                          ...data,
                          usernamePembuat: "",
                          assignedTo: username,
                        }),
                        setActiveTicketSideNav("assigned_to_me")
                      )}
                    >
                      <i className="mdi mdi-email-receive mr-2 font-size-16"></i>
                      Assigned To Me
                    </Link>
                  )}
                </div>

                <h6 className="mt-4">Status</h6>

                <div className="mail-list mt-1">
                  <Link
                    to="#"
                    onClick={() => (
                      props.readTicket({ ...data, status: "" }),
                      setData({ ...data, status: "" })
                    )}
                  >
                    <span
                      className="mdi mdi-arrow-right-drop-circle float-right"
                      style={{ color: "#556ee6" }}
                    ></span>
                    <span
                      style={{
                        fontWeight:
                          data && data.status === "" ? "bold" : "normal",
                      }}
                    >
                      All
                    </span>
                  </Link>
                  {general_constant.status.map((value, index) => (
                    <Link
                      to="#"
                      key={index}
                      onClick={() => (
                        props.readTicket({ ...data, status: value.name }),
                        setData({ ...data, status: value.name })
                      )}
                    >
                      <span
                        className="mdi mdi-arrow-right-drop-circle float-right"
                        style={{ color: value.color }}
                      ></span>
                      <span
                        style={{
                          fontWeight:
                            data && data.status === value.name
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {value.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>
            </Col>
            <Col md={9}>
              <Card className="p-3">
                <Row className="d-flex align-items-end">
                  <Col>
                    <Row className="mb-2 d-flex align-items-end">
                      <Col
                        md={6}
                        style={{
                          display: "grid",
                          justifyItems: "flex-start",
                          alignItems: "flex-end",
                          gridAutoFlow: "column",
                          columnGap: "0.5rem",
                        }}
                      >
                        <Dropdown
                          isOpen={category}
                          toggle={() => {
                            setCategory(true);
                          }}
                          className="btn-group"
                        >
                          <DropdownToggle
                            className="btn btn-primary waves-light waves-effect dropdown-toggle d-flex align-items-center"
                            style={{
                              backgroundColor: "#556ee6",
                              border: "none",
                            }}
                          >
                            <i className="bx bx-filter-alt font-size-16 align-middle"></i>
                            <i className="mdi mdi-chevron-down ml-1"></i>
                          </DropdownToggle>
                          <DropdownMenu>
                            <Row>
                              <Col className="d-flex align-items-center ml-3">
                                <h6 style={{ fontWeight: "600" }}>
                                  Filter by Category
                                </h6>
                              </Col>
                              <Col className="d-flex justify-content-end align-items-center mr-3">
                                <span
                                  className="btn-link waves-effect text-right mr-3"
                                  style={{ textDecoration: "none" }}
                                  onClick={() => {
                                    handleIsCheckedCategory("");
                                  }}
                                >
                                  Clear All
                                </span>
                                <span
                                  className="waves-effect text-right"
                                  onClick={() => {
                                    setCategory(false);
                                  }}
                                >
                                  <i className="bx bxs-x-square font-size-24"></i>
                                </span>
                              </Col>
                            </Row>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                              }}
                            >
                              {list_category &&
                                list_category.map((value, index) => (
                                  <DropdownItem to="#" key={index}>
                                    <div className="custom-control custom-checkbox">
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
                                          handleIsCheckedCategory(value, index);
                                        }}
                                      >
                                        <span> {value.name}</span>
                                      </label>
                                    </div>
                                  </DropdownItem>
                                ))}
                            </div>
                          </DropdownMenu>
                        </Dropdown>
                        <div className="form-group mb-0">
                          <label
                            htmlFor="example-datetime-local-input"
                            style={{ fontWeight: 500 }}
                          >
                            Start Date
                          </label>
                          <input
                            className="form-control"
                            type="date"
                            id="example-date-input"
                            min={getShortDate(
                              new Date().setFullYear(
                                new Date().getFullYear() - 1
                              )
                            )}
                            max={data && data.endDate}
                            defaultValue={data && data.startDate}
                            onChange={(event) => (
                              setData({
                                ...data,
                                startDate: event.target.value,
                              }),
                              props.readTicket({
                                ...data,
                                startDate: event.target.value,
                              })
                            )}
                          />
                        </div>

                        <div className="form-group mb-0">
                          <label
                            htmlFor="example-datetime-local-input"
                            style={{ fontWeight: 500 }}
                          >
                            End Date
                          </label>
                          <input
                            className="form-control"
                            type="date"
                            id="example-date-input"
                            min={data && data.startDate}
                            max={data && data.endDate}
                            defaultValue={data && data.endDate}
                            onChange={(event) => (
                              setData({
                                ...data,
                                endDate: event.target.value,
                              }),
                              props.readTicket({
                                ...data,
                                endDate: event.target.value,
                              })
                            )}
                          />
                        </div>
                      </Col>
                      <Col
                        md={6}
                        className="d-flex flex-row justify-content-end align-items-end"
                      >
                        <div className="form-group mb-0">
                          <input
                            className="form-control"
                            type="search"
                            placeholder="Search..."
                            onChange={(event) =>
                              event.target.value === ""
                                ? (props.readTicket({
                                    ...data,
                                    search: "",
                                  }),
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
                        <div className="ml-2">
                          <button
                            type="button"
                            className="btn btn-primary waves-effect waves-light d-flex align-items-center"
                            onClick={() => {
                              props.readTicket(data);
                            }}
                          >
                            <i className="bx bx-search-alt-2 font-size-16 align-middle mr-2"></i>{" "}
                            Search
                          </button>
                        </div>
                      </Col>
                    </Row>
                    <AvForm>
                      <Row>
                        {area_code && (
                          <Col md={4}>
                            <FormGroup className="select2-container">
                              <Label>Area</Label>
                              <Select
                                value={selectedArea}
                                placeholder="All"
                                onChange={(event) => {
                                  handleArea(event);
                                }}
                                options={option_area}
                                classNamePrefix="select2-selection"
                                isMulti={true}
                              />
                            </FormGroup>
                          </Col>
                        )}
                        {regional && (
                          <Col md={4}>
                            <FormGroup className="select2-container">
                              <Label>Regional</Label>
                              <Select
                                value={selectedRegional}
                                placeholder="All"
                                onChange={(event) => {
                                  handleRegional(event);
                                }}
                                options={option_regional}
                                classNamePrefix="select2-selection"
                                isMulti={true}
                              />
                            </FormGroup>
                          </Col>
                        )}
                        {grapari_id && (
                          <Col md={4}>
                            <FormGroup className="select2-container">
                              <Label>Grapari</Label>
                              <Select
                                value={selectedGrapari}
                                placeholder="All"
                                onChange={(event) => {
                                  handleGrapari(event);
                                }}
                                options={option_grapari}
                                classNamePrefix="select2-selection"
                                isMulti={true}
                              />
                            </FormGroup>
                          </Col>
                        )}
                      </Row>
                    </AvForm>
                  </Col>
                </Row>
                <Nav tabs className="nav-tabs-custom nav-justified">
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: activeTabJustify === "",
                      })}
                      onClick={() => {
                        toggleCustomJustified("");
                        setData({
                          ...data,
                          priority: "",
                        });
                        props.readTicket({
                          ...data,
                          priority: "",
                        });
                      }}
                    >
                      <span className="d-none d-sm-block">All</span>
                    </NavLink>
                  </NavItem>
                  {general_constant.priority.map((value, index) => (
                    <NavItem key={index}>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTabJustify === value.name,
                        })}
                        onClick={() => {
                          toggleCustomJustified(value.name);
                          setData({
                            ...data,
                            priority: value.name,
                          });
                          props.readTicket({
                            ...data,
                            priority: value.name,
                          });
                        }}
                      >
                        <span className="d-none d-sm-block">{value.name}</span>
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
                <div className="table-responsive">
                  <Table className="table table-centered table-striped">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Ticket Code</th>
                        <th>Terminal Id</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Category</th>
                        <th>Assigned To</th>
                        <th>Updated On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list_ticket &&
                        list_ticket.map((value, index) => {
                          return (
                            <tr key={value.id}>
                              <th scope="row">
                                <div>
                                  {data.pageSize * active_page_ticket +
                                    index +
                                    1}
                                </div>
                              </th>
                              <td>{value.ticketCode}</td>
                              <td>{value.terminalId}</td>
                              <StatusLabel value={value.status} />
                              <td>
                                {/* <span
                                  style={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    width: "150px",
                                    display: "block",
                                  }}
                                > */}
                                <PriorityLabel value={value.prioritas} />
                                {/* </span> */}
                              </td>
                              <td>
                                <span
                                  style={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    width: "100px",
                                    display: "block",
                                  }}
                                >
                                  {value.categoryName}
                                </span>
                              </td>
                              <td>
                                {value && value.assignee.length > 0
                                  ? value.assignee
                                  : "Unassigned"}
                              </td>
                              <td>
                                <span
                                  style={{
                                    width: "50px",
                                    display: "block",
                                  }}
                                >
                                  {parseFullDate(value.tglDiperbarui)}
                                </span>
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "grid",
                                    gridAutoFlow: "column",
                                    columnGap: "4px",
                                    gridTemplateColumns: "repeat(2, 1fr)",
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
                                  {isDetailTicket && (
                                    <Link
                                      to={{
                                        pathname: routes.detail_ticket,
                                        search: `?ticketId=${value.ticketCode}`,
                                        detailValue: value.ticketCode,
                                      }}
                                    >
                                      <button
                                        type="button"
                                        className="btn btn-primary waves-effect waves-light"
                                        style={{ minWidth: "max-content" }}
                                      >
                                        <i className="bx bxs-detail font-size-16 align-middle"></i>
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
                  {list_ticket && list_ticket.length <= 0 && (
                    <div style={{ textAlign: "center" }}>No Data</div>
                  )}
                </div>
                {list_ticket && list_ticket.length > 0 && (
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
                    <Col
                      className="justify-content-end"
                      style={{ display: "grid" }}
                    >
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
                    </Col>
                  </Row>
                )}
              </Card>
            </Col>
          </Row>

          {/* Modal Detail */}
          <Modal
            isOpen={modalDetail}
            toggle={() => {
              setModalDetail(!modalDetail);
              removeBodyCss();
              setSelectedData(null);
            }}
            size="xl"
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
                Ticket {selectedData && selectedData.ticketCode}
              </h5>
              <PriorityLabel
                value={selectedData && selectedData.prioritas}
                type="modal"
              />
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
              <Row>
                <Col>
                  <div className="table-responsive">
                    <Table className="table table-centered">
                      <tbody>
                        <tr>
                          <th>Ticket Id</th>
                          <td>{selectedData && selectedData.ticketCode}</td>
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
                          <th>Category</th>
                          <td>{selectedData && selectedData.categoryName}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Visit Status</th>
                          <td>
                            {selectedData && selectedData.visitStatus.length > 0
                              ? selectedData.visitStatus
                              : "-"}
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Subject</th>
                          <td>{selectedData && selectedData.judul}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>{selectedData && selectedData.email}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Owner</th>
                          <td>{selectedData && selectedData.userPembuat}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Assigned To</th>
                          <td>
                            {selectedData && selectedData.assignee.length > 0
                              ? selectedData.assignee
                              : "Unassigned"}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col>
                  {" "}
                  <div className="table-responsive">
                    <Table className="table table-centered">
                      <tbody>
                        <tr>
                          <th>Area</th>
                          <td>{selectedData && selectedData.areaName}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Regional</th>
                          <td>{selectedData && selectedData.regional}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Grapari</th>
                          <td>{selectedData && selectedData.grapariName}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Location</th>
                          <td>{selectedData && selectedData.lokasi}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Terminal Id</th>
                          <td>{selectedData && selectedData.terminalId}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Submitted On</th>
                          <td>
                            {selectedData &&
                              parseFullDate(selectedData.tglDibuat)}
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Updated On</th>
                          <td>
                            {selectedData &&
                              parseFullDate(selectedData.tglDiperbarui)}
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Assigning On</th>
                          <td>
                            {selectedData &&
                            selectedData.assigningTime.includes("0001-01-01T")
                              ? "-"
                              : parseFullDate(
                                  selectedData && selectedData.assigningTime
                                )}
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Start On</th>
                          <td>
                            {selectedData &&
                            selectedData.startTime.includes("0001-01-01T")
                              ? "-"
                              : parseFullDate(
                                  selectedData && selectedData.startTime
                                )}
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Close On</th>
                          <td>
                            {selectedData &&
                            selectedData.closeTime.includes("0001-01-01T")
                              ? "-"
                              : parseFullDate(
                                  selectedData && selectedData.closeTime
                                )}
                          </td>
                          <td></td>
                        </tr>
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
    list_ticket,
    message_ticket,
    response_code_ticket,
    loading,
    page_ticket,
    total_pages_ticket,
    active_page_ticket,
  } = state.Ticket;
  const { list_category, list_checked_category } = state.Category;
  const { option_area } = state.Area;
  const { option_regional } = state.Regional;
  const { option_grapari } = state.Grapari;
  return {
    list_ticket,
    list_category,
    list_checked_category,
    option_area,
    option_regional,
    option_grapari,
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
      readCategory,
      checkCategory,
      uncheckCategory,
      readArea,
      readRegional,
      readGrapari,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(Ticket);
