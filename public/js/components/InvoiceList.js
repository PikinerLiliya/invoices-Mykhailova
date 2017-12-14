import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

import { getInvoices, setCurrentInvoice, deleteInvoice } from '../actions/invoices';
import { getCustomers } from '../actions/customers';

class InvoiceList extends Component {
  constructor(props) {
    super(props);

    this.stete = {}
  }

  componentDidMount() {
    const {
      getInvoicesDispatch,
      getCustomersDispatch,
    } = this.props;

    getInvoicesDispatch();
    getCustomersDispatch();
  }

  setCurrentInvoice(item) {
    const { setCurrentInvoiceDispatch, history } = this.props;

    setCurrentInvoiceDispatch(item);

    history.push(`/editInvoice/${item.id}`);
  };

  getCustomer = (id) => {
    const { customers } = this.props;

    const obj = customers.find((item) => {
      return item.id === id;
    }) || {};

    return obj.name || 'None';
  };

  removeInvoice = (id) => {
    const { removeInvoiceDispatch } = this.props;

    removeInvoiceDispatch(id);
  };

  renderItem = (item, ind) => {
    return <tr
      key={item.id}
      onClick={() => this.setCurrentInvoice(item)}
    >
      <td>{ind + 1}</td>
      <td>{this.getCustomer(item.customer_id)}</td>
      <td>{item.total && item.total.toFixed(2)}</td>
      <td onClick={(e) => {
        e.stopPropagation();
        this.removeInvoice(item.id)
      }}>X
      </td>
    </tr>
  };

  createInvoice = () => {
    const { history } = this.props;

    history.push('/createInvoice')
  };

  render() {
    const { items } = this.props;
    return <div>
      <div className="panel panel-default">
        <div className="panel-heading clearfix">
          Invoice List
          <button
            type="button"
            className="btn"
            style={{ float: 'right' }}
            onClick={this.createInvoice}
          >
            Create
          </button>
        </div>
        <table className="table">
          <thead>
          <tr>
            <td>#</td>
            <td>Customer</td>
            <td>Total</td>
            <td>Remove</td>
          </tr>
          </thead>
          <tbody>
          {
            items.map(this.renderItem)
          }
          </tbody>
        </table>
      </div>
    </div>
  }
}

function mapStoreToProps(store) {
  return {
    items: store.invoices.items,
    customers: store.customers.items,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getInvoicesDispatch: getInvoices,
    getCustomersDispatch: getCustomers,
    setCurrentInvoiceDispatch: setCurrentInvoice,
    removeInvoiceDispatch: deleteInvoice
  }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(InvoiceList));