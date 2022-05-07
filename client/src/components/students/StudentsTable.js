import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { VscSearchStop } from "react-icons/vsc";
import useAuth from "../../hooks/useAuth";
import SearchStudents from "./SearchStudents";
import AddCertificate from "./AddCertificate";
import EditStudentStatus from "./EditStudentStatus";

const StudentsTable = (props) => {
  const [search, setSearch] = useState("");
  const { auth } = useAuth();

  return (
    <>
      {props?.branchStudents && props?.branchStudents.length > 0 ? (
        <>
          <div>
            <h5 className="mb-4">Students</h5>
            <SearchStudents search={search} setSearch={setSearch} />
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
                  {auth?.role === "Admin" ? <th>Actions</th> : <></>}
                </tr>
              </thead>
              <tbody>
                {props?.branchStudents
                  .filter((student) =>
                    student.fullName
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((student) => (
                    <tr key={student._id}>
                      <td>{student?.fullName}</td>
                      <td>{student?.parentName}</td>
                      <td>{student?.phoneNumber}</td>
                      <td>{student?.dateOfBirth}</td>
                      <td>{student?.registrationDate}</td>
                      <td>{student?.attendanceCount}</td>
                      <td>{student?.certificate?.name}</td>
                      <td>
                        {student?.active === true ? "Active" : "Inactive"}
                      </td>
                      {auth?.role === "Admin" ? (
                        <td className="actions-cell">
                          <AddCertificate
                            student={student}
                            branchStudents={props?.branchStudents}
                            setBranchStudents={props?.setBranchStudents}
                          />
                          <EditStudentStatus
                            student={student}
                            branchStudents={props?.branchStudents}
                            setBranchStudents={props?.setBranchStudents}
                          />
                        </td>
                      ) : (
                        <></>
                      )}
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </>
      ) : (
        <div className="center-h-v">
          <VscSearchStop className="notification-icon" />
          <span className="notification-msg">No students found!</span>
        </div>
      )}
    </>
  );
};

export default StudentsTable;