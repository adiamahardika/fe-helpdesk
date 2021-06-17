import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_CAPTCHA } from "./actionTypes";
import { readCaptchaFulfilled, readCaptchaReject } from "./actions";
import { readCaptchaMethod } from "./method";
import general_constant from "../../../helpers/general_constant.json";

function* readCaptcha() {
  const response = yield call(readCaptchaMethod);
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
