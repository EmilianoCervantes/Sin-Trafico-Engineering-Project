import React from 'react';

const Input = props => {
  return (
    <div className="form-label-group">
      <input type="text" className="form-control text-center"
        {...props}
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
      <label htmlFor={props.id}>{props.placeholder}</label>
    </div>
  );
};

export default Input;