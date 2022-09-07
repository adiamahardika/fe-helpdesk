import React, { useEffect, useState } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import code_all_permissions from "../../helpers/code_all_permissions.json";
import routes from "../../helpers/routes.json";
import CryptoJS from "crypto-js";
require("dotenv").config();

const SidebarContent = (props) => {
  const permissions = JSON.parse(
    CryptoJS.AES.decrypt(
      localStorage.getItem("permission"),
      `${process.env.REACT_APP_ENCRYPT_KEY}`
    ).toString(CryptoJS.enc.Utf8)
  );
  const [isViewTicket, setIsViewTicket] = useState(true);
  const [isViewUsers, setIsViewUsers] = useState(true);
  const [isViewRoles, setIsViewRoles] = useState(true);
  const [isViewCategory, setIsViewCategory] = useState(true);
  const [isGenerateReport, setIsGenerateReport] = useState(true);
  const [isEmailNotif, setIsEmailNotif] = useState(true);
  const [isDashboard, setIsDashboard] = useState(true);

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    let viewUsers = permissions.find(
      (value) => value.code === code_all_permissions.view_users
    );
    let viewRoles = permissions.find(
      (value) => value.code === code_all_permissions.view_role
    );
    let viewCategory = permissions.find(
      (value) => value.code === code_all_permissions.view_category
    );
    let viewTicket = permissions.find(
      (value) => value.code === code_all_permissions.view_ticket
    );
    let generateReport = permissions.find(
      (value) => value.code === code_all_permissions.generate_report
    );
    let emailNotif = permissions.find(
      (value) => value.code === code_all_permissions.email_notif
    );
    let dashboard = permissions.find(
      (value) => value.code === code_all_permissions.dashboard
    );

    viewUsers ? setIsViewUsers(true) : setIsViewUsers(false);
    viewRoles ? setIsViewRoles(true) : setIsViewRoles(false);
    viewCategory ? setIsViewCategory(true) : setIsViewCategory(false);
    viewTicket ? setIsViewTicket(true) : setIsViewTicket(false);
    generateReport ? setIsGenerateReport(true) : setIsGenerateReport(false);
    emailNotif ? setIsEmailNotif(true) : setIsEmailNotif(false);
    dashboard ? setIsDashboard(true) : setIsDashboard(false);

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

  const SettingsMenu = () => {
    if (isViewRoles || isViewUsers) {
      return (
        <li>
          <Link to={routes.users} className="has-arrow waves-effect">
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
            {isEmailNotif && (
              <li>
                <Link to={routes.email_notif}>{props.t("Email Notif")}</Link>
              </li>
            )}
          </ul>
        </li>
      );
    } else {
      return <></>;
    }
  };

  return (
    <React.Fragment>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {isDashboard && (
            <li>
              <Link to={routes.dashboard} className="waves-effect">
                <i className="bx bx-line-chart"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>
          )}
          {isViewTicket && (
            <li>
              <Link to={routes.ticket} className="waves-effect">
                <i className="fas fa-ticket-alt"></i>
                <span>{props.t("Ticket")}</span>
              </Link>
            </li>
          )}
          {isViewCategory && (
            <li>
              <Link to={routes.category} className="waves-effect">
                <i className="bx bx-list-ul"></i>
                <span>{props.t("Category")}</span>
              </Link>
            </li>
          )}
          {isGenerateReport && (
            <li>
              <Link to={routes.report} className="waves-effect">
                <i className="bx bxs-report"></i>
                <span>{props.t("Report")}</span>
              </Link>
            </li>
          )}
          <SettingsMenu />
        </ul>
      </div>
    </React.Fragment>
  );
};

export default withRouter(withTranslation()(SidebarContent));
