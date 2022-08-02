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
  Label,
} from "reactstrap";
import { readCategory } from "../../store/pages/category/actions";
import { readUser } from "../../store/pages/users/actions";
import { createTicket } from "../../store/pages/ticket/actions";
import { readArea } from "../../store/pages/area/actions";
import { readRegional } from "../../store/pages/regional/actions";
import { readGrapari } from "../../store/pages/grapari/actions";
import { readTerminal } from "../../store/pages/terminal/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import { uid } from "uid";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import general_constant from "../../helpers/general_constant.json";
import UnsavedChangesWarning from "../../helpers/unsaved_changes_warning";
import routes from "../../helpers/routes.json";
import Dropzone from "react-dropzone";
import CryptoJS from "crypto-js";
import Select from "react-select";
import Loader from "../../helpers/loader";
require("dotenv").config();

const AddTicket = (props) => {
  let message = props.message_ticket;
  let response_code = props.response_code_ticket;
  const option_category = props.option_category;
  const list_user = props.list_user;
  const option_area = props.option_area;
  const option_regional = props.option_regional;
  const option_grapari = props.option_grapari;
  const option_terminal = props.option_terminal;
  const list_terminal = props.list_terminal;
  const loading = props.loading;
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
  const email = sessionStorage.getItem("email");
  const history = useHistory();
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [data, setData] = useState(null);
  const [selectedFiles1, setSelectedFiles1] = useState(null);
  const [selectedFiles2, setSelectedFiles2] = useState(null);
  const [optionColor, setOptionColor] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [sendEmailCheck, setSendEmailCheck] = useState(true);
  const [showTicketCheck, setShowTicketCheck] = useState(true);
  const [modalFilter, setModalFilter] = useState(false);
  const [modalRequirements, setModalRequirements] = useState(false);
  const [ticketCode, setTicketCode] = useState(null);
  const [isAssigningTicket, setIsAssigningTicket] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedRegional, setSelectedRegional] = useState(null);
  const [requestRegional, setRequestRegional] = useState(null);
  const [selectedGrapari, setSelectedGrapari] = useState(null);
  const [requestGrapari, setRequestGrapari] = useState(null);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [requestTerminal, setRequestTerminal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showLainLain, setShowLainLain] = useState(false);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const handleAcceptedFiles = (files, number) => {
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
            setData({
              ...data,
              attachment1: files[0],
            });
          } else {
            setSelectedFiles2(files[0]);
            setData({
              ...data,
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

  const onChangeData = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    setDirty();
  };
  const onChangeSubCategory = async (event) => {
    if (event) {
      let parse = JSON.parse(event.target.value);
      let findIndex = general_constant.priority.findIndex(
        (value) => value.name === parse.priority
      );
      setOptionColor(general_constant.priority[findIndex].color);
      setData({
        ...data,
        subCategory: parse.name !== "Lain-lain" ? parse.name : "",
        prioritas: parse.priority,
      });
      setShowLainLain(parse.name === "Lain-lain" ? true : false);
    }
    setDirty();
  };
  const onChangeTerminal = (event) => {
    let index =
      list_terminal &&
      list_terminal.findIndex((value) => value.terminalId === event.value);
    let terminal = list_terminal && list_terminal[index];

    setSelectedTerminal(event);
    setData({
      ...data,
      areaCode: terminal.area,
      regional: terminal.regional,
      grapariId: terminal.grapariId,
      terminalId: event.value,
      lokasi: terminal.terminalName,
    });
  };

  const onSubmitCreate = async () => {
    const ticket_code = (uid(3) + "-" + uid(3) + "-" + uid(4)).toUpperCase();
    setTicketCode(ticket_code);
    const judul =
      selectedGrapari.label +
      " - " +
      selectedCategory.value.name +
      " - " +
      data.subCategory;
    const isi = `${data && data.isi}`;

    let request = new FormData();
    request.append("status", data.status);
    request.append("prioritas", data.prioritas);
    request.append("assignedTo", data.assignedTo);
    request.append("userPembuat", data.userPembuat);
    selectedFiles1 && request.append("attachment1", data.attachment1);
    selectedFiles2 && request.append("attachment2", data.attachment2);
    request.append("ticketCode", ticket_code);
    request.append("email", data.email);
    request.append("judul", judul);
    request.append("category", data.category);
    request.append("subCategory", data.subCategory);
    request.append("areaCode", data.areaCode);
    request.append("regional", data.regional);
    request.append("grapariId", data.grapariId);
    request.append("terminalId", data.terminalId);
    request.append("lokasi", data.lokasi);
    request.append("isi", isi);
    request.append("emailNotification", data.emailNotification);

    props.createTicket(request);
    setIsShowSweetAlert(setTimeout(true, 1500));
    setPristine();
  };
  const ButtonSubmitCreate = () => {
    if (data && Object.keys(data).length >= 17) {
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
      if (
        !loading &&
        response_code === general_constant.success_response_code
      ) {
        value = (
          <SweetAlert
            title={general_constant.success_message}
            success
            confirmBtnBsStyle="success"
            onConfirm={() => {
              setIsShowSweetAlert(false);
              setData(null);
              if (showTicketCheck) {
                history.push(routes.detail_ticket + `?ticketId=${ticketCode}`);
              } else {
                history.push(routes.ticket);
              }
            }}
          >
            Ticket has successfully created!
          </SweetAlert>
        );
      } else if (!loading) {
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
    let submitNewTicket = permissions.find(
      (value) => value.code === code_all_permissions.submit_new_ticket
    );
    let assigningTicket = permissions.find(
      (value) => value.code === code_all_permissions.assigning_ticket
    );
    if (submitNewTicket) {
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

      let reqTerminal = {
        terminalId: [],
        areaCode: area_code && area_code[0] !== "0" ? area_code : [],
        regional: regional && regional[0] !== "0" ? regional : [],
        grapariId: grapari_id && grapari_id[0] !== "0" ? grapari_id : [],
        status: "A",
      };
      props.readTerminal(reqTerminal);
      setRequestTerminal(reqTerminal);

      props.readCategory({
        size: 0,
        page_no: 0,
        sort_by: "name",
        order_by: "asc",
      });
      let role_id = general_constant.role_id;
      props.readUser({
        size: 0,
        pageNo: 0,
        search: "",
        role: [role_id.teknisi, role_id.team_lead],
      });
      setData({
        status: "New",
        prioritas: "Low",
        assignedTo: "Unassigned",
        userPembuat: username,
        userPengirim: username,
        email: email,
        attachment1: null,
        attachment2: null,
        emailNotification: "true",
      });
      setOptionColor("#34c38f");

      assigningTicket && setIsAssigningTicket(true);
    } else {
      history.push(routes.ticket);
    }
  }, []);

  return (
    <React.Fragment>
      {loading && <Loader />}
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
                      {area_code && (
                        <Col md={5}>
                          <FormGroup className="select2-container">
                            <Label>
                              Area <span style={{ color: "red" }}>*</span>
                            </Label>
                            <Select
                              value={selectedArea}
                              onChange={(event) => {
                                setSelectedArea(event);
                                setSelectedRegional(null);
                                setSelectedGrapari(null);
                                setSelectedTerminal(null);
                                props.readRegional({
                                  ...requestRegional,
                                  areaCode: [event.value],
                                });
                                props.readGrapari({
                                  ...requestGrapari,
                                  areaCode: [event.value],
                                });
                                props.readTerminal({
                                  ...requestTerminal,
                                  areaCode: [event.value],
                                });
                                delete data.areaCode;
                                delete data.regional;
                                delete data.grapariId;
                                delete data.terminalId;
                                delete data.lokasi;
                              }}
                              options={option_area}
                              classNamePrefix="select2-selection"
                            />
                          </FormGroup>
                        </Col>
                      )}
                      {regional && (
                        <Col md={5}>
                          <FormGroup className="select2-container">
                            <Label>
                              Regional <span style={{ color: "red" }}>*</span>
                            </Label>
                            <Select
                              value={selectedRegional}
                              onChange={(event) => {
                                setSelectedRegional(event);
                                setSelectedGrapari(null);
                                setSelectedTerminal(null);
                                props.readGrapari({
                                  ...requestGrapari,
                                  regional: [event.value],
                                });
                                props.readTerminal({
                                  ...requestTerminal,
                                  regional: [event.value],
                                });
                                delete data.regional;
                                delete data.grapariId;
                                delete data.terminalId;
                                delete data.lokasi;
                              }}
                              options={option_regional}
                              classNamePrefix="select2-selection"
                            />
                          </FormGroup>
                        </Col>
                      )}
                    </Row>
                    <Row>
                      {grapari_id && (
                        <Col md={5}>
                          <FormGroup className="select2-container">
                            <Label>
                              Grapari <span style={{ color: "red" }}>*</span>
                            </Label>
                            <Select
                              value={selectedGrapari}
                              onChange={(event) => {
                                setSelectedGrapari(event);
                                setSelectedTerminal(null);
                                props.readTerminal({
                                  ...requestTerminal,
                                  grapariId: [event.value],
                                });
                                delete data.grapariId;
                                delete data.terminalId;
                                delete data.lokasi;
                              }}
                              options={option_grapari}
                              classNamePrefix="select2-selection"
                            />
                          </FormGroup>
                        </Col>
                      )}
                      <Col md={5}>
                        <FormGroup className="select2-container">
                          <Label>
                            Terminal <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Select
                            value={selectedTerminal}
                            onChange={(event) => {
                              onChangeTerminal(event);
                            }}
                            options={option_terminal}
                            classNamePrefix="select2-selection"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        <FormGroup className="select2-container">
                          <Label>
                            Category <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Row className="mb-2">
                            <Col md={5}>
                              <Select
                                value={selectedCategory}
                                onChange={(event) => (
                                  setSelectedCategory(event),
                                  setData({
                                    ...data,
                                    category: event.value.id.toString(),
                                    subCategory: "",
                                    prioritas: "",
                                  }),
                                  setShowLainLain(true),
                                  setDirty()
                                )}
                                options={option_category}
                                classNamePrefix="select2-selection"
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={8}>
                        <FormGroup className="select2-container">
                          <label className="control-label">
                            Sub Category <span style={{ color: "red" }}>*</span>
                          </label>
                          <Row className="mb-2">
                            <Col>
                              <div>
                                <select
                                  name="category"
                                  className="form-control"
                                  defaultValue="0"
                                  onChange={(event) => {
                                    onChangeSubCategory(event);
                                  }}
                                >
                                  <option value="0" disabled>
                                    Select Sub Category
                                  </option>
                                  <option
                                    value={JSON.stringify({
                                      name: "Lain-lain",
                                      priority: "Low",
                                    })}
                                  >
                                    Lain-lain
                                  </option>
                                  {selectedCategory &&
                                    selectedCategory.value.subCategory[0].id !==
                                      0 &&
                                    selectedCategory.value.subCategory.map(
                                      (value, index) => (
                                        <option
                                          key={index}
                                          value={value && JSON.stringify(value)}
                                        >
                                          {value.name}
                                        </option>
                                      )
                                    )}
                                </select>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              {showLainLain && (
                                <FormGroup className="select2-container mt-2">
                                  <AvField
                                    name="subCategory"
                                    label=""
                                    placeholder="ex: Mati total"
                                    type="text"
                                    errorMessage="Description must be filled!"
                                    validate={{
                                      required: { value: true },
                                      maxLength: { value: 100 },
                                    }}
                                    onChange={(event) => {
                                      setData({
                                        ...data,
                                        subCategory: event.target.value,
                                        priority: "Low",
                                      });
                                    }}
                                  />
                                </FormGroup>
                              )}
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                      {/* {data && data.subCategory && (
                        <Col md={2} className="">
                          <FormGroup className="select2-container">
                            <label className="control-label">Priority</label>
                            <FormGroup className="select2-container">
                              <AvField
                                name="priority"
                                label=""
                                value={data && data.priority}
                                type="text"
                                style={{
                                  color: optionColor,
                                  border: "none",
                                }}
                                className="p-0 font-weight-bold"
                                disabled
                              />
                            </FormGroup>
                          </FormGroup>
                        </Col>
                      )} */}
                    </Row>
                    <Row className="mt-3">
                      <Col>
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
                                            delete data.attachment1;
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
                                            delete data.attachment2;
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
                    {isAssigningTicket && (
                      <>
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
                                  checked={sendEmailCheck}
                                />
                                <label
                                  className="custom-control-label"
                                  onClick={() => {
                                    setSendEmailCheck(!sendEmailCheck);
                                    setData({
                                      ...data,
                                      emailNotification:
                                        (!sendEmailCheck).toString(),
                                    });
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
                                  checked={showTicketCheck}
                                />
                                <label
                                  className="custom-control-label"
                                  onClick={() => {
                                    setShowTicketCheck(!showTicketCheck);
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
                                      name="assignedTo"
                                      className="form-control"
                                      defaultValue="Unassigned"
                                      onChange={(event) =>
                                        setData({
                                          ...data,
                                          assignedTo: event.target.value,
                                        })
                                      }
                                    >
                                      <option value="Unassigned">
                                        Unassigned
                                      </option>
                                      {list_user &&
                                        list_user.map((value, index) => (
                                          <option
                                            key={index}
                                            value={value.username}
                                            onChange={(event) =>
                                              setData({
                                                ...data,
                                                assignedTo: event.target.value,
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
              2. Maximum size per attachment: <strong>1 MB</strong>
              <br />
              3. You may upload files ending with: <br />
              <strong>
                .gif, .jpg, .png, .zip, .rar, .csv, .doc, .docx, .xls, .xlsx,
                .txt, .pdf, .mp4, .mkv
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
  const { option_category } = state.Category;
  const { list_user } = state.User;
  const { option_area } = state.Area;
  const { option_regional } = state.Regional;
  const { option_grapari } = state.Grapari;
  const { option_terminal, list_terminal } = state.Terminal;
  const { loading, response_code_ticket, message_ticket } = state.Ticket;

  return {
    option_category,
    list_user,
    list_terminal,
    option_area,
    option_regional,
    option_grapari,
    option_terminal,
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
      readArea,
      readRegional,
      readGrapari,
      readTerminal,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(AddTicket);
