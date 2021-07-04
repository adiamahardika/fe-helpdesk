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
import { readDetailTicket } from "../../store/pages/ticket/actions";
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

const DetailTicket = (props) => {
  const detail_ticket = props.detail_ticket;
  const list_reply_ticket = props.list_reply_ticket;
  const message = props.message_ticket;
  const response_code = props.response_code_ticket;
  const permissions = JSON.parse(localStorage.getItem("permission"));
  const history = useHistory();
  const { search } = useLocation();
  const { ticketId } = queryString.parse(search);
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [data, setData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [modalFilter, setModalFilter] = useState(false);
  const [modalRequirements, setModalRequirements] = useState(false);

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
            setData({
              ...data,
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
            setData({
              ...data,
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

  const onSubmitCreate = async () => {
    props.createTicket(data);
    setIsShowSweetAlert(true);
    setPristine();
  };
  const ButtonSubmitCreate = () => {
    if (data && Object.keys(data).length >= 16) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          onClick={() => {
            onSubmitCreate();
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
                            detail_ticket.usernamePembuat.charAt(0)}
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
                      <strong>Created On</strong>
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
                  <div
                    className="mt-3"
                    style={{
                      borderTopColor: "#cfcfcf",
                      borderTopStyle: "solid",
                      borderTopWidth: "0.5px",
                      paddingTop: "1rem",
                    }}
                  >
                    <Row className="align-items-center mb-2">
                      <Col className="d-flex" style={{ flexFlow: "column" }}>
                        <strong>Category</strong>
                        {detail_ticket && detail_ticket.kategori}
                      </Col>
                    </Row>
                    <Row className="align-items-center mb-2">
                      <Col className="d-flex" style={{ flexFlow: "column" }}>
                        <strong>Status</strong>
                        <StatusLabel
                          value={detail_ticket && detail_ticket.status}
                        />
                      </Col>
                    </Row>
                    <Row className="align-items-center mb-2">
                      <Col className="d-flex" style={{ flexFlow: "column" }}>
                        <strong>Priority</strong>
                        <PriorityLabel
                          value={detail_ticket && detail_ticket.prioritas}
                        />
                      </Col>
                    </Row>
                    <Row className="align-items-center mb-2">
                      <Col className="d-flex" style={{ flexFlow: "column" }}>
                        <strong>Assign To</strong>
                        {detail_ticket && detail_ticket.assignedTo}
                      </Col>
                    </Row>
                    <Row className="align-items-center mb-2">
                      <Col className="d-flex" style={{ flexFlow: "column" }}>
                        <strong>Time Worked</strong>
                        {detail_ticket && detail_ticket.totalWaktu}
                      </Col>
                    </Row>
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
                              {value.usernamePengirim.charAt(0)}
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
                      <Col md={8}>
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
                    <ButtonSubmitCreate />
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
  return {
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
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(DetailTicket);
