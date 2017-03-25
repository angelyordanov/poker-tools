import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as handsActions, selector } from '../';
import HandsTable from './HandsTable';
import RangeInput from './RangeInput';
import './HandsView.scss';

export default connect(
  selector,
  (dispatch) => ({
    actions: bindActionCreators(handsActions, dispatch)
  })
)((props) => (
  <div className="container">
    <div className="row">
      <div className="col-sm-8">
        <HandsTable {...props} />
      </div>
      <div className="col-sm-4">
        <div>
          <label htmlFor="range">Range</label>
          <div className="input-group">
            <RangeInput id="basic-url" setRange={props.actions.setRange} percent={props.percent} />
            <span className="input-group-addon">%</span>
          </div>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input type="text" className="form-control" id="description" value={props.description} readOnly />
        </div>
      </div>
    </div>
  </div>
));
