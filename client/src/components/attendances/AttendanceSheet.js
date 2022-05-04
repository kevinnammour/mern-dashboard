import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Table } from "reactstrap";

const AttendanceSheet = (props) => {
  const [show, setShow] = useState(false);

  const flipShow = () => {
    setShow(!show);
  };

  return (
    <>
      <div className="attendance-sheet-row mb-3">
        <div>Submitted on {props?.sheet?.date}</div>
        <Button
          data-index={props?.sheet?._id}
          className="btn-custom no-border text-center"
          onClick={flipShow}
        >
          {show ? "Close" : "Show"}
        </Button>
      </div>
      {show ? (
        props?.sheet?.students && props?.sheet?.students?.length > 0 ? (
          <Table striped bordered hover responsive className="mt-1">
            <thead>
              <tr>
                <th>Full name</th>
                <th>Phone number</th>
              </tr>
            </thead>
            <tbody>
              {props?.sheet?.students?.map((student) => (
                <tr key={student._id}>
                  <td>{student?.fullName}</td>
                  <td>{student?.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <>
            <div className="text-center">No students attended this session.</div>
          </>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default AttendanceSheet;
