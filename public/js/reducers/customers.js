import { GET_CUSTOMERS } from '../constants/actionTypes';

const initialState = {
  items: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CUSTOMERS: {
      return {
        items: [...action.payload]
      }
    }
    default: {
      return state;
    }
  }
}