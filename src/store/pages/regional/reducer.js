import {
  READ_REGIONAL,
  READ_REGIONAL_REJECT,
  READ_REGIONAL_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  list_regional: null,
  response_code_regional: null,
  message_regional: null,
  loading: false,
};

const Regional = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_REGIONAL:
      return {
        ...state,
        loading: true,
      };
    case READ_REGIONAL_REJECT:
      return {
        ...state,
        response_code_regional: action.payload.status.responseCode,
        message_regional: action.payload.status.description[0],
        loading: false,
      };
    case READ_REGIONAL_FULFILLED:
      return {
        ...state,
        list_regional: action.payload.content,
        response_code_regional: action.payload.status.responseCode,
        message_regional: action.payload.status.description[0],
        loading: false,
      };
    default:
      return state;
  }
};

export default Regional;
