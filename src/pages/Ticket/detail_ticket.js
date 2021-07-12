import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  Col,
  Row,
  CardTitle,
  FormGroup,
  Modal,
  Button,
} from "reactstrap";
import {
  readDetailTicket,
  updateTicket,
  replyTicket,
} from "../../store/pages/ticket/actions";
import { readCategory } from "../../store/pages/category/actions";
import { readUser } from "../../store/pages/users/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { parseFullDate } from "../../helpers/index";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import general_constant from "../../helpers/general_constant.json";
import routes from "../../helpers/routes.json";
import queryString from "query-string";
import Dropzone from "react-dropzone";
import UnsavedChangesWarning from "../../helpers/unsaved_changes_warning";
import "../../assets/css/pagination.css";

const list_status = [
  { name: "New", color: "#f46a6a" },
  { name: "Waiting Reply", color: "#f1b44c" },
  { name: "Replied", color: "#556ee6" },
  { name: "In Progress", color: "#34c38f" },
  { name: "Resolved", color: "#34c38f" },
  { name: "On Hold", color: "#343a40" },
];
const list_reply_status = [
  { name: "Replied", color: "#556ee6" },
  { name: "In Progress", color: "#34c38f" },
  { name: "Resolved", color: "#34c38f" },
  { name: "On Hold", color: "#343a40" },
];
const list_priority = [
  {
    name: "Low",
    color: "#34c38f",
  },
  {
    name: "Medium",
    color: "#f1b44c",
  },
  {
    name: "High",
    color: "#f46a6a",
  },
  {
    name: "Critical",
    color: "#9400d3",
  },
];
const DetailTicket = (props) => {
  const detail_ticket = props.detail_ticket;
  const list_reply_ticket = props.list_reply_ticket;
  const list_category = props.list_category;
  const list_user = props.list_user;
  const message = props.message_ticket;
  const response_code = props.response_code_ticket;
  const username = localStorage.getItem("username");
  const history = useHistory();
  const { search } = useLocation();
  const { ticketId } = queryString.parse(search);
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [replyData, setReplyData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [modalFilter, setModalFilter] = useState(false);
  const [modalRequirements, setModalRequirements] = useState(false);
  const [showEditTicket, setShowEditTicket] = useState(false);
  const [statusColor, setStatusColor] = useState(null);
  const [priorityColor, setPriorityColor] = useState(null);
  const [checkedSubmitAs, setCheckedSubmitAs] = useState(null);

  const [selectedFiles1, setSelectedFiles1] = useState(null);
  const [selectedFiles2, setSelectedFiles2] = useState(null);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const handleAcceptedFiles = (files, number) => {
    let icon = null;
    let fileType = null;
    let reader = new FileReader();
    let today = new Date();
    let split = files[0].type.split("/");
    let fileName = files[0].name.split(".");
    let extensionCheck = false;
    let sizeCheck = false;

    if (files[0].size <= 2000000) {
      sizeCheck = true;
    }
    switch (fileName[1]) {
      case "gif":
        extensionCheck = true;
        break;
      case "jpg":
        extensionCheck = true;
        break;
      case "jpeg":
        extensionCheck = true;
        break;
      case "png":
        extensionCheck = true;
        break;
      case "zip":
        extensionCheck = true;
        break;
      case "rar":
        extensionCheck = true;
        break;
      case "csv":
        extensionCheck = true;
        break;
      case "doc":
        extensionCheck = true;
        break;
      case "docx":
        extensionCheck = true;
        break;
      case "xls":
        extensionCheck = true;
        break;
      case "xlsx":
        extensionCheck = true;
        break;
      case "txt":
        extensionCheck = true;
        break;
      case "pdf":
        extensionCheck = true;
        break;

      default:
        extensionCheck = false;
    }

    if (extensionCheck && sizeCheck) {
      if (split[0] === "application") {
        icon = "bx bxs-file";
        fileType = "file";
      } else if (split[0] === "image") {
        fileType = "image";
      }
      Object.assign(files[0], {
        preview: URL.createObjectURL(files[0]),
        formattedSize: formatBytes(files[0].size),
        icon: icon,
        file: fileType,
      });
      reader.onload = () => {
        if (reader.readyState === 2) {
          let base64 = reader.result.split(",");
          if (number === "1") {
            setSelectedFiles1(files[0]);
            setReplyData({
              ...replyData,
              base64_1: base64[1],
              base64FileName1:
                ("0" + today.getHours()).slice(-2) +
                ("0" + today.getMinutes()).slice(-2) +
                ("0" + today.getSeconds()).slice(-2) +
                "." +
                fileName[fileName.length - 1],
            });
          } else {
            setSelectedFiles2(files[0]);
            setReplyData({
              ...replyData,
              base64_2: base64[1],
              base64FileName2:
                ("0" + today.getHours()).slice(-2) +
                ("0" + today.getMinutes()).slice(-2) +
                ("0" + today.getSeconds()).slice(-2) +
                "." +
                fileName[fileName.length - 1],
            });
          }
        }
      };
      reader.readAsDataURL(files[0]);
    } else {
      setModalFilter(true);
    }
  };
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };
  const onShowEdit = () => {
    setShowEditTicket(true);
    setEditData(detail_ticket);
    if (detail_ticket) {
      switch (detail_ticket.status) {
        case "New":
          setStatusColor("#f46a6a");
          break;
        case "Waiting Reply":
          setStatusColor("#f1b44c");
          break;
        case "Replied":
          setStatusColor("#556ee6");
          break;
        case "In Progress":
          setStatusColor("#34c38f");
          break;
        case "Resolved":
          setStatusColor("#34c38f");
          break;
        case "On Hold":
          setStatusColor("#343a40");
          break;
        default:
          setStatusColor("#34c38f");
      }
      switch (detail_ticket.prioritas) {
        case "High":
          setPriorityColor("#f46a6a");
          break;
        case "Medium":
          setPriorityColor("#f1b44c");
          break;
        case "Critical":
          setPriorityColor("#9400d3");
          break;
        case "Low":
          setPriorityColor("#34c38f");
          break;
        default:
          setPriorityColor("#34c38f");
      }
    }
  };
  const onChangeStatus = async (value) => {
    if (value) {
      switch (value) {
        case "New":
          setStatusColor("#f46a6a");
          break;
        case "Waiting Reply":
          setStatusColor("#f1b44c");
          break;
        case "Replied":
          setStatusColor("#556ee6");
          break;
        case "In Progress":
          setStatusColor("#34c38f");
          break;
        case "Resolved":
          setStatusColor("#34c38f");
          break;
        case "On Hold":
          setStatusColor("#343a40");
          break;
        default:
          setStatusColor("#34c38f");
      }
      setEditData({
        ...editData,
        status: value,
      });
    }
    setDirty();
  };
  const onChangePriority = async (value) => {
    if (value) {
      switch (value) {
        case "High":
          setPriorityColor("#f46a6a");
          break;
        case "Medium":
          setPriorityColor("#f1b44c");
          break;
        case "Critical":
          setPriorityColor("#9400d3");
          break;
        case "Low":
          setPriorityColor("#34c38f");
          break;
        default:
          setPriorityColor("#34c38f");
      }
      setEditData({
        ...editData,
        prioritas: value,
      });
    }
    setDirty();
  };
  const onChangeSubmitAs = (value, index) => {
    let array = [];
    checkedSubmitAs.map((newValue, newIndex) => {
      if (newIndex === index) {
        return array.push(true);
      } else {
        return array.push(false);
      }
    });
    setCheckedSubmitAs(array);
    setReplyData({ ...replyData, status: value });
  };
  console.log(replyData);
  const onSubmitUpdate = async () => {
    props.updateTicket(editData);
    props.readDetailTicket(ticketId);
    setIsShowSweetAlert(true);
    setShowEditTicket(false);
    setPristine();
  };
  const onSubmitReply = async () => {
    props.replyTicket(replyData);
    props.readDetailTicket(ticketId);
    setReplyData({
      kodeTicket: ticketId,
      usernamePengirim: username,
      status: "Replied",
      base64FileName1: "",
      base64_1: "",
      base64FileName2: "",
      base64_2: "",
    });
    setSelectedFiles1(null);
    setSelectedFiles2(null);
    setPristine();
  };
  const ButtonSubmitReply = () => {
    if (
      replyData &&
      replyData.isi !== "" &&
      Object.keys(replyData).length >= 8
    ) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          onClick={() => {
            onSubmitReply();
          }}
        >
          <i className="bx bxs-send font-size-16 align-middle mr-2"></i>
          Send
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          disabled
          style={{ cursor: "default" }}
        >
          <i className="bx bxs-send font-size-16 align-middle mr-2"></i>
          Send
        </button>
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
              history.push(routes.detail_ticket + "?ticketId=" + ticketId);
            }}
          >
            The ticket has successfully edited!
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
      return <span style={{ color: color }}>{value.value}</span>;
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
            width: "max-content",
          }}
        >
          #{value.value}
        </span>
      );
    }
  };

  useEffect(() => {
    props.readDetailTicket(ticketId);
    props.readCategory({
      size: 0,
      page_no: 0,
      sort_by: "nama",
      order_by: "asc",
    });
    props.readUser({ size: 1000, page_no: 0, search: "*" });
    setReplyData({
      kodeTicket: ticketId,
      usernamePengirim: username,
      status: "Replied",
      base64FileName1: "",
      base64_1: "",
      base64FileName2: "",
      base64_2: "",
    });
    setCheckedSubmitAs([true, false, false, false]);
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Detail Ticket"} breadcrumbItem={"Ticket"} />
          <Row>
            <Col md={3}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-2">
                    Ticket {detail_ticket && detail_ticket.kodeTicket}
                  </CardTitle>
                  <Row>
                    <Col md={4}>
                      <div className="avatar-sm mx-auto mb-4">
                        <span
                          className={
                            "avatar-title rounded-circle bg-soft-" +
                            "primary" +
                            " text-" +
                            "primary" +
                            " font-size-16"
                          }
                        >
                          {detail_ticket &&
                            detail_ticket.usernamePembuat
                              .charAt(0)
                              .toUpperCase()}
                        </span>
                      </div>
                    </Col>
                    <Col>
                      <Row>
                        {detail_ticket && detail_ticket.usernamePembuat}
                      </Row>
                      <Row>{detail_ticket && detail_ticket.email}</Row>
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Col className="d-flex" style={{ flexFlow: "column" }}>
                      <strong>Location</strong>
                      {detail_ticket && detail_ticket.lokasi}
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Col className="d-flex" style={{ flexFlow: "column" }}>
                      <strong>Terminal Id</strong>
                      {detail_ticket && detail_ticket.terminalId}
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Col className="d-flex" style={{ flexFlow: "column" }}>
                      <strong>Replies</strong>0
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Col className="d-flex" style={{ flexFlow: "column" }}>
                      <strong>Replyd On</strong>
                      {detail_ticket && parseFullDate(detail_ticket.tglDibuat)}
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Col className="d-flex" style={{ flexFlow: "column" }}>
                      <strong>Updated On</strong>
                      {detail_ticket &&
                        parseFullDate(detail_ticket.tglDiperbarui)}
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Col className="d-flex" style={{ flexFlow: "column" }}>
                      <strong>Time Worked</strong>
                      {detail_ticket && detail_ticket.totalWaktu}
                    </Col>
                  </Row>
                  <div
                    className="mt-3"
                    style={{
                      borderTopColor: "#cfcfcf",
                      borderTopStyle: "solid",
                      borderTopWidth: "0.5px",
                      paddingTop: "4px",
                    }}
                  >
                    <Row className="align-items-center">
                      <Col className="d-flex justify-content-end align-items-center">
                        <span
                          className="btn-link waves-effect text-right"
                          onClick={() => onShowEdit()}
                        >
                          Edit
                          <i className="bx bxs-edit font-size-16 align-middle ml-1"></i>
                        </span>
                      </Col>
                    </Row>
                    {showEditTicket ? (
                      <>
                        <Row>
                          <Col>
                            <FormGroup className="select2-container">
                              <label className="control-label">Category</label>
                              <div>
                                <select
                                  name="kategori"
                                  className="form-control"
                                  onChange={(event) => (
                                    setEditData({
                                      ...editData,
                                      kategori: event.target.value,
                                    }),
                                    setDirty()
                                  )}
                                >
                                  {list_category &&
                                    list_category.map((value, index) => (
                                      <option
                                        key={index}
                                        value={value && value.codeLevel}
                                        onChange={(event) => (
                                          setEditData({
                                            ...editData,
                                            kategori: event.target.value,
                                          }),
                                          setDirty()
                                        )}
                                        selected={
                                          detail_ticket &&
                                          detail_ticket.kategori === value.nama
                                        }
                                      >
                                        {value.nama}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormGroup className="select2-container">
                              <label className="control-label">Status</label>
                              <div>
                                <select
                                  name="kategori"
                                  className="form-control"
                                  onChange={(event) =>
                                    onChangeStatus(event.target.value)
                                  }
                                  style={{
                                    color: statusColor,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {list_status.map((value, index) => (
                                    <option
                                      key={index}
                                      value={value && value.nama}
                                      onChange={(event) =>
                                        onChangeStatus(event.target.value)
                                      }
                                      style={{
                                        color: value.color,
                                        fontWeight: "bold",
                                      }}
                                      selected={
                                        detail_ticket &&
                                        detail_ticket.status === value.name
                                      }
                                    >
                                      {value.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormGroup className="select2-container">
                              <label className="control-label">Priority</label>
                              <div>
                                <select
                                  name="priority"
                                  className="form-control"
                                  onChange={(event) =>
                                    onChangePriority(event.target.value)
                                  }
                                  style={{
                                    color: priorityColor,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {list_priority.map((value, index) => (
                                    <option
                                      key={index}
                                      value={value.name}
                                      onChange={(event) =>
                                        onChangePriority(event.target.value)
                                      }
                                      style={{
                                        color: value.color,
                                        fontWeight: "bold",
                                      }}
                                      selected={
                                        detail_ticket &&
                                        detail_ticket.prioritas === value.name
                                      }
                                    >
                                      {value.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {" "}
                            <FormGroup className="select2-container">
                              <label className="control-label">Assign To</label>
                              <div>
                                <select
                                  name="assignedTo"
                                  className="form-control"
                                  defaultValue="Unassigned"
                                  onChange={(event) =>
                                    setEditData({
                                      ...editData,
                                      assignedTo: event.target.value,
                                    })
                                  }
                                >
                                  <option
                                    value="Unassigned"
                                    selected={
                                      detail_ticket &&
                                      detail_ticket.assignedTo === "Unassigned"
                                    }
                                  >
                                    Unassigned
                                  </option>
                                  {list_user &&
                                    list_user.map((value, index) => (
                                      <option
                                        key={index}
                                        value={value.name}
                                        onChange={(event) =>
                                          setReplyData({
                                            ...replyData,
                                            assignedTo: event.target.value,
                                          })
                                        }
                                        selected={
                                          detail_ticket &&
                                          detail_ticket.assignedTo ===
                                            value.name
                                        }
                                      >
                                        {value.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <>
                        <Row className="align-items-center mb-2">
                          <Col
                            className="d-flex"
                            style={{ flexFlow: "column" }}
                          >
                            <strong>Category</strong>
                            {detail_ticket && detail_ticket.kategori}
                          </Col>
                        </Row>
                        <Row className="align-items-center mb-2">
                          <Col
                            className="d-flex"
                            style={{ flexFlow: "column" }}
                          >
                            <strong>Status</strong>
                            <StatusLabel
                              value={detail_ticket && detail_ticket.status}
                            />
                          </Col>
                        </Row>
                        <Row className="align-items-center mb-2">
                          <Col
                            className="d-flex"
                            style={{ flexFlow: "column" }}
                          >
                            <strong>Priority</strong>
                            <PriorityLabel
                              value={detail_ticket && detail_ticket.prioritas}
                            />
                          </Col>
                        </Row>
                        <Row className={`align-items-center`}>
                          <Col
                            className="d-flex"
                            style={{ flexFlow: "column" }}
                          >
                            <strong>Assign To</strong>
                            {detail_ticket && detail_ticket.assignedTo}
                          </Col>
                        </Row>
                      </>
                    )}

                    {showEditTicket && (
                      <Row>
                        <Col className="d-flex justify-content-end">
                          <Button
                            color="primary"
                            outline
                            className="waves-effect waves-light"
                            onClick={() => setShowEditTicket(false)}
                          >
                            Cancel
                          </Button>
                        </Col>
                        <Col className="d-flex justify-content-start">
                          <button
                            type="button"
                            className="btn btn-primary waves-effect waves-light"
                            onClick={() => onSubmitUpdate()}
                          >
                            <i className="bx bx-save font-size-16 align-middle mr-2"></i>
                            Save
                          </button>
                        </Col>
                      </Row>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md={9}>
              <Card className="pr-2 pl-2">
                {list_reply_ticket &&
                  list_reply_ticket.map((value, index) => (
                    <CardBody
                      key={index}
                      style={{
                        borderBottomColor: "#cfcfcf",
                        borderBottomStyle: `${
                          index === list_reply_ticket.length - 1
                            ? `none`
                            : `solid`
                        }`,
                        borderBottomWidth: "1px",
                        paddingBottom: "1rem",
                      }}
                    >
                      {index === 0 && (
                        <h4 className="mb-4">
                          {detail_ticket && detail_ticket.judul}
                        </h4>
                      )}

                      <Row>
                        <Col md={1}>
                          <div className="avatar-sm mx-auto mb-4">
                            <span
                              className={`avatar-title rounded-circle bg-soft-${
                                value.usernamePengirim ===
                                detail_ticket.usernamePembuat
                                  ? "primary"
                                  : "success"
                              }
                                     text-${
                                       value.usernamePengirim ===
                                       detail_ticket.usernamePembuat
                                         ? "primary"
                                         : "success"
                                     }
                                    font-size-16`}
                            >
                              {value.usernamePengirim.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </Col>
                        <Col>
                          <Row className="align-align-items-start">
                            <Col>
                              <strong>From : </strong>
                              <h6>{value.usernamePengirim}</h6>
                            </Col>
                            <div className="text-right">
                              {parseFullDate(value.tglDibuat)}
                              <i className="bx bxs-printer font-size-24 align-middle ml-2"></i>
                            </div>
                          </Row>
                          <strong>Message :</strong>
                          <Row>
                            <Col>{value.isi}</Col>
                          </Row>
                          <Row className="justify-content-end">
                            <span style={{ color: "#f1b44c" }}>
                              <i className="display-4 bx bxs-file-pdf align-middle"></i>
                            </span>
                            <span style={{ color: "#556ee6" }}>
                              <i className="display-4 bx bxs-file-doc align-middle"></i>
                            </span>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  ))}
              </Card>
              <Card>
                <CardBody>
                  <CardTitle>
                    <i className="font-size-24 bx bxs-share align-middle"></i>{" "}
                    Reply
                  </CardTitle>
                  <AvForm>
                    <Row className="justify-content-center">
                      <Col md={10}>
                        <Row>
                          <Col>
                            <FormGroup className="select2-container">
                              <label className="control-label">
                                Write a message{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <AvField
                                name="isi"
                                label=""
                                type="textarea"
                                errorMessage="Message must be filled!"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={(event) => (
                                  setReplyData({
                                    ...replyData,
                                    [event.target.name]: event.target.value,
                                  }),
                                  setDirty()
                                )}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col>
                            <FormGroup className="select2-container">
                              <label
                                className="control-label"
                                style={{
                                  display: "grid",
                                  alignItems: "center",
                                  gridAutoFlow: "column",
                                }}
                              >
                                Attachment
                                <span
                                  className="btn-link waves-effect text-right"
                                  onClick={() => {
                                    setModalFilter(false);
                                    setModalRequirements(true);
                                  }}
                                >
                                  See requirements{" "}
                                  <span style={{ color: "#f1b44c" }}>
                                    <i className="bx bxs-error align-middle"></i>
                                  </span>
                                </span>
                              </label>
                              <Dropzone
                                onDrop={(acceptedFiles) => {
                                  handleAcceptedFiles(acceptedFiles, "1");
                                }}
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div
                                    className="dropzone align-content-center"
                                    style={{
                                      display: "grid",
                                    }}
                                  >
                                    <div
                                      className="dz-message needsclick"
                                      {...getRootProps()}
                                    >
                                      {selectedFiles1 ? (
                                        <Row>
                                          <Col md={2}>
                                            {selectedFiles1 &&
                                            selectedFiles1.file === "image" ? (
                                              <img
                                                data-dz-thumbnail=""
                                                className="rounded bg-light"
                                                style={{
                                                  width: "100%",
                                                }}
                                                alt={selectedFiles1.name}
                                                src={selectedFiles1.preview}
                                              />
                                            ) : (
                                              <i
                                                className={` bx ${
                                                  selectedFiles1 &&
                                                  selectedFiles1.icon
                                                } align-middle`}
                                                style={{
                                                  fontSize: "3.5rem",
                                                }}
                                              ></i>
                                            )}
                                          </Col>
                                          <Col
                                            md={8}
                                            style={{ display: "grid" }}
                                          >
                                            <Row className="text-left align-self-end">
                                              <h4>
                                                {selectedFiles1 &&
                                                  selectedFiles1.name}
                                              </h4>
                                            </Row>
                                            <Row className="text-left align-self-start">
                                              <div style={{ fontSize: "16px" }}>
                                                {selectedFiles1 &&
                                                  selectedFiles1.formattedSize}
                                              </div>
                                            </Row>
                                          </Col>{" "}
                                          <Col
                                            md={2}
                                            className="align-items-center d-flex"
                                          >
                                            <button
                                              type="button"
                                              className="btn btn-light waves-effect waves-light align-middle"
                                              onClick={() => {
                                                setSelectedFiles1(null);
                                              }}
                                            >
                                              <i
                                                className={`bx bx-x`}
                                                style={{
                                                  fontSize: "1.5rem",
                                                }}
                                              ></i>
                                            </button>
                                          </Col>
                                        </Row>
                                      ) : (
                                        <>
                                          <input {...getInputProps()} />
                                          <div className="mb-3">
                                            <i className="display-4 text-muted bx bxs-cloud-upload"></i>
                                          </div>
                                          <h4>
                                            Drop files here or click to upload.
                                          </h4>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                              <Dropzone
                                onDrop={(acceptedFiles) => {
                                  handleAcceptedFiles(acceptedFiles, "2");
                                }}
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div
                                    className="dropzone align-content-center mt-2"
                                    style={{
                                      display: "grid",
                                    }}
                                  >
                                    <div
                                      className="dz-message needsclick"
                                      {...getRootProps()}
                                    >
                                      {selectedFiles2 ? (
                                        <Row>
                                          <Col md={2}>
                                            {selectedFiles2 &&
                                            selectedFiles2.file === "image" ? (
                                              <img
                                                data-dz-thumbnail=""
                                                className="rounded bg-light"
                                                style={{
                                                  width: "100%",
                                                }}
                                                alt={selectedFiles2.name}
                                                src={selectedFiles2.preview}
                                              />
                                            ) : (
                                              <i
                                                className={` bx ${
                                                  selectedFiles2 &&
                                                  selectedFiles2.icon
                                                } align-middle`}
                                                style={{
                                                  fontSize: "3.5rem",
                                                }}
                                              ></i>
                                            )}
                                          </Col>
                                          <Col
                                            md={8}
                                            style={{ display: "grid" }}
                                          >
                                            <Row className="text-left align-self-end">
                                              <h4>
                                                {selectedFiles2 &&
                                                  selectedFiles2.name}
                                              </h4>
                                            </Row>
                                            <Row className="text-left align-self-start">
                                              <div style={{ fontSize: "16px" }}>
                                                {selectedFiles2 &&
                                                  selectedFiles2.formattedSize}
                                              </div>
                                            </Row>
                                          </Col>{" "}
                                          <Col
                                            md={2}
                                            className="align-items-center d-flex"
                                          >
                                            <button
                                              type="button"
                                              className="btn btn-light waves-effect waves-light align-middle"
                                              onClick={() => {
                                                setSelectedFiles2(null);
                                              }}
                                            >
                                              <i
                                                className={`bx bx-x`}
                                                style={{
                                                  fontSize: "1.5rem",
                                                }}
                                              ></i>
                                            </button>
                                          </Col>
                                        </Row>
                                      ) : (
                                        <>
                                          <input {...getInputProps()} />
                                          <div className="mb-3">
                                            <i className="display-4 text-muted bx bxs-cloud-upload"></i>
                                          </div>
                                          <h4>
                                            Drop files here or click to upload.
                                          </h4>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="mt-2 justify-content-center">
                          <Col>
                            <FormGroup className="select2-container">
                              <label className="control-label">Submit as</label>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(4, 1fr)",
                                  columnGap: "1rem",
                                }}
                              >
                                {list_reply_status.map((value, index) => (
                                  <ul
                                    className="sub-menu"
                                    aria-expanded="true"
                                    style={{ listStyle: "none" }}
                                    key={index}
                                  >
                                    <li>
                                      <div className="has-arrow">
                                        <div className="custom-control custom-checkbox mb-3">
                                          <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="CustomCheck1"
                                            onChange={() => false}
                                            checked={
                                              checkedSubmitAs &&
                                              checkedSubmitAs[index]
                                            }
                                          />
                                          <label
                                            className="custom-control-label"
                                            style={{ color: value.color }}
                                            onClick={() =>
                                              onChangeSubmitAs(
                                                value.name,
                                                index
                                              )
                                            }
                                          >
                                            <span>{value.name}</span>
                                          </label>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                ))}
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </AvForm>
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
                    <ButtonSubmitReply />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* Modal Filter */}
          <Modal
            isOpen={modalFilter}
            toggle={() => {
              setModalFilter(!modalFilter);
              removeBodyCss();
            }}
            centered
          >
            <div className="modal-header">
              <button
                type="button"
                onClick={() => {
                  setModalFilter(false);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center">
              <span style={{ color: "#f46a6a" }}>
                {" "}
                <i className="display-4 bx bxs-x-circle align-middle"></i>
              </span>
              <h3 className="mb-3">Cannot upload this file!</h3>
              <button
                className="btn btn-link waves-effect"
                onClick={() => {
                  setModalFilter(false);
                  setModalRequirements(true);
                }}
                style={{ fontSize: "1rem" }}
              >
                See requirements{" "}
                <span style={{ color: "#f1b44c" }}>
                  <i className="bx bxs-error align-middle"></i>
                </span>
              </button>
            </div>
          </Modal>

          <Modal
            isOpen={modalRequirements}
            toggle={() => {
              setModalRequirements(!modalRequirements);
              removeBodyCss();
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                File Upload Limits{" "}
                <span style={{ color: "#f1b44c" }}>
                  <i className="bx bxs-error align-middle"></i>
                </span>
              </h5>
              <button
                type="button"
                onClick={() => {
                  setModalRequirements(false);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div
              className="modal-body"
              style={{ lineHeight: "24px", fontSize: "14px" }}
            >
              1. Maximum number of attachments: <strong>2</strong> <br />
              2. Maximum size per attachment: <strong>2 MB</strong>
              <br />
              3. You may upload files ending with: <br />
              <strong>
                .gif, .jpg, .png, .zip, .rar, .csv, .doc, .docx, .xls, .xlsx,
                .txt, .pdf
              </strong>
            </div>
          </Modal>
          {Prompt}
          <ShowSweetAlert />
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const {
    detail_ticket,
    list_reply_ticket,
    message_ticket,
    response_code_ticket,
    loading,
  } = state.Ticket;
  const { list_category } = state.Category;
  const { list_user } = state.User;
  return {
    list_category,
    list_user,
    detail_ticket,
    list_reply_ticket,
    response_code_ticket,
    message_ticket,

    loading,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readDetailTicket,
      updateTicket,
      readCategory,
      readUser,
      replyTicket,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(DetailTicket);
