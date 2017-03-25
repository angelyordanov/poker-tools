import React, { Component } from 'react';

export default class RangeInput extends Component {
  constructor(props, context) {
    super(props, context);

    const { percent, setRange, id } = props;

    this.state = {
      text: `${percent}`,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setRange = setRange;
    this.id = id;
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    const percent = parseInt(e.target.value.trim(), 10);
    if (e.which === 13 && !isNaN(percent)) {
      this.setRange(percent);
    }
  }

  render() {
    return (
      <input
        type="text"
        autoFocus="true"
        className="form-control"
        placeholder="Type a range percent"
        id={this.id}
        value={this.state.text}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit} />
    );
  }
}
