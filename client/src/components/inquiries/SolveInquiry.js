import React from "react";
import { Button } from "react-bootstrap";

const SolveInquiry = (props) => {
  return (
    <Button
      data-index={props?.inquiry?._id}
      className="btn-custom no-border m-1"
      onClick={props?.solveInquiry}
    >
      Solve
    </Button>
  );
};

export default SolveInquiry;