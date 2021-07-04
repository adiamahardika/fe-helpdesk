import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  FormGroup,
  Row,
  Col,
  CardTitle,
  Modal,
} from "reactstrap";
import { readCategory } from "../../store/pages/category/actions";
import { readUser } from "../../store/pages/users/actions";
import { createTicket } from "../../store/pages/ticket/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import general_constant from "../../helpers/general_constant.json";
import UnsavedChangesWarning from "../../helpers/unsaved_changes_warning";
import routes from "../../helpers/routes.json";
import Dropzone from "react-dropzone";

const priority = [
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

const AddTicket = (props) => {
  let message = props.message_ticket;
  let response_code = props.response_code_ticket;
  const loading = props.loading;
  const list_category = props.list_category;
  const list_user = props.list_user;
  const permissions = JSON.parse(localStorage.getItem("permission"));
  const username = localStorage.getItem("username");
  const history = useHistory();
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [data, setData] = useState(null);
  const [validEmail, setValidEmail] = useState(false);
  const [optionColor, setOptionColor] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [selectedFiles1, setSelectedFiles1] = useState(null);
  const [selectedFiles2, setSelectedFiles2] = useState(null);
  const [customchk, setcustomchk] = useState(true);
  const [modalFilter, setModalFilter] = useState(false);
  const [modalRequirements, setModalRequirements] = useState(false);

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

  const onChangeData = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    setDirty();
  };
  const onChangeOption = async (value) => {
    if (value) {
      switch (value) {
        case "High":
          setOptionColor("#f46a6a");
          break;
        case "Medium":
          setOptionColor("#f1b44c");
          break;
        case "Critical":
          setOptionColor("#9400d3");
          break;
        case "Low":
          setOptionColor("#34c38f");
          break;
        default:
          setOptionColor("#34c38f");
      }
      setData({
        ...data,
        prioritas: value,
      });
    }
    setDirty();
  };
  const onValidateEmail = (email) => {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setData({
      ...data,
      email: email,
    });
    setDirty();
    if (regex.test(email) === true) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };

  const onSubmitCreate = async () => {
    props.createTicket(data);
    setIsShowSweetAlert(true);
    setPristine();
  };
  const ButtonSubmitCreate = () => {
    if (data && Object.keys(data).length >= 16 && validEmail) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          onClick={() => {
            onSubmitCreate();
          }}
        >
          <i className="bx bxs-send font-size-16 align-middle mr-2"></i>
          Submit
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
          Submit
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
              setData(null);
              history.push(routes.ticket);
            }}
          >
            Ticket has successfully created!
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
    props.readCategory({
      size: 0,
      page_no: 0,
      sort_by: "nama",
      order_by: "asc",
    });
    props.readUser({ size: 1000, page_no: 0, search: "*" });
    setData({
      totalWaktu: "00:00:00",
      status: "New",
      prioritas: "Low",
      assignTo: "Unassigned",
      userPembuat: username,
      userPengirim: username,
      base64FileName1: "",
      base64_1: "",
      base64FileName2: "",
      base64_2: "",
    });
    setOptionColor("#34c38f");
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Ticket"} breadcrumbItem={"Add Ticket"} />
          <Card>
            <CardBody>
              <CardTitle className="text-center mb-2">
                Insert a new ticket
              </CardTitle>
              <h6 className="text-center mb-4">
                Required fields are marked with{" "}
                <span style={{ color: "red" }}>*</span>
              </h6>
              <AvForm>
                <Row className="justify-content-center">
                  <Col md={8}>
                    <Row>
                      <Col md={5}>
                        <FormGroup className="select2-container">
                          <label className="control-label">
                            Location <span style={{ color: "red" }}>*</span>
                          </label>
                          <AvField
                            name="lokasi"
                            label=""
                            type="text"
                            errorMessage="Location must be filled"
                            validate={{
                              required: { value: true },
                              maxLength: { value: 25 },
                            }}
                            onChange={onChangeData}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup className="select2-container">
                          <label className="control-label">
                            Terminal Id <span style={{ color: "red" }}>*</span>
                          </label>
                          <AvField
                            name="terminalId"
                            label=""
                            type="text"
                            errorMessage="Terminal Id must be filled"
                            validate={{
                              required: { value: true },
                              maxLength: { value: 25 },
                            }}
                            onChange={onChangeData}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={8}>
                        <FormGroup className="select2-container">
                          <label className="control-label">
                            Email <span style={{ color: "red" }}>*</span>
                          </label>
                          <AvField
                            name="email"
                            label=""
                            placeholder="ex: shop@mail.com"
                            type="email"
                            errorMessage="Enter valid Email"
                            validate={{
                              required: { value: true },
                              maxLength: { value: 30 },
                            }}
                            onChange={(event) =>
                              onValidateEmail(event.target.value)
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md={3}>
                        <FormGroup className="select2-container">
                          <label className="control-label">
                            Priority <span style={{ color: "red" }}>*</span>
                          </label>
                          <div>
                            <select
                              name="priority"
                              className="form-control"
                              defaultValue={priority[0]}
                              onChange={(event) =>
                                onChangeOption(event.target.value)
                              }
                              style={{
                                color: optionColor,
                                fontWeight: "bold",
                              }}
                            >
                              {priority.map((value, index) => (
                                <option
                                  key={index}
                                  value={value.name}
                                  onChange={(event) =>
                                    onChangeOption(event.target.value)
                                  }
                                  style={{
                                    color: value.color,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {value.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup className="select2-container">
                          <label className="control-label">
                            Category <span style={{ color: "red" }}>*</span>
                          </label>
                          <div>
                            <select
                              name="kategori"
                              className="form-control"
                              defaultValue="0"
                              onChange={(event) => (
                                setData({
                                  ...data,
                                  kategori: event.target.value,
                                }),
                                setDirty()
                              )}
                            >
                              <option value="0" disabled>
                                Select Category
                              </option>
                              {list_category &&
                                list_category.map((value, index) => (
                                  <option
                                    key={index}
                                    value={value && value.nama}
                                    onChange={(event) => (
                                      setData({
                                        ...data,
                                        kategori: event.target.value,
                                      }),
                                      setDirty()
                                    )}
                                  >
                                    {value.nama}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        <FormGroup className="select2-container">
                          <label className="control-label">
                            Subject <span style={{ color: "red" }}>*</span>
                          </label>
                          <AvField
                            name="judul"
                            label=""
                            type="text"
                            errorMessage="Subject must be filled!"
                            validate={{
                              required: { value: true },
                              maxLength: { value: 40 },
                            }}
                            onChange={onChangeData}
                          />
                        </FormGroup>
                        <FormGroup className="select2-container">
                          <label className="control-label">
                            Message <span style={{ color: "red" }}>*</span>
                          </label>
                          <AvField
                            name="isi"
                            label=""
                            type="textarea"
                            errorMessage="Message must be filled!"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={onChangeData}
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
                                      <Col md={8} style={{ display: "grid" }}>
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
                                      <Col md={8} style={{ display: "grid" }}>
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
                    <Row className="mt-3">
                      <Col>
                        <FormGroup className="select2-container">
                          <label className="control-label">Options</label>
                          <div className="custom-control custom-checkbox mb-1">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="CustomCheck1"
                              onChange={() => false}
                              checked={customchk}
                            />
                            <label
                              className="custom-control-label"
                              onClick={() => {
                                setcustomchk(!customchk);
                              }}
                            >
                              Send email notification to the customer
                            </label>
                          </div>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="CustomCheck1"
                              onChange={() => false}
                              checked={customchk}
                            />
                            <label
                              className="custom-control-label"
                              onClick={() => {
                                setcustomchk(!customchk);
                              }}
                            >
                              Show the ticket after submission
                            </label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md={6}>
                        <FormGroup className="select2-container">
                          <label className="control-label">Owner</label>
                          <Row className="align-items-center">
                            <Col md={5}>
                              <div
                                className="mb-1"
                                style={{ fontSize: "12px" }}
                              >
                                Assign this ticket to:
                              </div>
                            </Col>
                            <Col>
                              <div>
                                <select
                                  name="assignTo"
                                  className="form-control"
                                  defaultValue="Unassigned"
                                  onChange={(event) =>
                                    setData({
                                      ...data,
                                      assignTo: event.target.value,
                                    })
                                  }
                                >
                                  <option value="Unassigned">Unassigned</option>
                                  {list_user &&
                                    list_user.map((value, index) => (
                                      <option
                                        key={index}
                                        value={value.name}
                                        onChange={(event) =>
                                          setData({
                                            ...data,
                                            assignTo: event.target.value,
                                          })
                                        }
                                      >
                                        {value.name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </Col>
                          </Row>
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
  const { list_category } = state.Category;
  const { list_user } = state.User;
  const { loading, response_code_ticket, message_ticket } = state.Ticket;
  return {
    list_category,
    list_user,
    response_code_ticket,
    message_ticket,
    loading,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readCategory,
      createTicket,
      readUser,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(AddTicket);
