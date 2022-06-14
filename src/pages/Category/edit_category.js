import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  FormGroup,
  Row,
  Col,
  Modal,
} from "reactstrap";
import {
  readCategory,
  readDetailCategory,
  updateCategory,
  deleteCategory,
} from "../../store/pages/category/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import SweetAlert from "react-bootstrap-sweetalert";
import general_constant from "../../helpers/general_constant.json";
import UnsavedChangesWarning from "../../helpers/unsaved_changes_warning";
import routes from "../../helpers/routes.json";
import queryString from "query-string";
import CryptoJS from "crypto-js";
require("dotenv").config();

const EditCategory = (props) => {
  const message = props.message_category;
  const response_code = props.response_code_category;
  const detail_category = props.detail_category;
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      sessionStorage.getItem("permission"),
      `${process.env.ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );
  const history = useHistory();
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();
  const { search } = useLocation();
  const { id } = queryString.parse(search);

  const [data, setData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isEditCategory, setIsEditCategory] = useState(false);
  const [isDeleteCategory, setIsDeleteCategory] = useState(false);

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  };

  const onChangeData = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    setDirty();
  };

  const onSubmit = async () => {
    delete data.updateAt;
    props.updateCategory(data);
    setIsShowSweetAlert(true);
    setAlertMessage("edited");
    setPristine();
  };
  const ButtonSubmit = () => {
    if (
      data &&
      Object.keys(data).length >= 5 &&
      Object.values(data).every((value) => value !== "") &&
      isEdit
    ) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light d-flex align-items-center"
          onClick={() => {
            onSubmit();
          }}
        >
          <i className="bx bx-save font-size-16 align-middle mr-2"></i>
          Save
        </button>
      );
    } else if (isEdit) {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light d-flex align-items-center"
          disabled
          style={{ cursor: "default" }}
        >
          <i className="bx bx-save font-size-16 align-middle mr-2"></i>
          Save
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light d-flex align-items-center"
          onClick={() => {
            setIsEdit(true);
            setData(detail_category);
          }}
        >
          <i className="bx bx-edit font-size-16 align-middle mr-2"></i>
          Edit
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
            Category has successfully {alertMessage}!
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
    let viewCategory = permissions.find(
      (value) => value.code === code_all_permissions.view_category
    );
    let editCategory = permissions.find(
      (value) => value.code === code_all_permissions.edit_category
    );
    let deleteCategory = permissions.find(
      (value) => value.code === code_all_permissions.delete_category
    );
    if (viewCategory) {
      props.readCategory({
        size: 0,
        page_no: 0,
        sort_by: "codeLevel",
        order_by: "asc",
      });
      props.readDetailCategory(id);

      editCategory && setIsEditCategory(true);
      deleteCategory && setIsDeleteCategory(true);
    } else {
      history.push(routes.ticket);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Category"} breadcrumbItem={"Detail Category"} />
          <Card>
            <CardBody>
              <div
                className="col-md-12 mb-3"
                style={{
                  display: "grid",
                  justifyItems: "flex-end",
                  gridTemplateColumns: "1fr max-content",
                  columnGap: "8px",
                }}
              >
                {isEdit ? (
                  <button
                    type="button"
                    className="btn btn-outline-primary waves-effect waves-light d-flex align-items-center"
                    style={{ minWidth: "max-content" }}
                    onClick={() => {
                      setIsEdit(false);
                    }}
                  >
                    <i className="bx bx-x font-size-16 align-middle mr-2"></i>
                    Cancel
                  </button>
                ) : (
                  isDeleteCategory && (
                    <button
                      type="button"
                      className="btn btn-danger waves-effect waves-light d-flex align-items-center"
                      style={{ minWidth: "max-content" }}
                      onClick={() => {
                        setSelectedData(detail_category.id);
                        setModalDelete(!modalDelete);
                      }}
                    >
                      <i className="bx bx-trash font-size-16 align-middle mr-2"></i>
                      Delete
                    </button>
                  )
                )}
                {isEditCategory && <ButtonSubmit />}
              </div>
              <Row className="justify-content-center">
                <Col md={10}>
                  <AvForm>
                    {" "}
                    <Row>
                      <Col md={4}>
                        <AvField
                          name="name"
                          label="Name"
                          placeholder="ex: Admin"
                          type="text"
                          errorMessage="Enter Name"
                          validate={{
                            required: { value: true },
                            maxLength: { value: 25 },
                          }}
                          value={detail_category && detail_category.name}
                          style={{
                            backgroundColor:
                              isEdit === false ? "#ced4da" : "#ffffff",
                          }}
                          disabled={isEdit === false}
                          onChange={onChangeData}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup className="select2-container">
                          <Row>
                            <Col md={5}>
                              <AvField
                                name="additionalInput1"
                                label="Additional Question 1"
                                type="text"
                                validate={{
                                  maxLength: { value: 50 },
                                }}
                                value={
                                  detail_category &&
                                  detail_category.additionalInput1
                                }
                                style={{
                                  backgroundColor:
                                    isEdit === false ? "#ced4da" : "#ffffff",
                                }}
                                disabled={isEdit === false}
                                onChange={(event) =>
                                  setData({
                                    ...data,
                                    additionalInput1:
                                      event.target.value === ""
                                        ? "-"
                                        : event.target.value,
                                  })
                                }
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md={5}>
                              <AvField
                                name="additionalInput2"
                                label="Additional Question 2"
                                type="text"
                                validate={{
                                  maxLength: { value: 50 },
                                }}
                                value={
                                  detail_category &&
                                  detail_category.additionalInput2
                                }
                                style={{
                                  backgroundColor:
                                    isEdit === false ? "#ced4da" : "#ffffff",
                                }}
                                disabled={isEdit === false}
                                onChange={(event) =>
                                  setData({
                                    ...data,
                                    additionalInput2:
                                      event.target.value === ""
                                        ? "-"
                                        : event.target.value,
                                  })
                                }
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col md={5}>
                              <AvField
                                name="additionalInput3"
                                label="Additional Question 3"
                                type="text"
                                validate={{
                                  maxLength: { value: 50 },
                                }}
                                value={
                                  detail_category &&
                                  detail_category.additionalInput3
                                }
                                style={{
                                  backgroundColor:
                                    isEdit === false ? "#ced4da" : "#ffffff",
                                }}
                                disabled={isEdit === false}
                                onChange={(event) =>
                                  setData({
                                    ...data,
                                    additionalInput3:
                                      event.target.value === ""
                                        ? "-"
                                        : event.target.value,
                                  })
                                }
                              />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  </AvForm>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* Modal Delete */}
          <Modal
            isOpen={modalDelete}
            toggle={() => {
              setModalDelete(!modalDelete);
              removeBodyCss();
              setSelectedData(null);
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0" id="myModalLabel">
                Delete Category
              </h5>
              <button
                type="button"
                onClick={() => {
                  setModalDelete(false);
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
              Are you sure want to delete this category?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => {
                  setModalDelete(!modalDelete);
                  removeBodyCss();
                  setSelectedData(null);
                }}
                className="btn btn-secondary waves-effect"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger waves-effect waves-light"
                onClick={() => {
                  setIsShowSweetAlert(true);
                  props.deleteCategory({
                    size: 0,
                    page_no: 0,
                    sort_by: "name",
                    order_by: "asc",
                    id: selectedData,
                  });
                  setModalDelete(!modalDelete);
                  setAlertMessage("deleted");
                  removeBodyCss();
                }}
              >
                Delete
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
    message_category,
    loading,
    response_code_category,
    list_category,
    detail_category,
    parent_1,
    parent_2,
    parent_3,
  } = state.Category;
  return {
    list_category,
    detail_category,
    parent_1,
    parent_2,
    parent_3,
    response_code_category,
    message_category,
    loading,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readCategory,
      updateCategory,
      deleteCategory,
      readDetailCategory,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(EditCategory);
