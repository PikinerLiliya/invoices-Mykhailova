import {
  GET_INVOICES,
  SET_CURRENT_INVOICE,
  SET_INVOICE_ROWS,
} from '../constants/actionTypes';

import {
  request,
  httpOptions,
  checkStatus
} from '../lib/request';

const url = '/api/invoices';

export function setRecords(data) {
  return {
    type: GET_INVOICES,
    payload: data
  }
}

export function setCurrentInvoiceRows(data) {
  return {
    type: SET_INVOICE_ROWS,
    payload: data
  }
}

export function setCurrentInvoice(data) {

  return (dispatch) => {
    dispatch(getInvoiceRows(data.id));

    dispatch({
      type: SET_CURRENT_INVOICE,
      payload: data
    });
  };
};

export function getInvoices() {
  return (dispatch) => {
    request(url, httpOptions({
      method: 'GET'
    }))
      .then(checkStatus)
      .then(resp => resp.json())
      .then((resp) => {
        dispatch(setRecords(resp));
        dispatch(setCurrentInvoice({}));
        dispatch(setCurrentInvoiceRows([]))
      })
      .catch((err) => {
        alert(err.error);
      });
  }
}

export function getCurrentInvoice(id) {
  return (dispatch) => {
    request(`${url}/${id}`, httpOptions({
      method: 'GET'
    }))
      .then(checkStatus)
      .then(resp => resp.json())
      .then((resp) => {
        dispatch(setCurrentInvoice(resp));
        dispatch(getInvoiceRows(resp.id))
      })
      .catch((err) => {
        alert(err.error);
      });
  }
}

export function createInvoice(data) {
  return (dispatch) => {
    request(url, httpOptions({
      method: 'POST',
      body: JSON.stringify(data)
    }))
      .then(checkStatus)
      .then(resp => resp.json())
      .then((resp) => {
        dispatch(setCurrentInvoice(resp));
        dispatch(getInvoiceRows(resp.id))
      })
      .catch((err) => {
        alert(err.error);
      });
  }
}

export function updateInvoice(data) {
  return (dispatch) => {
    request(`${url}/${data.id}`, httpOptions({
      method: 'PUT',
      body: JSON.stringify(data)
    }))
      .then(checkStatus)
      .then(resp => resp.json())
      .then((resp) => {
        dispatch(setCurrentInvoice(resp));
        dispatch(getInvoiceRows(resp.id))
      })
      .catch((err) => {
        alert(err.error);
      });
  }
}

export function deleteInvoice(id) {
  return (dispatch) => {
    request(`${url}/${id}`, httpOptions({
      method: 'DELETE',
    }))
      .then(checkStatus)
      .then(resp => resp.json())
      .then(() => {
        dispatch(getInvoices())
      })
      .catch((err) => {
        alert(err.error);
      });
  }
}

export function getInvoiceRows(id) {
  return (dispatch) => {
    request(`${url}/${id}/items`, httpOptions({
      method: 'GET'
    }))
      .then(checkStatus)
      .then(resp => resp.json())
      .then((resp) => {
        dispatch(setCurrentInvoiceRows(resp));
      })
      .catch((err) => {
        alert(err.error);
      });
  }
}

export function createInvoiceRow(id, row, cb = () => {
}) {
  return (dispatch) => {
    request(`${url}/${id}/items`, httpOptions({
      method: 'POST',
      body: JSON.stringify(row)
    }))
      .then(checkStatus)
      .then(resp => resp.json())
      .then(() => {
        dispatch(getInvoiceRows(id));
        cb();
      })
      .catch((err) => {
        cb(err);
        alert(err.error);
      });
  }
}

export function updateInvoiceRow(id, row, cb = () => {
}) {
  return (dispatch) => {
    request(`${url}/${id}/items/${row.id}`, httpOptions({
      method: 'PUT',
      body: JSON.stringify(row)
    }))
      .then(checkStatus)
      .then(resp => resp.json())
      .then(() => {
        dispatch(getInvoiceRows(id));
        cb();
      })
      .catch((err) => {
        cb(err);
        alert(err.error);
      });
  }
}

export function deleteInvoiceRow(id, itemId, cb = () => {
}) {
  return (dispatch) => {
    request(`${url}/${id}/items/${itemId}`, httpOptions({
      method: 'DELETE'
    }))
      .then(checkStatus)
      .then(resp => resp.json())
      .then(() => {
        dispatch(getInvoiceRows(id));
        cb();
      })
      .catch((err) => {
        cb(err);
        alert(err.error);
      });
  }
}