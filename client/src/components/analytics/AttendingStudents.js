import React from "react";
import { Table } from "reactstrap";

const AttendingStudents = (props) => {
  return (
    <div className="mt-5 mb-4">
      <h5 className="mb-4">Highest attending students</h5>
      {props?.attendingStudents && props?.attendingStudents.length > 0 ? (
        <>
          <Table striped bordered hover responsive className="mt-4">
            <thead>
              <tr>
                <th>Full name</th>
                <th>Parent's name</th>
                <th>Branch name</th>
                <th>Phone number</th>
                <th>Birthdate</th>
                <th>Registration date</th>
                <th>Attendance count</th>
                <th>Latest certificate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {props?.attendingStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student?.fullName}</td>
                  <td>{student?.parentName}</td>
                  <td>{student?.branchName}</td>
                  <td>{student?.phoneNumber}</td>
                  <td>{student?.dateOfBirth}</td>
                  <td>{student?.registrationDate}</td>
                  <td>{student?.attendanceCount}</td>
                  <td>{student?.certificate?.name}</td>
                  <td>{student?.active === true ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <>
          Oops! It appears that NinjaCo does not have any students coming
          lately!
        </>
      )}
    </div>
  );
};

export default AttendingStudents;