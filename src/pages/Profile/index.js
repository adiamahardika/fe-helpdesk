import React, { useState, useEffect } from "react";
import { Container, Card, CardBody, Table } from "reactstrap";
import { readPermission } from "../../store/pages/permission/actions";
import { readUserDetail } from "../../store/pages/users/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { readRole } from "../../store/pages/role/actions";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import queryString from "query-string";

const Profile = (props) => {
  const user_detail = props.user_detail;
  const { search } = useLocation();
  const { username } = queryString.parse(search);

  useEffect(() => {
    props.readUserDetail(username);
    props.readPermission();
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title={"Users"} breadcrumbItem={"Profile"} />
          <Card>
            <CardBody>
              <div className="table-responsive">
                <Table className="table table-centered">
                  <tbody>
                    <tr>
                      <th>Username</th>
                      <td>{user_detail && user_detail.username}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Name</th>
                      <td>{user_detail && user_detail.name}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{user_detail && user_detail.email}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td>{user_detail && user_detail.phone}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <th>Role</th>
                      <td>{user_detail && user_detail.roles[0].name}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};
const mapStatetoProps = (state) => {
  const { option_permission, list_permission } = state.Permission;
  const { message_user, loading, response_code_user, user_detail } = state.User;
  return {
    message_user,
    loading,
    response_code_user,
    user_detail,
    option_permission,
    list_permission,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readPermission,
      readUserDetail,
      readRole,
    },
    dispatch
  );

export default connect(mapStatetoProps, mapDispatchToProps)(Profile);
