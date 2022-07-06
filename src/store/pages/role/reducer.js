import {
  CREATE_ROLE,
  CREATE_ROLE_REJECT,
  CREATE_ROLE_FULFILLED,
  READ_ROLE,
  READ_ROLE_REJECT,
  READ_ROLE_FULFILLED,
  READ_DETAIL_ROLE,
  READ_DETAIL_ROLE_REJECT,
  READ_DETAIL_ROLE_FULFILLED,
  UPDATE_ROLE,
  UPDATE_ROLE_REJECT,
  UPDATE_ROLE_FULFILLED,
  DELETE_ROLE,
  DELETE_ROLE_REJECT,
  DELETE_ROLE_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  response_code_role: null,
  list_role: null,
  detail_role: null,
  option_role: [],
  message_role: null,
  loading: false,
};

const Role = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_ROLE:
      return {
        ...state,
        lading: true,
      };
    case READ_ROLE_REJECT:
      return {
        ...state,
        response_code_role: action.payload.status.responseCode,
        message_role: action.payload.status.description[0],
        loading: true,
      };
    case READ_ROLE_FULFILLED:
      if (state.option_role.length <= 0) {
        action.payload.listRole.map((value) => {
          return state.option_role.push({
            label: value.name,
            value: value.id,
          });
        });
      }
      return {
        ...state,
        list_role: action.payload.listRole,
        response_code_role: action.payload.status.responseCode,
        message_role: action.payload.status.description[0],
        loading: true,
      };
    case READ_DETAIL_ROLE:
      return {
        ...state,
        lading: true,
      };
    case READ_DETAIL_ROLE_REJECT:
      return {
        ...state,
        response_code_role: action.payload.status.responseCode,
        message_role: action.payload.status.description[0],
        loading: true,
      };
    case READ_DETAIL_ROLE_FULFILLED:
      return {
        ...state,
        detail_role: action.payload.listRole[0],
        response_code_role: action.payload.status.responseCode,
        message_role: action.payload.status.description[0],
        loading: true,
      };
    case CREATE_ROLE:
      return {
        ...state,
        loading: true,
      };
    case CREATE_ROLE_REJECT:
      return {
        ...state,
        response_code_role: action.payload.status.responseCode,
        message_role: action.payload.status.description[0],
        loading: true,
      };
    case CREATE_ROLE_FULFILLED:
      return {
        ...state,
        response_code_role: action.payload.status.responseCode,
        message_role: action.payload.status.description[0],
        loading: true,
      };
    case UPDATE_ROLE:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_ROLE_REJECT:
      return {
        ...state,
        response_code_role: action.payload.status.responseCode,
        message_role: action.payload.status.description[0],
        loading: true,
      };
    case UPDATE_ROLE_FULFILLED:
      return {
        ...state,
        response_code_role: action.payload.status.responseCode,
        message_role: action.payload.status.description[0],
        lading: false,
      };
    case DELETE_ROLE:
      return {
        ...state,
        loading: true,
      };
    case DELETE_ROLE_REJECT:
      return {
        ...state,
        response_code_role: action.payload.status.responseCode,
        message_role: action.payload.status.description[0],
        loading: true,
      };
    case DELETE_ROLE_FULFILLED:
      return {
        ...state,
        response_code_role: action.payload.status.responseCode,
        message_role: action.payload.status.description[0],
        list_role: action.payload.listRole,
        loading: true,
      };
    default:
      return state;
  }
};

export default Role;
