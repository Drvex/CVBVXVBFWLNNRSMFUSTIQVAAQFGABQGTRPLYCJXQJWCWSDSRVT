import React from "react";
import { Spin } from "antd";

const Loader = ({ message }) => {
  return (
    <div className="loader">
      <Spin tip={message || "Loading..."} />
    </div>
  );
};

export default Loader;
