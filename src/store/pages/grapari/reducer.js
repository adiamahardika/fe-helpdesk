import {
  READ_GRAPARI,
  READ_GRAPARI_REJECT,
  READ_GRAPARI_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  list_grapari: null,
  response_code_grapari: null,
  message_grapari: null,
  loading: false,
};

const Area = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_GRAPARI:
      return {
        ...state,
        loading: true,
      };
    case READ_GRAPARI_REJECT:
      return {
        ...state,
        response_code_grapari: action.payload.status.responseCode,
        message_grapari: action.payload.status.description[0],
        loading: false,
      };
    case READ_GRAPARI_FULFILLED:
      return {
        ...state,
        list_grapari: action.payload.content,
        response_code_grapari: action.payload.status.responseCode,
        message_grapari: action.payload.status.description[0],
        loading: false,
      };
    default:
      return state;
  }
};

export default Area;
