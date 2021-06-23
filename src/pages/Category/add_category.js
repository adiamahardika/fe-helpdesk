import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, FormGroup, Row, Col } from "reactstrap";
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

const AddCategory = (props) => {
  const message = props.message_category;
  const response_code = props.response_code_category;
  const loading = props.loading;
  const list_category = props.list_category;
  const permissions = JSON.parse(localStorage.getItem("permission"));
  const history = useHistory();
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [data, setData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);

  const onChangeData = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    setDirty();
  };

  const onSubmitCreate = async () => {
    props.createCategory(data);
    setIsShowSweetAlert(true);
    setPristine();
  };
  const ButtonSubmitCreate = () => {
    if (
      data &&
      Object.keys(data).length >= 2 &&
      Object.values(data).every((value) => value !== "")
    ) {
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
    props.readCategory({
      size: 0,
      page_no: 0,
      sort_by: "codeLevel",
      order_by: "asc",
    });
    setData({ parent: "0" });
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
                <Col md={6}>
                  <AvForm>
                    <Row>
                      <Col md={6}>
                        <AvField
                          name="nama"
                          label="Name"
                          placeholder="ex: Software"
                          type="text"
                          errorMessage="Enter Name"
                          validate={{
                            required: { value: true },
                            maxLength: { value: 25 },
                          }}
                          onChange={onChangeData}
                        />
                      </Col>
                      <Col md={6}>
                        <FormGroup className="select2-container">
                          <label className="control-label">Parent</label>
                          <div>
                            <select
                              name="parent"
                              className="form-control"
                              defaultValue="0"
                              onChange={(event) => (
                                setData({
                                  ...data,
                                  parent: event.target.value,
                                }),
                                setDirty()
                              )}
                            >
                              <option
                                value="0"
                                onChange={(event) => (
                                  setData({
                                    ...data,
                                    parent: event.target.value,
                                  }),
                                  setDirty()
                                )}
                              >
                                Main
                              </option>
                              {list_category &&
                                list_category.map((value, index) => (
                                  <option
                                    key={index}
                                    value={value && value.codeLevel}
                                    onChange={(event) => (
                                      setData({
                                        ...data,
                                        parent: event.target.value,
                                      }),
                                      setDirty()
                                    )}
                                  >
                                    {value.codeLevel} | {value.nama}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </FormGroup>
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
