import { GET_CUSTOMERS } from '../constants/actionTypes';

import {
  request,
  httpOptions,
  checkStatus
} from '../lib/request';

const url = '/api/customers';

export function setCustomers(data) {
  return {
    type: GET_CUSTOMERS,
    payload: data
  }
}

export function getCustomers() {
  return (dispatch) => {
    request(url, httpOptions({
      method: 'GET'
    }))
      .then(checkStatus)
      .then(resp => resp.json())
      .then((resp) => {
        dispatch(setCustomers(resp));
      })
      .catch((err) => {
        alert(err.error);
      });
  }
}
