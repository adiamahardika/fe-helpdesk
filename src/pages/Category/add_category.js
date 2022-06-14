import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  FormGroup,
  Row,
  Col,
  Label,
} from "reactstrap";
import {
  readCategory,
  createCategory,
} from "../../store/pages/category/actions";
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
import CryptoJS from "crypto-js";
require("dotenv").config();

const AddCategory = (props) => {
  const message = props.message_category;
  const response_code = props.response_code_category;
  const list_category = props.list_category;
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      sessionStorage.getItem("permission"),
      `${process.env.ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );
  const history = useHistory();
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [data, setData] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [subCategoryLength, setSubCategoryLength] = useState(1);
  const [allSubCategoryFilled, setAllSubCategoryFiller] = useState(false);

  const onChangeData = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    setDirty();
  };
  const onChangeSubCategory = (event, index) => {
    let sub_category = subCategory;
    sub_category[index].name = event.target.value;
    setSubCategory(sub_category);
    setAllSubCategoryFiller(subCategory.every((value) => value.name !== ""));
  };
  const onChangePriority = (value, index) => {
    let sub_category = subCategory;
    sub_category[index].priority = value;
    setSubCategory(sub_category);
    setDirty();
  };

  const onSubmitCreate = async () => {
    props.createCategory({ ...data, subCategory: subCategory });
    console.log({ ...data, subCategory: subCategory });
    setIsShowSweetAlert(true);
    setPristine();
  };
  const ButtonSubmitCreate = () => {
    if (data && data.name !== "" && allSubCategoryFilled) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          onClick={() => {
            onSubmitCreate();
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
      if (response_code === general_constant.success_response_code) {
        value = (
          <SweetAlert
            title={general_constant.success_message}
            success
            confirmBtnBsStyle="success"
            onConfirm={() => {
              setIsShowSweetAlert(false);
              setData(null);
              history.push(routes.category);
            }}
          >
            Category has successfully created!
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
    let addCategory = permissions.find(
      (value) => value.code === code_all_permissions.add_category
    );
    if (addCategory) {
      props.readCategory({
        size: 0,
        page_no: 0,
        sort_by: "name",
        order_by: "asc",
      });
      setSubCategory([
        {
          name: "",
          priority: "Low",
        },
      ]);
    } else {
      history.push(routes.ticket);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Category"} breadcrumbItem={"Add Category"} />
          <Card>
            <CardBody>
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
              <Row className="justify-content-center">
                <Col md={10}>
                  <AvForm>
                    <Row>
                      <Col md={4}>
                        <AvField
                          name="name"
                          label="Name"
                          placeholder="ex: Software"
                          type="text"
                          errorMessage="Enter Name"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={onChangeData}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Label className="col-form-label">Sub Category</Label>
                      </Col>
                      <Col md={3}>
                        <Label className="col-form-label">Priority</Label>
                      </Col>
                    </Row>
                    {subCategory &&
                      subCategory.map((value, index) => (
                        <Row className="d-flex align-items-start" key={index}>
                          <Col md={4}>
                            <AvField
                              name="-"
                              placeholder=""
                              type="text"
                              errorMessage="Enter Sub Category"
                              validate={{
                                required: { value: true },
                              }}
                              value={value.name}
                              onChange={(event) =>
                                onChangeSubCategory(event, index)
                              }
                            />
                          </Col>
                          <Col md={3}>
                            <FormGroup className="select2-container">
                              <div>
                                <select
                                  name="priority"
                                  className="form-control"
                                  defaultValue={
                                    subCategory &&
                                    subCategory[index].priority === value.name
                                  }
                                  style={{
                                    fontWeight: "bold",
                                  }}
                                  onChange={(event) => {
                                    onChangePriority(event.target.value, index);
                                  }}
                                >
                                  {general_constant.priority.map((value) => (
                                    <option
                                      key={value.name}
                                      value={value.name}
                                      style={{
                                        color: value.color,
                                        fontWeight: "bold",
                                      }}
                                      selected={
                                        subCategory &&
                                        subCategory[index].priority ===
                                          value.name
                                      }
                                    >
                                      {value.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </FormGroup>
                          </Col>{" "}
                          {subCategoryLength > 1 && (
                            <Col md={1}>
                              <FormGroup className="select2-container">
                                <button
                                  type="button"
                                  className="btn btn-danger waves-effect waves-light"
                                  style={{ minWidth: "max-content" }}
                                  onClick={() => {
                                    let sub_category = subCategory;
                                    sub_category.splice(index, 1);
                                    setSubCategory(sub_category);
                                    setSubCategoryLength(subCategoryLength - 1);
                                    setAllSubCategoryFiller(
                                      subCategory.every(
                                        (value) => value.name !== ""
                                      )
                                    );
                                  }}
                                >
                                  <i className="bx bx-trash font-size-16 align-middle"></i>
                                </button>
                              </FormGroup>
                            </Col>
                          )}
                        </Row>
                      ))}
                    <Row>
                      <Col md={4}>
                        <button
                          type="button"
                          className="btn btn-outline-primary waves-effect waves-light w-100 d-flex justify-content-center align-items-center"
                          onClick={() => {
                            let sub_category = subCategory;
                            sub_category.push({
                              name: "",
                              priority: "Low",
                            });
                            setSubCategory(sub_category);
                            setSubCategoryLength(subCategoryLength + 1);
                            setAllSubCategoryFiller(false);
                          }}
                        >
                          <i className="bx bxs-plus-square font-size-16 align-middle mr-1"></i>
                          Add
                        </button>
                      </Col>
                    </Row>
                  </AvForm>
                </Col>
              </Row>
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
  const { message_category, loading, response_code_category, list_category } =
    state.Category;
  return {
    list_category,
    response_code_category,
    message_category,
    loading,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readCategory,
      createCategory,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(AddCategory);
