import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

// { id: 1, msg: "please login", alertType: "success" },
const initialState = [];

const alertReducers = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];

    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);

    default:
      return state;
  }
};

export default alertReducers;
