import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, FormGroup, Row, Col } from "reactstrap";
import { readCategory } from "../../store/pages/category/actions";
import { readSubCategory } from "../../store/pages/subCategory/actions";
import { readUser } from "../../store/pages/users/actions";
import {
  updateTicket,
  readDetailTicket,
} from "../../store/pages/ticket/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { emailValidation } from "../../helpers";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import general_constant from "../../helpers/general_constant.json";
import UnsavedChangesWarning from "../../helpers/unsaved_changes_warning";
import routes from "../../helpers/routes.json";
import queryString from "query-string";
import CryptoJS from "crypto-js";
require("dotenv").config();

const EditTicket = (props) => {
  let message = props.message_ticket;
  let response_code = props.response_code_ticket;
  const detail_ticket = props.detail_ticket;
  const list_category = props.list_category;
  const list_user = props.list_user;
  const list_sub_category = props.list_sub_category;

  const loading = props.loading;
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

  const [data, setData] = useState(null);
  const [optionColor, setOptionColor] = useState(null);
  const [statusColor, setStatusColor] = useState(null);
  const [validEmail, setValidEmail] = useState(true);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showLainLain, setShowLainLain] = useState(false);

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
  const onValidateEmail = (email) => {
    setData({
      ...data,
      email: email,
    });
    setValidEmail(emailValidation(email));
    setDirty();
  };
  const onChangeStatus = async (value) => {
    if (value) {
      let findIndexStatus = general_constant.status.findIndex(
        (item) => item.name === value
      );
      setStatusColor(general_constant.status[findIndexStatus].color);
      setData({
        ...data,
        status: value,
      });
    }
    setDirty();
  };

  const onSubmitUpdate = async () => {
    props.updateTicket(data);
    setIsShowSweetAlert(setTimeout(true, 1500));
    setPristine();
  };
  const ButtonSubmitUpdate = () => {
    if (
      data &&
      Object.keys(data).length >= 8 &&
      Object.values(data).every((value) => value !== "") &&
      validEmail
    ) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          onClick={() => {
            onSubmitUpdate();
          }}
        >
          <i className="bx bx bx-save font-size-16 align-middle mr-2"></i>
          Save
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
          <i className="bx bx bx-save font-size-16 align-middle mr-2"></i>
          Save
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
              history.push(routes.detail_ticket + `?ticketId=${ticketId}`);
            }}
          >
            Ticket has successfully edited!
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
    let editTicket = permissions.find(
      (value) => value.code === code_all_permissions.edit_ticket
    );

    if (editTicket) {
      props.readCategory({
        size: 0,
        page_no: 0,
        sort_by: "name",
        order_by: "asc",
      });
      props.readUser({ size: 0, page_no: 0, search: "*" });
      props.readDetailTicket(ticketId);
      props.readSubCategory();

      setOptionColor("#34c38f");
    } else {
      history.push(routes.ticket);
    }
  }, []);
  useEffect(() => {
    if (detail_ticket === null) {
      props.readDetailTicket(ticketId);
    } else {
      let findSubCategory =
        list_sub_category &&
        list_sub_category.findIndex(
          (value) =>
            value.name === detail_ticket.subCategory &&
            value.idCategory === parseInt(detail_ticket.category)
        );
      let findCategory =
        list_category &&
        list_category.findIndex(
          (value) => value.id === parseInt(detail_ticket.category)
        );
      let findPriority = general_constant.priority.findIndex(
        (value) => value.name === detail_ticket.prioritas
      );
      let findStatus = general_constant.status.findIndex(
        (value) => value.name === detail_ticket.status
      );

      setData({
        prioritas: detail_ticket.prioritas,
        status: detail_ticket.status,
        ticketCode: ticketId,
        category: detail_ticket.category,
        subCategory: detail_ticket.subCategory,
        email: detail_ticket.email,
        assignedTo: detail_ticket.assignedTo,
        usernamePembalas: detail_ticket.usernamePembalas,
      });
      findStatus > 0 &&
        setStatusColor(general_constant.status[findStatus].color);
      findPriority > 0 &&
        setOptionColor(general_constant.priority[findPriority].color);
      findCategory > 0 && setSelectedCategory(list_category[findCategory]);
      findSubCategory < 0 && setShowLainLain(true);
    }
  }, [detail_ticket, list_sub_category, list_category]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Ticket"} breadcrumbItem={"Edit Ticket"} />
          <Card>
            <CardBody>
              <AvForm>
                <Row className="justify-content-center">
                  <Col md={8}>
                    <Row>
                      <Col md={8}>
                        <FormGroup className="select2-container">
                          <label className="control-label">Email</label>
                          <AvField
                            name="email"
                            label=""
                            placeholder="ex: shop@mail.com"
                            type="email"
                            errorMessage="Enter valid Email"
                            validate={{
                              required: { value: true },
                              maxLength: { value: 70 },
                            }}
                            value={data && data.email}
                            onChange={(event) =>
                              onValidateEmail(event.target.value)
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <FormGroup className="select2-container">
                          <label className="control-label">Status</label>
                          <div>
                            <select
                              name="category"
                              className="form-control"
                              onChange={(event) =>
                                onChangeStatus(event.target.value)
                              }
                              style={{
                                color: statusColor,
                                fontWeight: "bold",
                              }}
                            >
                              {general_constant.status.map((value, index) => (
                                <option
                                  key={index}
                                  value={value && value.name}
                                  onChange={(event) =>
                                    onChangeStatus(event.target.value)
                                  }
                                  style={{
                                    color: value.color,
                                    fontWeight: "bold",
                                  }}
                                  selected={data && data.status === value.name}
                                >
                                  {value.name}
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
                          <label className="control-label">Category</label>
                          <Row className="mb-2">
                            <Col md={5}>
                              <div>
                                <select
                                  name="category"
                                  className="form-control"
                                  defaultValue={data && data.category}
                                  onChange={(event) => (
                                    setData({
                                      ...data,
                                      category: JSON.parse(
                                        event.target.value
                                      ).id.toString(),
                                      subCategory: "",
                                      prioritas: "",
                                    }),
                                    setShowLainLain(true),
                                    setSelectedCategory(
                                      JSON.parse(event.target.value)
                                    ),
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
                                        value={value && JSON.stringify(value)}
                                        selected={
                                          data &&
                                          data.category === value.id.toString()
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
                    <Row>
                      <Col md={8}>
                        <FormGroup className="select2-container">
                          <label className="control-label">Sub Category</label>
                          <Row className="mb-2">
                            <Col>
                              <div>
                                <select
                                  name="category"
                                  className="form-control"
                                  defaultValue={
                                    data &&
                                    JSON.stringify({
                                      name: data.subCategory,
                                      priority: data.prioritas,
                                    })
                                  }
                                  onChange={(event) => {
                                    onChangeSubCategory(event);
                                  }}
                                >
                                  <option
                                    value={JSON.stringify({
                                      name: "Lain-lain",
                                      priority: "Low",
                                    })}
                                  >
                                    Lain-lain
                                  </option>
                                  {selectedCategory &&
                                    selectedCategory.subCategory[0].id !== 0 &&
                                    selectedCategory.subCategory.map(
                                      (value, index) => (
                                        <option
                                          key={index}
                                          value={value && JSON.stringify(value)}
                                          selected={
                                            data &&
                                            data.subCategory === value.name
                                          }
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
                                    value={data && data.subCategory}
                                    onChange={(event) => {
                                      setData({
                                        ...data,
                                        subCategory: event.target.value,
                                        prioritas: "Low",
                                      });
                                      setOptionColor("#34c38f");
                                    }}
                                  />
                                </FormGroup>
                              )}
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                      {data && data.subCategory && (
                        <Col md={2} className="">
                          <FormGroup className="select2-container">
                            <label className="control-label">Priority</label>
                            <FormGroup className="select2-container">
                              <AvField
                                name="priority"
                                label=""
                                value={data && data.prioritas}
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
                      )}
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup className="select2-container">
                          <label className="control-label">Assign To</label>
                          <Row className="align-items-center">
                            <Col>
                              <div>
                                <select
                                  name="assignedTo"
                                  className="form-control"
                                  defaultValue={data && data.assignedTo}
                                  onChange={(event) =>
                                    setData({
                                      ...data,
                                      assignedTo: event.target.value,
                                    })
                                  }
                                >
                                  <option value="Unassigned">Unassigned</option>
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
                                        selected={
                                          data &&
                                          data.assignedTo === value.username
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
                <ButtonSubmitUpdate />
              </div>
            </CardBody>
          </Card>
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
  const { loading, response_code_ticket, message_ticket, detail_ticket } =
    state.Ticket;
  const { captcha_id, image_captcha } = state.Captcha;
  const { list_sub_category } = state.SubCategory;
  return {
    list_category,
    list_user,
    list_sub_category,
    detail_ticket,
    response_code_ticket,
    message_ticket,
    loading,
    captcha_id,
    image_captcha,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readCategory,
      updateTicket,
      readUser,
      readDetailTicket,
      readSubCategory,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(EditTicket);
