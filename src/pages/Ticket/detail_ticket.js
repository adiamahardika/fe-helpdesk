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
} from "reactstrap";
import {
  readDetailTicket,
  updateTicket,
  replyTicket,
  startTicket,
  closeTicket,
} from "../../store/pages/ticket/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { parseFullDate } from "../../helpers/index";
import { useHistory } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { saveAs } from "file-saver";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import general_constant from "../../helpers/general_constant.json";
import routes from "../../helpers/routes.json";
import queryString from "query-string";
import Dropzone from "react-dropzone";
import UnsavedChangesWarning from "../../helpers/unsaved_changes_warning";
import CryptoJS from "crypto-js";
import Loader from "../../helpers/loader";
import "../../assets/css/pagination.css";
require("dotenv").config();

const DetailTicket = (props) => {
  const detail_ticket = props.detail_ticket;
  const list_reply_ticket = props.list_reply_ticket;
  const message = props.message_ticket;
  const response_code = props.response_code_ticket;
  const loading = props.loading;
  const username = sessionStorage.getItem("username");
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      sessionStorage.getItem("permission"),
      `${process.env.ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );
  const history = useHistory();
  const { search } = useLocation();
  const { ticketId } = queryString.parse(search);
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [replyData, setReplyData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [modalFilter, setModalFilter] = useState(false);
  const [modalRequirements, setModalRequirements] = useState(false);
  const [modalStart, setModalStart] = useState(false);
  const [modalClose, setModalClose] = useState(false);

  const [statusColor, setStatusColor] = useState(null);
  const [isEditTicket, setIsEditTicket] = useState(false);
  const [isStartTicket, setIsStartTicket] = useState(false);
  const [isCloseTicket, setIsCloseTicket] = useState(false);
  const [isReplyTicket, setIsReplyTicket] = useState(false);
  const [isChangeStatus, setIsChangeStatus] = useState(false);

  const [selectedFiles1, setSelectedFiles1] = useState(null);
  const [selectedFiles2, setSelectedFiles2] = useState(null);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const handleAcceptedFiles = async (files, number) => {
    let icon = null;
    let color = null;
    let fileType = null;
    let reader = new FileReader();
    let split = files[0].type.split("/");
    let fileName = files[0].name.split(".");
    const extension = fileName[fileName.length - 1].toLowerCase();
    let extensionCheck = false;
    let sizeCheck = false;

    if (files[0].size <= 1000000) {
      sizeCheck = true;
    }

    let findIndex = general_constant.file_extension.findIndex(
      (item) => item.name === extension
    );
    if (findIndex >= 0) {
      color = general_constant.file_extension[findIndex].color;
      icon = general_constant.file_extension[findIndex].icon;
      extensionCheck =
        general_constant.file_extension[findIndex].extension_check;
    } else {
      extensionCheck = false;
      color = "#556ee6";
      icon = "bx bxs-file";
    }

    if (extensionCheck && sizeCheck) {
      if (split[0] === "application") {
        fileType = "file";
      } else if (split[0] === "image") {
        fileType = "image";
      }
      Object.assign(files[0], {
        preview: URL.createObjectURL(files[0]),
        formattedSize: formatBytes(files[0].size),
        icon: icon,
        color: color,
        file: fileType,
      });
      reader.onload = () => {
        if (reader.readyState === 2) {
          if (number === "1") {
            setSelectedFiles1(files[0]);
            setReplyData({
              ...replyData,
              attachment1: files[0],
            });
          } else {
            setSelectedFiles2(files[0]);
            setReplyData({
              ...replyData,
              attachment2: files[0],
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
  const onChangeStatus = async (value) => {
    if (value) {
      let findIndexStatus = general_constant.status.findIndex(
        (item) => item.name === value
      );
      let selected = general_constant.status[findIndexStatus];
      setStatusColor(selected.color);
      setReplyData({
        ...replyData,
        status: value,
        replyType: selected.replyType,
      });
    }
    setDirty();
  };
  const showChangeStatus = async (value) => {
    setIsChangeStatus(value);

    let status;
    let reply_type;
    if (value === false) {
      status = detail_ticket.status;
      reply_type = "";
    } else {
      status = "Finish";
      reply_type = "close";
      setStatusColor("#34c38f");
    }
    setReplyData({
      ...replyData,
      status: status,
      replyType: reply_type,
    });
  };

  const onSubmitReply = async (event) => {
    event.preventDefault();
    let reply_request = new FormData();
    reply_request.append("ticketCode", ticketId);
    reply_request.append("isi", replyData.isi);
    reply_request.append("usernamePengirim", replyData.usernamePengirim);
    selectedFiles1 &&
      reply_request.append("attachment1", replyData.attachment1);
    selectedFiles2 &&
      reply_request.append("attachment2", replyData.attachment2);
    reply_request.append("status", replyData.status);
    reply_request.append("emailNotification", detail_ticket.emailNotification);
    reply_request.append("replyType", replyData.replyType);
    reply_request.append("updatedBy", replyData.updatedBy);
    props.replyTicket(reply_request, ticketId);
    setSelectedFiles1(null);
    setSelectedFiles2(null);
    setPristine();
  };

  const ButtonSubmitReply = () => {
    if (
      replyData &&
      replyData.isi !== "" &&
      Object.keys(replyData).length >= 4
    ) {
      return (
        <a href={`#reply-${list_reply_ticket && list_reply_ticket.length - 1}`}>
          <button
            type="button"
            className="btn btn-primary waves-effect waves-light"
            onClick={(event) => {
              onSubmitReply(event);
              setAlertMessage("replied");
              setIsShowSweetAlert(true);
            }}
          >
            <i className="bx bxs-send font-size-16 align-middle mr-2"></i>
            Send
          </button>
        </a>
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
              setModalStart(false);
              setModalClose(false);
              history.push(routes.detail_ticket + "?ticketId=" + ticketId);
            }}
          >
            The ticket has successfully {alertMessage}!
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

  const FileIcon = (value) => {
    const split = value && value.value.split(".");
    const extension = split[split.length - 1].toLowerCase();
    const file_name = value && value.value.split("/");
    let is_image = false;
    let color = null;
    let icon = null;

    let findIndex = general_constant.file_extension.findIndex(
      (item) => item.name === extension
    );
    if (findIndex >= 0) {
      color = general_constant.file_extension[findIndex].color;
      icon = general_constant.file_extension[findIndex].icon;
      is_image = general_constant.file_extension[findIndex].is_image;
    } else {
      color = "#34c38f";
      icon = "bx bxs-file";
      is_image = false;
    }
    return (
      <button
        onClick={() => saveAs(value.value, file_name[file_name.length - 1])}
        style={{
          maxWidth: "125px",
          backgroundColor: "transparent",
          border: "none",
        }}
      >
        {is_image ? (
          <img
            data-dz-thumbnail=""
            className="rounded bg-light"
            style={{
              width: "100%",
            }}
            alt={file_name[file_name.length - 1]}
            src={value.value}
          />
        ) : (
          <>
            <span
              style={{ color: color }}
              className="d-flex justify-content-center"
            >
              <i className={`${icon} display-4 align-middle`}></i>
            </span>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {file_name[file_name.length - 1]}
            </div>
          </>
        )}
      </button>
    );
  };
  const StatusLabel = (value) => {
    if (value) {
      let index = general_constant.status.findIndex(
        (item) => item.name === value.value
      );
      let color = index >= 0 ? general_constant.status[index].color : "#343a40";
      return <h6 style={{ color: color }}>{value.value}</h6>;
    }
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
    let viewDetailTicket = permissions.find(
      (value) => value.code === code_all_permissions.view_detail_ticket
    );
    let editTicket = permissions.find(
      (value) => value.code === code_all_permissions.edit_ticket
    );
    let closeTicket = permissions.find(
      (value) => value.code === code_all_permissions.close_ticket
    );
    let startTicket = permissions.find(
      (value) => value.code === code_all_permissions.start_ticket
    );
    let replyTicket = permissions.find(
      (value) => value.code === code_all_permissions.reply_ticket
    );
    if (viewDetailTicket) {
      props.readDetailTicket(ticketId);

      editTicket && setIsEditTicket(true);
      startTicket && setIsStartTicket(true);
      closeTicket && setIsCloseTicket(true);
      replyTicket && setIsReplyTicket(true);
    } else {
      history.push(routes.ticket);
    }
  }, []);
  useEffect(() => {
    if (detail_ticket === null) {
      props.readDetailTicket(ticketId);
    } else {
      let findStatus = general_constant.status.findIndex(
        (value) => value.name === detail_ticket.status
      );
      let selected = general_constant.status[findStatus];

      findStatus >= 0 &&
        setStatusColor(selected.order > 2 ? selected.color : "#34c38f");

      let reply_type = "";
      let ticket_status = detail_ticket.status;
      if (isStartTicket && detail_ticket.status === "New") {
        reply_type = "start";
        ticket_status = "Process";
      }
      setReplyData({
        ticketCode: ticketId,
        usernamePengirim: username,
        status: ticket_status,
        isi: "",
        updatedBy: username,
        replyType: reply_type,
      });
    }
  }, [detail_ticket]);
  return (
    <React.Fragment>
      {" "}
      {loading && <Loader />}
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Detail Ticket"} breadcrumbItem={"Ticket"} />
          <Row>
            <Col md={3}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-2 justify-content-center d-flex">
                    <h3>{detail_ticket && detail_ticket.ticketCode}</h3>
                  </CardTitle>
                  <Row>
                    <Col>
                      <div className="avatar-xl mx-auto mb-4">
                        <span
                          className={
                            "avatar-title rounded-circle bg-soft-" +
                            "primary" +
                            " text-" +
                            "primary"
                          }
                          style={{ fontSize: "2rem" }}
                        >
                          {detail_ticket &&
                            detail_ticket.userPembuat.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col
                      className="d-flex"
                      style={{ flexFlow: "column", overflowWrap: "anywhere" }}
                    >
                      <strong>
                        {detail_ticket && detail_ticket.userPembuat}
                      </strong>
                      <strong>{detail_ticket && detail_ticket.email}</strong>
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Col className="d-flex" style={{ flexFlow: "column" }}>
                      Area
                      <strong>{detail_ticket && detail_ticket.areaName}</strong>
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Col className="d-flex" style={{ flexFlow: "column" }}>
                      Region
                      <strong>
                        {detail_ticket && detail_ticket.regional}{" "}
                      </strong>
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Col className="d-flex" style={{ flexFlow: "column" }}>
                      Grapari
                      <strong>
                        {detail_ticket && detail_ticket.grapariName}
                      </strong>
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Col className="d-flex" style={{ flexFlow: "column" }}>
                      Location
                      <strong>{detail_ticket && detail_ticket.lokasi}</strong>
                    </Col>
                  </Row>
                  <Row className="align-items-center mb-2">
                    <Col className="d-flex" style={{ flexFlow: "column" }}>
                      Terminal Id
                      <strong>
                        {detail_ticket && detail_ticket.terminalId}
                      </strong>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col md={9}>
              <Card className="pr-2 pl-2">
                <CardBody>
                  <Row className="mb-2">
                    <Col>
                      <h4>{detail_ticket && detail_ticket.judul}</h4>
                    </Col>
                    <Col
                      md={4}
                      className="justify-content-end d-flex d-print-none align-items-center"
                    >
                      <span
                        className="waves-effect text-right"
                        onClick={() => window.print()}
                      >
                        <i className="bx bxs-printer font-size-24 align-middle mr-2"></i>
                      </span>
                      {isStartTicket &&
                        detail_ticket &&
                        detail_ticket.status === "New" && (
                          <button
                            type="button"
                            className="btn btn-success waves-effect waves-light mr-2 d-flex align-items-center"
                            onClick={() => setModalStart(true)}
                          >
                            <i className="bx bx-play font-size-16 align-middle mr-1"></i>
                            Start
                          </button>
                        )}
                      {isCloseTicket &&
                        detail_ticket &&
                        detail_ticket.status !== "New" &&
                        detail_ticket.status !== "Finish" && (
                          <button
                            type="button"
                            className="btn btn-success waves-effect waves-light mr-2 d-flex align-items-center"
                            onClick={() => setModalClose(true)}
                          >
                            <i className="bx bx-stop font-size-16 align-middle mr-1"></i>
                            Close
                          </button>
                        )}
                      {isEditTicket && (
                        <Link
                          to={{
                            pathname: routes.edit_ticket,
                            search: `?ticketId=${ticketId}`,
                            detailValue: ticketId,
                          }}
                          className="d-flex align-items-center"
                        >
                          <button
                            type="button"
                            className="btn btn-primary waves-effect waves-light"
                          >
                            <i className="bx bx-edit font-size-16 align-middle mr-1"></i>
                            Edit
                          </button>
                        </Link>
                      )}
                    </Col>
                  </Row>
                  <Row className="justify-content-end">
                    <Col>
                      <div className="text-right" style={{ fontSize: "12px" }}>
                        {parseFullDate(
                          list_reply_ticket && list_reply_ticket[0].tglDibuat
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={3}>
                      <Row>
                        <Col>
                          Status:
                          <StatusLabel
                            value={detail_ticket && detail_ticket.status}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          Priority:
                          <PriorityLabel
                            value={detail_ticket && detail_ticket.prioritas}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      <Row>
                        <Col>
                          Category:
                          <h6>{detail_ticket && detail_ticket.categoryName}</h6>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          Sub Category:
                          <h6>{detail_ticket && detail_ticket.subCategory}</h6>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={4}>
                      <Row>
                        <Col>
                          Assign To:
                          <h6>
                            {detail_ticket && detail_ticket.assignee.length > 0
                              ? detail_ticket.assignee
                              : "Unassigned"}
                          </h6>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Row>
                        <Col style={{ whiteSpace: "pre-line" }}>
                          {list_reply_ticket && list_reply_ticket[0].isi}
                        </Col>
                      </Row>
                      <Row className="justify-content-end">
                        {list_reply_ticket &&
                          list_reply_ticket[0].attachment1 !== "-" && (
                            <FileIcon
                              value={
                                list_reply_ticket &&
                                list_reply_ticket[0].attachment1
                              }
                            />
                          )}
                        {list_reply_ticket &&
                          list_reply_ticket[0].attachment2 !== "-" && (
                            <FileIcon
                              value={
                                list_reply_ticket &&
                                list_reply_ticket[0].attachment2
                              }
                            />
                          )}
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card className="pr-2 pl-2">
                <CardBody>
                  <CardTitle>Replies</CardTitle>
                  {list_reply_ticket &&
                    list_reply_ticket.map(
                      (value, index) =>
                        index > 0 && (
                          <Row
                            key={index}
                            id={`reply-${index + 1}`}
                            style={{
                              borderBottomColor: "#cfcfcf",
                              borderBottomStyle: `${
                                index === list_reply_ticket.length - 1
                                  ? `none`
                                  : `solid`
                              }`,
                              borderBottomWidth: "1px",
                              paddingBottom: "1rem",
                              marginTop: "1rem",
                            }}
                          >
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
                                  {value.usernamePengirim
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                            </Col>
                            <Col>
                              <Row className="align-align-items-start">
                                <Col>
                                  <strong>From : </strong>
                                  <h6>{value.usernamePengirim}</h6>
                                </Col>
                                <div
                                  className="text-right"
                                  style={{ fontSize: "12px" }}
                                >
                                  {parseFullDate(value.tglDibuat)}
                                </div>
                              </Row>
                              <strong>Message :</strong>
                              <Row>
                                <Col style={{ whiteSpace: "pre-line" }}>
                                  {value.isi}
                                </Col>
                              </Row>
                              <Row className="justify-content-end">
                                {value.attachment1 !== "-" && (
                                  <FileIcon value={value.attachment1} />
                                )}
                                {value.attachment2 !== "-" && (
                                  <FileIcon value={value.attachment2} />
                                )}
                              </Row>
                            </Col>
                          </Row>
                        )
                    )}
                </CardBody>
              </Card>
              {isReplyTicket &&
                detail_ticket &&
                detail_ticket.status !== "Finish" && (
                  <Card className="d-print-none">
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
                                    value={replyData && replyData.isi}
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
                                                selectedFiles1.file ===
                                                  "image" ? (
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
                                                  <span
                                                    style={{
                                                      color: `${
                                                        selectedFiles1 &&
                                                        selectedFiles1.color
                                                      }`,
                                                    }}
                                                  >
                                                    <i
                                                      className={` bx ${
                                                        selectedFiles1 &&
                                                        selectedFiles1.icon
                                                      } align-middle`}
                                                      style={{
                                                        fontSize: "3.5rem",
                                                      }}
                                                    ></i>
                                                  </span>
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
                                                  <div
                                                    style={{
                                                      fontSize: "16px",
                                                    }}
                                                  >
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
                                                    delete replyData.attachment1;
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
                                                Drop files here or click to
                                                upload.
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
                                                selectedFiles2.file ===
                                                  "image" ? (
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
                                                  <span
                                                    style={{
                                                      color: `${
                                                        selectedFiles2 &&
                                                        selectedFiles2.color
                                                      }`,
                                                    }}
                                                  >
                                                    <i
                                                      className={` bx ${
                                                        selectedFiles2 &&
                                                        selectedFiles2.icon
                                                      } align-middle`}
                                                      style={{
                                                        fontSize: "3.5rem",
                                                      }}
                                                    ></i>
                                                  </span>
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
                                                  <div
                                                    style={{
                                                      fontSize: "16px",
                                                    }}
                                                  >
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
                                                    delete replyData.attachment2;
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
                                                Drop files here or click to
                                                upload.
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
                            {isCloseTicket &&
                              detail_ticket &&
                              detail_ticket.status !== "New" &&
                              detail_ticket.status !== "Finish" && (
                                <>
                                  <Row className="mt-2 justify-content-center">
                                    <Col>
                                      <FormGroup>
                                        <div className="custom-control custom-checkbox">
                                          <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="CustomCheck1"
                                            onChange={() => false}
                                            checked={isChangeStatus}
                                          />
                                          <label
                                            className="custom-control-label"
                                            onClick={() => {
                                              showChangeStatus(!isChangeStatus);
                                            }}
                                          >
                                            Change Status
                                          </label>
                                        </div>
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  {isChangeStatus && (
                                    <Row>
                                      <Col md={4}>
                                        <FormGroup className="select2-container">
                                          <div>
                                            <select
                                              name="category"
                                              className="form-control"
                                              onChange={(event) =>
                                                onChangeStatus(
                                                  event.target.value
                                                )
                                              }
                                              style={{
                                                color: statusColor,
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {general_constant.status.map(
                                                (value, index) =>
                                                  value.order > 2 && (
                                                    <option
                                                      key={index}
                                                      value={
                                                        value && value.name
                                                      }
                                                      onChange={(event) =>
                                                        onChangeStatus(
                                                          event.target.value
                                                        )
                                                      }
                                                      style={{
                                                        color: value.color,
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {value.name}
                                                    </option>
                                                  )
                                              )}
                                            </select>
                                          </div>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  )}
                                </>
                              )}
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
                )}
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
              2. Maximum size per attachment: <strong>1 MB</strong>
              <br />
              3. You may upload files ending with: <br />
              <strong>
                .jpg, .jpeg, .png, .zip, .rar, .csv, .doc, .docx, .xls, .xlsx,
                .txt, .pdf, .mp4, .mkv
              </strong>
            </div>
          </Modal>

          {/* Modal Start */}
          <Modal
            isOpen={modalStart}
            toggle={() => {
              setModalStart(!modalStart);
              removeBodyCss();
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Start Ticket
              </h5>
              <button
                type="button"
                onClick={() => {
                  setModalStart(false);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Are you sure want to start this ticket?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => {
                  setModalStart(!modalStart);
                  removeBodyCss();
                }}
                className="btn btn-secondary waves-effect"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success waves-effect waves-light"
                onClick={() => {
                  setAlertMessage("started");
                  setIsShowSweetAlert(true);
                  props.startTicket(
                    {
                      ticketCode: ticketId,
                      startBy: username,
                    },
                    ticketId
                  );
                }}
              >
                Start
              </button>
            </div>
          </Modal>

          {/* Modal Close */}
          <Modal
            isOpen={modalClose}
            toggle={() => {
              setModalClose(!modalClose);
              removeBodyCss();
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Close Ticket
              </h5>
              <button
                type="button"
                onClick={() => {
                  setModalClose(false);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Are you sure want to close this ticket?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => {
                  setModalClose(!modalClose);
                  removeBodyCss();
                }}
                className="btn btn-secondary waves-effect"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success waves-effect waves-light"
                onClick={() => {
                  setAlertMessage("closed");
                  setIsShowSweetAlert(true);
                  props.closeTicket(
                    {
                      ticketCode: ticketId,
                      closeBy: username,
                    },
                    ticketId
                  );
                }}
              >
                Close
              </button>
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
  const { list_ticket_status } = state.TicketStatus;
  return {
    list_category,
    list_user,
    list_ticket_status,
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
      replyTicket,
      startTicket,
      closeTicket,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(DetailTicket);
