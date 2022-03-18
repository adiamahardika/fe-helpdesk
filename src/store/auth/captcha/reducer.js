import {
  READ_CAPTCHA,
  READ_CAPTCHA_REJECT,
  READ_CAPTCHA_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  captcha_id: null,
  image_captcha: null,
  response_code_captcha: null,
  message_captcha: null,
  loading: false,
};

const Captcha = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_CAPTCHA:
      return {
        ...state,
        loading: true,
      };
    case READ_CAPTCHA_REJECT:
      return {
        ...state,
        response_code_captcha: action.payload.status.responseCode,
        message_captcha: action.payload.status.description[0],
        loading: false,
      };
    case READ_CAPTCHA_FULFILLED:
      return {
        ...state,
        captcha_id: action.payload.response.captchaId,
        image_captcha: action.payload.response.image,
        response_code_captcha: action.payload.status.responseCode,
        message_captcha: action.payload.status.description[0],
        loading: false,
      };
    default:
      return state;
  }
};

export default Captcha;
