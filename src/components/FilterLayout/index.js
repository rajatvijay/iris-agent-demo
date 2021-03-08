import React from "react";
import "./index.css";

export const FilterLayout = (props) => {
  const { label, children } = props;
  return (
    <div className="root">
      <label className="label">{label}</label>
      {children}
    </div>
  );
};
