import React from "react";
import { VscSearchStop } from "react-icons/vsc";
import { Table } from "reactstrap";

const AttendingStudents = (props) => {
  return (
    <>
      {props?.attendingStudents && props?.attendingStudents.length > 0 ? (
        <>
          <div>
            <h5 className="mb-4">Highest attending student</h5>
            <Table striped bordered hover responsive className="mt-4">
              <thead>
                <tr>
                  <th>Full name</th>
                  <th>Parent's name</th>
                  <th>Phone number</th>
                  <th>Birthdate</th>
                  <th>Registration date</th>
                  <th>Attendance count</th>
                  <th>Latest certificate</th>
                  <th>Status</th>
                  <th>Branch name</th>
                </tr>
              </thead>
              <tbody>
                {props?.attendingStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student?.fullName}</td>
                    <td>{student?.parentName}</td>
                    <td>{student?.phoneNumber}</td>
                    <td>{student?.dateOfBirth}</td>
                    <td>{student?.registrationDate}</td>
                    <td>{student?.attendanceCount}</td>
                    <td>{student?.certificate?.name}</td>
                    <td>{student?.active === true ? "Active" : "Inactive"}</td>
                    <td>{student?.branchName}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      ) : (
        <div className="center-h-v">
          <VscSearchStop className="notification-icon" />
          <span className="notification-msg">No students are attending any NinjaCo branch</span>
        </div>
      )}
    </>
  );
};

export default AttendingStudents;