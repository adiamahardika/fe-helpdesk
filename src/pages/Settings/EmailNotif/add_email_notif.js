import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, Col, Row } from "reactstrap";
import { createEmailNotif } from "../../../store/pages/emailNotif/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useHistory } from "react-router";
import { emailValidation } from "../../../helpers/index";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import code_all_permissions from "../../../helpers/code_all_permissions.json";
import list_all_permission from "../../../helpers/list_all_permission.json";
import general_constant from "../../../helpers/general_constant.json";
import SweetAlert from "react-bootstrap-sweetalert";
import UnsavedChangesWarning from "../../../helpers/unsaved_changes_warning";
import routes from "../../../helpers/routes.json";
import CryptoJS from "crypto-js";
require("dotenv").config();

const AddEmailNotif = (props) => {
  const message = props.message_email_notif;
  const response_code = props.response_code_email_notif;
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      localStorage.getItem("permission"),
      `${process.env.REACT_APP_ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );
  const history = useHistory();
  const [Prompt, setDirty, setPristine] = UnsavedChangesWarning();

  const [data, setData] = useState(null);
  const [isShowSweetAlert, setIsShowSweetAlert] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const onChangeEmail = (email) => {
    setValidEmail(emailValidation(email));
    setData({
      ...data,
      email: email,
    });
    setDirty();
  };
  const onSubmitCreate = async () => {
    props.createEmailNotif({
      email: data.email,
    });
    setIsShowSweetAlert(true);
    setPristine();
  };

  const ButtonSubmitCreate = () => {
    if (
      data &&
      Object.keys(data).length >= 1 &&
      Object.values(data).every((value) => value !== "") &&
      validEmail
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
              history.push(routes.email_notif);
            }}
          >
            Email Notif has successfully created!
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
    let isAddEmailNotif = permissions.find(
      (value) => value.code === code_all_permissions.add_email_notif
    );
    if (!isAddEmailNotif) {
      history.push(routes.email_notif);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={"Email Notif"}
            breadcrumbItem={"Add Email Notif"}
          />
          <Card>
            <CardBody>
              <Row className="justify-content-center">
                <Col md={4}>
                  <div
                    className="col-md-12 mb-3 p-0"
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
                  <AvForm>
                    <AvField
                      name="email"
                      label=""
                      placeholder="ex: shop@mail.com"
                      type="email"
                      errorMessage="Enter valid Email"
                      validate={{
                        required: { value: true },
                        maxLength: { value: 100 },
                      }}
                      onChange={(event) => onChangeEmail(event.target.value)}
                    />
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
  const { response_code_email_notif, message_email_notif } = state.EmailNotif;
  return {
    response_code_email_notif,
    message_email_notif,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      createEmailNotif,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(AddEmailNotif);
