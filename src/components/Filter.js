import React from "react";

const Filter = props => (
  <div>
    <input type="text" onChange={props.handleInputChange} />
    Filter
  </div>
);

export default Filter;