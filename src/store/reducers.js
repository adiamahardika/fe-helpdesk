import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";
import User from "./pages/users/reducer";
import Role from "./pages/role/reducer";
import Permission from "./pages/permission/reducer";
import Ticket from "./pages/ticket/reducer";
import Category from "./pages/category/reducer";
import Report from "./pages/report/reducer";
import TicketStatus from "./pages/ticketStatus/reducer";
import Area from "./pages/area/reducer";
import Regional from "./pages/regional/reducer";
import Grapari from "./pages/grapari/reducer";
import Terminal from "./pages/terminal/reducer";
import EmailNotif from "./pages/emailNotif/reducer";
import SubCategory from "./pages/subCategory/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";
import Captcha from "./auth/captcha/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  User,
  Role,
  Permission,
  Captcha,
  Ticket,
  Category,
  Report,
  TicketStatus,
  Area,
  Regional,
  Grapari,
  Terminal,
  EmailNotif,
  SubCategory,
});

export default rootReducer;
