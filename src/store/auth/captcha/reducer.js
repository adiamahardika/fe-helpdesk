import {
  READ_CAPTCHA,
  READ_CAPTCHA_REJECT,
  READ_CAPTCHA_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  captcha: null,
  image_captcha: null,
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
        loading: true,
      };
    case READ_CAPTCHA_FULFILLED:
      return {
        ...state,
        captcha: action.payload.hidden,
        image_captcha: action.payload.image,
        loading: false,
      };
    default:
      return state;
  }
};

export default Captcha;
