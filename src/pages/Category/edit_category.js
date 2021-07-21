import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, FormGroup, Row, Col } from "reactstrap";
import {
  readCategory,
  readDetailCategory,
  updateCategory,
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

const EditCategory = (props) => {
  const message = props.message_category;
  const response_code = props.response_code_category;
  const list_category = props.list_category;
  const detail_category = props.detail_category;
  const parent_1 = props.parent_1;
  const parent_2 = props.parent_2;
  const parent_3 = props.parent_3;
  const permissions = JSON.parse(sessionStorage.getItem("permission"));
  const history = useHistory();
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();
  const { search } = useLocation();
  const { code } = queryString.parse(search);

  const [data, setData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [mainValue, setMainValue] = useState(null);
  const [subLevel1Value, setSubLevel1Value] = useState(null);
  const [showSubLevel1, setShowSubLevel1] = useState(true);
  const [showSubLevel2, setShowSubLevel2] = useState(true);

  const onChangeData = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    setDirty();
  };

  const onSubmitCreate = async () => {
    delete data.updateAt;
    props.updateCategory(data);
    setIsShowSweetAlert(true);
    setPristine();
  };
  const ButtonSubmitCreate = () => {
    if (
      data &&
      Object.keys(data).length >= 3 &&
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
            Category has successfully edited!
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
    props.readDetailCategory(code);
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Category"} breadcrumbItem={"Edit Category"} />
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
                    {" "}
                    <Row>
                      <Col md={4}>
                        <AvField
                          name="nama"
                          label="Name"
                          placeholder="ex: Admin"
                          type="text"
                          errorMessage="Enter Name"
                          validate={{
                            required: { value: true },
                            maxLength: { value: 25 },
                          }}
                          value={detail_category && detail_category.nama}
                          onChange={onChangeData}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup className="select2-container">
                          <label className="control-label">Parent</label>
                          <Row className="mb-2">
                            <Col md={4}>
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
                                    setMainValue(event.target.value),
                                    event.target.value !== "0"
                                      ? setShowSubLevel1(true)
                                      : setShowSubLevel1(false),
                                    setShowSubLevel2(false),
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
                                      setShowSubLevel1(false),
                                      setShowSubLevel2(false),
                                      setDirty()
                                    )}
                                    selected={
                                      detail_category &&
                                      detail_category.parent === "0"
                                    }
                                  >
                                    Main
                                  </option>
                                  {list_category &&
                                    list_category.map(
                                      (value, index) =>
                                        value.parent === "0" && (
                                          <option
                                            key={index}
                                            value={value && value.codeLevel}
                                            onChange={(event) => (
                                              setData({
                                                ...data,
                                                parent: event.target.value,
                                              }),
                                              setMainValue(event.target.value),
                                              setShowSubLevel1(true),
                                              setShowSubLevel2(false),
                                              setDirty()
                                            )}
                                            selected={
                                              parent_1 &&
                                              parent_1.codeLevel ===
                                                value.codeLevel
                                            }
                                          >
                                            {value.nama}
                                          </option>
                                        )
                                    )}
                                </select>
                              </div>
                            </Col>
                            {parent_2 && showSubLevel1 && (
                              <Col md={4}>
                                <div>
                                  <select
                                    name="parent"
                                    className="form-control"
                                    defaultValue={mainValue}
                                    onChange={(event) => (
                                      setData({
                                        ...data,
                                        parent: event.target.value,
                                      }),
                                      setSubLevel1Value(event.target.value),
                                      event.target.value === mainValue
                                        ? setShowSubLevel2(false)
                                        : setShowSubLevel2(true),
                                      setDirty()
                                    )}
                                  >
                                    <option
                                      value={mainValue}
                                      onChange={(event) => (
                                        setData({
                                          ...data,
                                          parent: event.target.value,
                                        }),
                                        setSubLevel1Value(event.target.value),
                                        event.target.value === mainValue
                                          ? setShowSubLevel2(false)
                                          : setShowSubLevel2(true),
                                        setDirty()
                                      )}
                                    >
                                      -
                                    </option>
                                    {list_category &&
                                      list_category.map(
                                        (value, index) =>
                                          parent_2 &&
                                          parent_2.parent === value.parent && (
                                            <option
                                              key={index}
                                              value={value && value.codeLevel}
                                              onChange={(event) => (
                                                setData({
                                                  ...data,
                                                  parent: event.target.value,
                                                }),
                                                setSubLevel1Value(
                                                  event.target.value
                                                ),
                                                event.target.value === mainValue
                                                  ? setShowSubLevel2(false)
                                                  : setShowSubLevel2(true),
                                                setDirty()
                                              )}
                                              selected={
                                                parent_2 &&
                                                parent_2.codeLevel ===
                                                  value.codeLevel
                                              }
                                            >
                                              {value.nama}
                                            </option>
                                          )
                                      )}
                                  </select>
                                </div>
                              </Col>
                            )}
                            {parent_3 && showSubLevel2 && (
                              <Col md={4}>
                                <div>
                                  <select
                                    name="parent"
                                    className="form-control"
                                    defaultValue={subLevel1Value}
                                    onChange={(event) => (
                                      setData({
                                        ...data,
                                        parent: event.target.value,
                                      }),
                                      setDirty()
                                    )}
                                  >
                                    <option
                                      value={subLevel1Value}
                                      onChange={(event) => (
                                        setData({
                                          ...data,
                                          parent: event.target.value,
                                        }),
                                        setDirty()
                                      )}
                                    >
                                      -
                                    </option>
                                    {list_category &&
                                      list_category.map(
                                        (value, index) =>
                                          parent_3 &&
                                          parent_3.parent === value.parent && (
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
                                              selected={
                                                parent_3 &&
                                                parent_3.codeLevel ===
                                                  value.codeLevel
                                              }
                                            >
                                              {value.nama}
                                            </option>
                                          )
                                      )}
                                  </select>
                                </div>
                              </Col>
                            )}
                          </Row>
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
      readDetailCategory,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(EditCategory);
