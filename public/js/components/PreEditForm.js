import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InvoiceForm from './InvoiceForm';

import { getCurrentInvoice } from '../actions/invoices';

class PreEditForm extends Component {
  componentDidMount() {
    const { match, getCurrentInvoiceDispatch } = this.props;
    const id = match.params.id;

    if (id) {
      getCurrentInvoiceDispatch(id);
    }
  }

  render() {
    return <InvoiceForm title="Edit invoice" />
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCurrentInvoiceDispatch: getCurrentInvoice,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(withRouter(PreEditForm));