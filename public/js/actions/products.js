import { GET_PRODUCTS } from '../constants/actionTypes';

import {
  request,
  httpOptions,
  checkStatus
} from '../lib/request';

const url = '/api/products';

export function setProducts(data) {
  return {
    type: GET_PRODUCTS,
    payload: data
  }
}

export function getProducts() {
  return (dispatch) => {
    request(url, httpOptions({
      method: 'GET'
    }))
      .then(checkStatus)
      .then(resp => resp.json())
      .then((resp) => {
        dispatch(setProducts(resp))
      })
      .catch((err) => {
        alert(err.error);
      });
  }
}