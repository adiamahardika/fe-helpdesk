import React from "react";
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
import { parseFullDate } from ".";

export class ComponentToPrint extends React.PureComponent {
  state = {
    detail_ticket: null,
    list_reply_ticket: null,
  };

  componentDidMount() {
    this.setState({
      detail_ticket: this.props.detail_ticket,
      list_reply_ticket: this.props.list_reply_ticket,
    });
  }

  StatusLabel = (value) => {
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
  PriorityLabel = (value) => {
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
  FileIcon = (value) => {
    const split = value && value.value.split(".");
    const file_name = value && value.value.split("/");
    let is_image = false;
    let color = null;
    let icon = null;
    let file_type = null;

    switch (split[split.length - 1]) {
      case "pdf":
        color = "#f1b44c";
        icon = "bx bxs-file-pdf";
        file_type = "data:application/pdf;base64,";
        is_image = false;
        break;
      case "doc":
        color = "#556ee6";
        icon = "bx bxs-file-doc";
        file_type = "data:application/msword;base64,";
        is_image = false;
        break;
      case "docx":
        color = "#556ee6";
        icon = "bx bxs-file-doc";
        file_type =
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,";
        is_image = false;
        break;
      case "xlsx":
        color = "#34c38f";
        icon = "bx bxs-file";
        file_type =
          "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
        is_image = false;
        break;
      case "xls":
        color = "#34c38f";
        icon = "bx bxs-file";
        file_type = "data:application/vnd.ms-excel;base64,";
        is_image = false;
        break;
      case "csv":
        color = "#34c38f";
        icon = "bx bxs-file";
        file_type = "data:application/vnd.ms-excel;base64,";
        is_image = false;
        break;
      case "rar":
        color = "#f46a6a";
        icon = "bx bxs-file-archive";
        file_type = "data:application/octet-stream;base64,";
        is_image = false;
        break;
      case "zip":
        color = "#f46a6a";
        icon = "bx bxs-file-archive";
        file_type = "data:application/zip;base64,";
        is_image = false;
        break;
      case "txt":
        color = "#556ee6";
        icon = "bx bxs-file-txt";
        file_type = "data:text/plain;base64,";
        is_image = false;
        break;
      case "jpeg":
        color = "#34c38f";
        icon = "bx bxs-file-image";
        file_type = "data:image/jpeg;base64,";
        is_image = true;
        break;
      case "jpg":
        color = "#34c38f";
        icon = "bx bxs-file-image";
        file_type = "data:image/jpeg;base64,";
        is_image = true;
        break;
      case "png":
        color = "#34c38f";
        icon = "bx bxs-file-image";
        file_type = "data:image/png;base64,";
        is_image = true;
        break;
      case "gif":
        color = "#34c38f";
        icon = "bx bxs-file-image";
        file_type = "data:image/gif;base64,";
        is_image = true;
        break;
      default:
        color = "#34c38f";
        icon = "bx bxs-file";
        file_type = "data:text/plain;base64,";
        is_image = false;
    }
    return (
      <a
        href={file_type + value.base64}
        download={file_name[file_name.length - 1]}
        className="flex-column ml-3"
        style={{ maxWidth: "125px" }}
      >
        {is_image ? (
          <img
            data-dz-thumbnail=""
            className="rounded bg-light"
            style={{
              width: "100%",
            }}
            alt={file_name[file_name.length - 1]}
            src={file_type + value.base64}
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
      </a>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Row>
              <Col md={3}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-2">
                      Ticket{" "}
                      {this.state.detail_ticket &&
                        this.state.detail_ticket.kodeTicket}
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
                            {this.state.detail_ticket &&
                              this.state.detail_ticket.usernamePembuat
                                .charAt(0)
                                .toUpperCase()}
                          </span>
                        </div>
                      </Col>
                      <Col>
                        <Row>
                          {this.state.detail_ticket &&
                            this.state.detail_ticket.usernamePembuat}
                        </Row>
                        <Row>
                          {this.state.detail_ticket &&
                            this.state.detail_ticket.email}
                        </Row>
                      </Col>
                    </Row>
                    <Row className="align-items-center mb-2">
                      <Col className="d-flex" style={{ flexFlow: "column" }}>
                        <strong>Location</strong>
                        {this.state.detail_ticket &&
                          this.state.detail_ticket.lokasi}
                      </Col>
                    </Row>
                    <Row className="align-items-center mb-2">
                      <Col className="d-flex" style={{ flexFlow: "column" }}>
                        <strong>Terminal Id</strong>
                        {this.state.detail_ticket &&
                          this.state.detail_ticket.terminalId}
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
                        {this.state.detail_ticket &&
                          parseFullDate(this.state.detail_ticket.tglDibuat)}
                      </Col>
                    </Row>
                    <Row className="align-items-center mb-2">
                      <Col className="d-flex" style={{ flexFlow: "column" }}>
                        <strong>Updated On</strong>
                        {this.state.detail_ticket &&
                          parseFullDate(this.state.detail_ticket.tglDiperbarui)}
                      </Col>
                    </Row>
                    <Row className="align-items-center mb-2">
                      <Col className="d-flex" style={{ flexFlow: "column" }}>
                        <strong>Time Worked</strong>
                        {this.state.detail_ticket &&
                          this.state.detail_ticket.totalWaktu}
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
                      <>
                        <Row className="align-items-center mb-2">
                          <Col
                            className="d-flex"
                            style={{ flexFlow: "column" }}
                          >
                            <strong>Category</strong>
                            {this.state.detail_ticket &&
                              this.state.detail_ticket.kategori}
                          </Col>
                        </Row>
                        <Row className="align-items-center mb-2">
                          <Col
                            className="d-flex"
                            style={{ flexFlow: "column" }}
                          >
                            <strong>Status</strong>
                            <this.StatusLabel
                              value={
                                this.state.detail_ticket &&
                                this.state.detail_ticket.status
                              }
                            />
                          </Col>
                        </Row>
                        <Row className="align-items-center mb-2">
                          <Col
                            className="d-flex"
                            style={{ flexFlow: "column" }}
                          >
                            <strong>Priority</strong>
                            <this.PriorityLabel
                              value={
                                this.state.detail_ticket &&
                                this.state.detail_ticket.prioritas
                              }
                            />
                          </Col>
                        </Row>
                        <Row className={`align-items-center`}>
                          <Col
                            className="d-flex"
                            style={{ flexFlow: "column" }}
                          >
                            <strong>Assign To</strong>
                            {this.state.detail_ticket &&
                              this.state.detail_ticket.assignedTo}
                          </Col>
                        </Row>
                      </>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={9}>
                <Card className="pr-2 pl-2">
                  {this.state.list_reply_ticket &&
                    this.state.list_reply_ticket.map((value, index) => (
                      <CardBody
                        key={index}
                        style={{
                          borderBottomColor: "#cfcfcf",
                          borderBottomStyle: `${
                            index === this.state.list_reply_ticket.length - 1
                              ? `none`
                              : `solid`
                          }`,
                          borderBottomWidth: "1px",
                          paddingBottom: "1rem",
                        }}
                      >
                        {index === 0 && (
                          <Row className="mb-5">
                            <Col>
                              <h4>
                                {this.state.detail_ticket &&
                                  this.state.detail_ticket.judul}
                              </h4>
                            </Col>
                          </Row>
                        )}

                        <Row>
                          <Col md={1}>
                            <div className="avatar-sm mx-auto mb-4">
                              <span
                                className={`avatar-title rounded-circle bg-soft-${
                                  value.usernamePengirim ===
                                  this.state.detail_ticket.usernamePembuat
                                    ? "primary"
                                    : "success"
                                }
                                     text-${
                                       value.usernamePengirim ===
                                       this.state.detail_ticket.usernamePembuat
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
                              </div>
                            </Row>
                            <strong>Message :</strong>
                            <Row>
                              <Col>{value.isi}</Col>
                            </Row>
                            <Row className="justify-content-end">
                              {value.urlAttachment1 !== "Not Found" && (
                                <this.FileIcon
                                  value={value.attachment1}
                                  base64={value.urlAttachment1}
                                />
                              )}
                              {value.urlAttachment2 !== "Not Found" && (
                                <this.FileIcon
                                  value={value.attachment2}
                                  base64={value.urlAttachment2}
                                />
                              )}
                            </Row>
                          </Col>
                        </Row>
                      </CardBody>
                    ))}
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}
