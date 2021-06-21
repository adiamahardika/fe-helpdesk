import React, { useEffect, useState } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withNamespaces } from "react-i18next";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import routes from "../../helpers/routes.json";
const SidebarContent = (props) => {
  const permissions = JSON.parse(localStorage.getItem("permission"));
  const [isViewUsers, setIsViewUsers] = useState(true);
  const [isViewRoles, setIsViewRoles] = useState(true);
  const [isViewAuditTrail, setIsViewAuditTrail] = useState(true);

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    let viewUsers = permissions.find(
      (value) => value.code === code_all_permissions.view_users
    );
    let viewRoles = permissions.find(
      (value) => value.code === code_all_permissions.view_role
    );
    let viewAuditTrail = permissions.find(
      (value) => value.code === code_all_permissions.view_audit_trail
    );

    viewUsers ? setIsViewUsers(true) : setIsViewUsers(false);
    viewRoles ? setIsViewRoles(true) : setIsViewRoles(false);
    viewAuditTrail ? setIsViewAuditTrail(true) : setIsViewAuditTrail(false);

    var pathName = props.location.pathname;
    const initMenu = () => {
      new MetisMenu("#side-menu");
      var matchingMenuItem = null;
      var ul = document.getElementById("side-menu");
      var items = ul.getElementsByTagName("a");
      for (var i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname]);

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  }

  return (
    <React.Fragment>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          <li>
            <Link to={routes.ticket} className="waves-effect">
              <i className="fas fa-ticket-alt"></i>
              <span>{props.t("Ticket")}</span>
            </Link>
          </li>
          <li>
            <Link to="/#" className="has-arrow waves-effect">
              <i className="bx bxs-cog"></i>
              <span>{props.t("Settings")}</span>
            </Link>
            <ul className="sub-menu" aria-expanded="false">
              {isViewUsers && (
                <li>
                  <Link to={routes.users}>{props.t("Users")}</Link>
                </li>
              )}
              {isViewRoles && (
                <li>
                  <Link to={routes.role}>{props.t("Role")}</Link>
                </li>
              )}
            </ul>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};

export default withRouter(withNamespaces()(SidebarContent));
