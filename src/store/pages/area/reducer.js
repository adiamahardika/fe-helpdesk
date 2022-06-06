import {
  READ_AREA,
  READ_AREA_REJECT,
  READ_AREA_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  list_area: null,
  option_area: [],
  response_code_area: null,
  message_area: null,
  loading: false,
};

const Area = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_AREA:
      return {
        ...state,
        option_area: [],
        loading: true,
      };
    case READ_AREA_REJECT:
      return {
        ...state,
        response_code_area: action.payload.status.responseCode,
        message_area: action.payload.status.description[0],
        loading: false,
      };
    case READ_AREA_FULFILLED:
      if (state.option_area.length <= 0) {
        action.payload.content.map((value) => {
          return state.option_area.push({
            label: value.areaName,
            value: value.areaCode,
          });
        });
      }
      return {
        ...state,
        list_area: action.payload.content,
        response_code_area: action.payload.status.responseCode,
        message_area: action.payload.status.description[0],
        loading: false,
      };
    default:
      return state;
  }
};

export default Area;
