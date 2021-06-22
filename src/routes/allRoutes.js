import React from "react";
import { Redirect } from "react-router-dom";
import routes from "../helpers/routes.json";
// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import Users from "../pages/Settings/Users/index";
import AddUser from "../pages/Settings/Users/add_user";
import EditUser from "../pages/Settings/Users/edit_user";
import Role from "../pages/Settings/Role/index";
import AddRole from "../pages/Settings/Role/add_role";
import EditRole from "../pages/Settings/Role/edit_role";
import Ticket from "../pages/Ticket/index"
import Category from "../pages/Category/index"

const userRoutes = [
  { path: routes.dashboard, component: Dashboard },
  { path: routes.users, component: Users },
  { path: routes.add_user, component: AddUser },
  { path: routes.edit_user, component: EditUser },
  { path: routes.role, component: Role },
  { path: routes.add_role, component: AddRole },
  { path: routes.edit_role, component: EditRole },
  { path: routes.ticket, component: Ticket },
  { path: routes.category, component: Category },

  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: () => <Redirect to={routes.ticket} />,
  },
];

const authRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
];

export { userRoutes, authRoutes };
