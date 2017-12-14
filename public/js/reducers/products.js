import { GET_PRODUCTS } from '../constants/actionTypes';

const initialState = {
  items: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCTS: {
      return {
        items: [...action.payload]
      }
    }
    default: {
      return state;
    }
  }
}