import {
  READ_CAPTCHA,
  READ_CAPTCHA_REJECT,
  READ_CAPTCHA_FULFILLED,
} from "./actionTypes";

export const readCaptcha = () => {
  return {
    type: READ_CAPTCHA,
  };
};

export const readCaptchaReject = (payload) => {
  return {
    type: READ_CAPTCHA_REJECT,
    payload: payload,
  };
};

export const readCaptchaFulfilled = (data) => {
  return {
    type: READ_CAPTCHA_FULFILLED,
    payload: data,
  };
};
