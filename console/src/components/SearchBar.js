import React from "react";
import { Input } from "antd";

const SearchBar = ({ onSearch }) => {
  return (
    <Input.Search
      placeholder="Search by name or surname"
      onSearch={onSearch}
      style={{ marginBottom: 20, width: "45%" }}
    />
  );
};

export default SearchBar;
