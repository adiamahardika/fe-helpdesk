import {
  READ_PERMISSION,
  READ_PERMISSION_REJECT,
  READ_PERMISSION_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  list_permission: null,
  option_permission: [],
  message: null,
  loading: false,
};

const Permission = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_PERMISSION:
      return {
        ...state,
        loading: true,
      };
    case READ_PERMISSION_REJECT:
      return {
        ...state,
        message: action.payload.message,
        loading: true,
      };
    case READ_PERMISSION_FULFILLED:
      if (state.option_permission.length <= 0) {
        action.payload.listPermission.map((value) => {
          return state.option_permission.push({
            label: value.name,
            value: value.id,
            code:value.code
          });
        });
      }
      return {
        ...state,
        list_permission: action.payload.listPermission,
        loading: false,
      };
    default:
      return state;
  }
};

export default Permission;
