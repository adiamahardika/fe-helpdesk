import { all } from "redux-saga/effects";

//public
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import LayoutSaga from "./layout/saga";
import UserSaga from "./pages/users/saga";
import RoleSaga from "./pages/role/saga";
import PermissionSaga from "./pages/permission/saga";
import CaptchaSaga from "./auth/captcha/saga";
import TicketSaga from "./pages/ticket/saga";
import CategorySaga from "./pages/category/saga";

export default function* rootSaga() {
  yield all([
    //public
    AccountSaga(),
    AuthSaga(),
    ProfileSaga(),
    ForgetSaga(),
    LayoutSaga(),
    UserSaga(),
    RoleSaga(),
    PermissionSaga(),
    CaptchaSaga(),
    TicketSaga(),
    CategorySaga(),
  ]);
}
