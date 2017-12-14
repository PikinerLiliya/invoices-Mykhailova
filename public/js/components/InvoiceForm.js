import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { debounce } from 'lodash';
import { each } from 'async';

import { getCustomers } from '../actions/customers';
import { getProducts } from '../actions/products';
import {
  createInvoice,
  updateInvoice,
  getInvoiceRows,
  createInvoiceRow,
  updateInvoiceRow,
  deleteInvoiceRow
} from '../actions/invoices';

class InvoiceForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentCustomer: {
        id: null,
        name: 'Select Customer'
      },
      rows: [],
      deletedRows: []
    };

    this.saveInvoice = debounce(this.saveInvoice, 500);
  }

  mapPropsToState(nextProps) {
    const stateObj = {};
    const { currentInvoice: oldInvoice } = this.props;
    const { currentInvoice, customers, rows, products } = nextProps;

    if (currentInvoice && currentInvoice.id /*&& currentInvoice.id !== oldInvoice.id*/) {
      Object.assign(stateObj, currentInvoice);

      const currentCustomer = customers.find((item) => {
        return item.id === currentInvoice.customer_id;
      });

      stateObj.currentCustomer = currentCustomer || {
        id: null,
        name: 'Select Customer'
      };

      stateObj.rows = rows.map((el) => {

        el.product = products.find((it) => {
          return it.id === el.product_id;
        });

        return el;
      });
    }

    this.setState(stateObj);
  }

  componentWillReceiveProps(nextProps) {
    const {} = this.state;

    this.mapPropsToState(nextProps);
  }

  componentDidMount() {
    const {
      getCustomersDispatch,
      getProductsDispatch,
    } = this.props;

    getCustomersDispatch();
    getProductsDispatch();
  }

  renderCustomers = (item) => {
    return <li
      key={item.id}
      onClick={() => {
        this.setState({
          currentCustomer: {
            name: item.name,
            id: item.id
          }
        }, () => {
          this.saveInvoice()
        })
      }}
    >
      {item.name}
    </li>
  };

  saveInvoice = () => {
    const {
      currentInvoice,
      updateInvoiceDispatch,
      createInvoiceDispatch,
      deleteInvoiceRowDispatch,
      updateInvoiceRowDispatch,
      createInvoiceRowDispatch,
    } = this.props;
    const {
      currentCustomer,
      rows,
      deletedRows,
      id,
      discount
    } = this.state;
    const data = {
      total: 0,
      discount,
      customer_id: currentCustomer.id
    };

    if (data.customer_id && !currentInvoice.id) {
      return createInvoiceDispatch(data);
    }

    if (rows && rows.length) {
      each(rows, (item, cb) => {

        data.total += item.quantity * item.product.price;

        if (item.notCreated) {
          return createInvoiceRowDispatch(id, item, cb)
        }

        updateInvoiceRowDispatch(id, item, cb);
      }, (err) => {
        if (!err) {
          if (discount) {
            data.total = data.total - (discount * data.total / 100);
          }
          if (currentInvoice && currentInvoice.id) {
            data.id = currentInvoice.id;

            updateInvoiceDispatch(data)
          }

          this.setState({
            rows: [],
            total: data.total
          })
        }
      });
    } else {
      if (currentInvoice && currentInvoice.id) {
        data.id = currentInvoice.id;
        data.total = 0;

        updateInvoiceDispatch(data)
      }

      this.setState({
        rows: [],
        total: data.total
      })
    }

    if (deletedRows && deletedRows.length) {
      each(deletedRows, (itemId, cb) => {
        deleteInvoiceRowDispatch(id, itemId, cb);

      }, (err) => {
        if (!err) {
          this.setState({
            deletedRows: []
          })
        }
      });
    }

  };

  goBack = () => {
    const { history } = this.props;

    history.push('/invoices');
  };

  addNewProduct = () => {
    const { rows, id } = this.state;

    this.setState({
      rows: [...rows, {
        id: Date.now(),
        invoice_id: id,
        product_id: null,
        quantity: 1,
        notCreated: true,
        product: {
          price: 0
        }
      }]
    })
  };

  setProduct = (el, id) => {
    const { rows } = this.state;
    const currentRow = rows.find((it) => {
      return it.id === id;
    });

    currentRow.product_id = el.id;
    currentRow.product = {
      id: el.id,
      name: el.name,
      price: el.price
    };

    this.setState({ rows }, () => {
      this.saveInvoice();
    });
  };

  renderProduct(el, id) {
    return <li
      key={el.id}
      onClick={() => this.setProduct(el, id)}
    >
      {el.name}
    </li>
  }

  changeInvoiceItem = (e, field, id) => {
    const { rows } = this.state;
    const currentRow = rows.find((it) => {
      return it.id === id;
    });

    currentRow[field] = parseFloat(e.currentTarget.value) || 1;

    this.setState({ rows }, () => {
      this.saveInvoice();
    });
  };

  removeRow = (id) => {
    const { rows, deletedRows } = this.state;
    const currentRow = rows.find((it) => {
      return it.id === id;
    });
    const index = rows.indexOf(currentRow);

    rows.splice(index, 1);

    deletedRows.push(currentRow.id);

    this.setState({ rows, deletedRows, }, () => {
      this.saveInvoice();
    });
  };

  renderRow = (item, ind) => {
    const { products } = this.props;

    return <tr key={item.id}>
      <td>{ind + 1}</td>
      <td className="dropdown">
        <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="true">
          {item.product && item.product.name || 'Select product'}
          <span className="caret" />
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          {products.map((el) => this.renderProduct(el, item.id))}
        </ul>
      </td>
      <td>
        <input type="number" value={item.quantity || 1} min="1"
               onChange={(e) => this.changeInvoiceItem(e, 'quantity', item.id)} />
      </td>
      <td>
        <input type="text" value={item.product && item.product.price || 0} readOnly />
      </td>
      <td onClick={() => this.removeRow(item.id)}>X</td>
    </tr>
  };

  changeDiscount = (e) => {
    const discount = parseFloat(e.currentTarget.value) || 0;

    if (!isNaN(discount)) {
      this.setState({ discount }, () => {
        this.saveInvoice();
      });
    }
  };

  render() {
    const {
      title,
      customers,
    } = this.props;

    const { currentCustomer, rows, id, discount, total } = this.state;

    return <div className="panel panel-default" onChange={this.saveInvoice}>
      <div className="panel-heading clearfix">{title}
        <button
          className="btn"
          onClick={this.goBack}
          style={{ float: 'right' }}
        >Back
        </button>
      </div>
      <div className="panel-body">
        <div>
          <label>Customer</label>
          <div className="dropdown" style={{ display: 'inline-block', margin: '10px' }}>
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="true">
              {currentCustomer.name}
              <span className="caret" />
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              {customers.map(this.renderCustomers)}
            </ul>
          </div>
        </div>
        <br />
        <table className="table">
          <thead>
          <tr>
            <td>#</td>
            <td>Product</td>
            <td>Quantity</td>
            <td>Price</td>
            <td />
          </tr>
          </thead>
          <tbody>
          {id && rows.map(this.renderRow)}
          </tbody>
          {id && <tbody>
          <tr>
            <td colSpan="5">
              <button className="btn" onClick={this.addNewProduct}>Add Product</button>
            </td>
          </tr>
          </tbody>}
        </table>
        <div className="panel-footer clearfix">
          <div style={{ float: 'right' }}>{total && total.toFixed(2)}</div>
          <div>
            <label>Discount % </label>
            <input type="text" value={discount || 0} onChange={this.changeDiscount} />
          </div>
        </div>
      </div>
    </div>
  }
}

function mapStoreToProps(store) {
  return {
    customers: store.customers.items,
    products: store.products.items,
    currentInvoice: store.invoices.current,
    rows: store.invoices.rows,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCustomersDispatch: getCustomers,
    getProductsDispatch: getProducts,
    createInvoiceDispatch: createInvoice,
    updateInvoiceDispatch: updateInvoice,
    createInvoiceRowDispatch: createInvoiceRow,
    updateInvoiceRowDispatch: updateInvoiceRow,
    deleteInvoiceRowDispatch: deleteInvoiceRow,
    getInvoiceRowsDispatch: getInvoiceRows,
  }, dispatch);
}

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(InvoiceForm));