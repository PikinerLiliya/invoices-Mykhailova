import { GET_INVOICES, SET_CURRENT_INVOICE, SET_INVOICE_ROWS } from '../constants/actionTypes';

const initialState = {
  items: [],
  current: {},
  rows: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_INVOICES: {
      return {
        ...state,
        items: [...action.payload]
      }
    }
    case SET_CURRENT_INVOICE: {
      return {
        ...state,
        current: { ...action.payload }
      }
    }
    case SET_INVOICE_ROWS: {
      return {
        ...state,
        rows: [...action.payload]
      }
    }
    default: {
      return state;
    }
  }
}