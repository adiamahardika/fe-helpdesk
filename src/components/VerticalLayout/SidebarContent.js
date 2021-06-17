import React, {  useEffect } from 'react';

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withNamespaces } from 'react-i18next';

const SidebarContent = (props) => {
        
    // Use ComponentDidMount and ComponentDidUpdate method symultaniously
     useEffect(() => {

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
        }
         initMenu();
      }, [props.location.pathname]);

  
    function  activateParentDropdown(item) {
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
    };

          return (
           
            <React.Fragment>
                 <div id="sidebar-menu">
                <ul className="metismenu list-unstyled" id="side-menu">
                    <li className="menu-title">{props.t('Menu') }  </li>
                     <li>
                         <Link to="/#" className="waves-effect">
                                    <i className="bx bx-home-circle"></i><span className="badge badge-pill badge-info float-right">03</span>
                                    <span>{props.t('Dashboards') }</span>
                                </Link>
                                <ul className="sub-menu" aria-expanded="false">
                                    <li><Link to="/dashboard">{props.t('Default') }</Link></li>
                                </ul>
                     </li>
                </ul>
            </div>
            </React.Fragment>
          );
        }

    export default withRouter(withNamespaces()(SidebarContent));


