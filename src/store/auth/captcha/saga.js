import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_CAPTCHA } from "./actionTypes";
import { readCaptchaFulfilled, readCaptchaReject } from "./actions";
import { getMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readCaptcha({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(readCaptchaFulfilled(response));
  } else {
    yield put(readCaptchaReject(response));
  }
}

export function* watchReadCaptcha() {
  yield takeLatest(READ_CAPTCHA, readCaptcha);
}

function* CaptchaSaga() {
  yield all([fork(watchReadCaptcha)]);
}

export default CaptchaSaga;
