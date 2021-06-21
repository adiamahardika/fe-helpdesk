import {
  all,
  call,
  fork,
  takeEvery,
  put,
  takeLatest,
} from "redux-saga/effects";

import { READ_TICKET } from "./actionTypes";
import { readTicketReject, readTicketFulfilled } from "./actions";
import { readMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readTicket({ payload: data }) {
  const response = yield call(readMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(readTicketFulfilled(response));
  } else {
    yield put(readTicketReject(response));
  }
}

export function* watchReadTicket() {
  yield takeLatest(READ_TICKET, readTicket);
}

function* TicketSaga() {
  yield all([fork(watchReadTicket)]);
}

export default TicketSaga;
