import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { VscSearchStop } from "react-icons/vsc";
import { Button } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const StudentsTable = (props) => {
  const [search, setSearch] = useState("");
  const { auth } = useAuth();

  return (
    <>
      {props?.branchStudents && props?.branchStudents.length > 0 ? (
        <div>
          <h5 className="mb-4">Students</h5>
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
                  student.fullName.toLowerCase().includes(search.toLowerCase())
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
                    <td>{student?.active === true ? "Active" : "Inactive"}</td>
                    {auth?.role === "Admin" ? (
                      <td className="actions-cell">
                        {/* <Button
                          data-index={student?._id}
                          className="btn-custom no-border m-1"
                          onClick={(e) => {
                            setShowCertificateModal(true);
                            setSelectedStudentCertificate(
                              e.target.getAttribute("data-index")
                            );
                          }}
                        >
                          Add certificate
                        </Button>
                        <Button
                          data-index={student?._id}
                          className="btn-custom no-border m-1"
                          onClick={
                            student?.active === true
                              ? (e) => changeStudentStatus(e, false)
                              : (e) => changeStudentStatus(e, true)
                          }
                        >
                          {student?.active === true ? "Deactivate" : "Activate"}
                        </Button> */}
                      </td>
                    ) : (
                      <></>
                    )}
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="center-h-v">
          <VscSearchStop className="notification-icon" />
          <span className="notification-msg">No students found</span>
        </div>
      )}
    </>
  );
};

export default StudentsTable;