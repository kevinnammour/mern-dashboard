import React from "react";
import { Form } from "react-bootstrap";

const SearchStudents = (props) => {
  return (
    <>
      <Form.Group controlId="formBasicSearchBar">
        <Form.Control
          className="searchbar mt-3"
          type="text"
          value={props?.search}
          placeholder="Search for students..."
          required
          onChange={(e) => {
            props?.setSearch(e.target.value);
          }}
        />
      </Form.Group>
    </>
  );
};

export default SearchStudents;