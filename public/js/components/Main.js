import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

import InvoiceList from './InvoiceList';
import InvoiceForm from './InvoiceForm';
import PreEditForm from './PreEditForm';

class Main extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/invoices" component={InvoiceList} />
          <Route exact path="/createInvoice" render={() => <InvoiceForm title="Create Invoice" />} />
          <Route path="/editInvoice/:id" component={PreEditForm} />
          <Route exact path="/products" />
          <Route exact path="/customers" />
          <Redirect from="/" to="/invoices" />
        </Switch>
      </div>
    )
  }
}


export default Main;