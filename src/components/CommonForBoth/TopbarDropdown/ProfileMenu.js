import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import routes from "../../../helpers/routes.json";

const ProfileMenu = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  const name = localStorage.getItem("name");
  const username = localStorage.getItem("username");

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
          tag="button"
        >
          <span className="d-none d-xl-inline-block ml-2 mr-1">{name}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
        </DropdownToggle>
        <DropdownMenu end>
          <Link
            to={{
              pathname: routes.profile,
              search: `?username=${username}`,
            }}
            className="dropdown-item"
          >
            {" "}
            <i className="bx bx-user font-size-16 align-middle mr-1"></i>
            {props.t("Profile")}{" "}
          </Link>
          <div className="dropdown-divider"></div>
          <Link to={routes.login} className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle mr-1 text-danger"></i>
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
