import React, { Component } from 'react';
import _ from 'lodash';
import cn from 'classnames';

const Hand = ({ hand: { hand, suited, pair }, range }) => (
  <td className={cn({ suited, pair, range: range.indexOf(hand) !== -1 })}>
    {hand}
  </td>
);

const Row = ({ row, range }) => (
  <tr>
    {row.map((hand, i) => <Hand key={i} hand={hand} range={range} />)}
  </tr>
);

export default class HandsTable extends Component {
  render() {
    const { square, range, actions } = this.props;

    return (
      <table className="hands-table">
        <tbody>
          {square.map((row, i) => <Row key={i} row={row} range={range}/>)}
        </tbody>
      </table>
    );
  }
}
