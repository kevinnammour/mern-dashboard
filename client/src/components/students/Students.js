import Topbar from "../topbar/Topbar";
import { Table, Form, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { VscSearchStop } from "react-icons/vsc";
const baseUrl = "http://localhost:8000";

const Students = () => {
  const [selected, setSelected] = useState("");
  const [branches, setBranches] = useState();
  const [branchStudents, setBranchStudents] = useState();
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    const getBranches = async () => {
      try {
        const res = await axiosJWTHolder.get(`${baseUrl}/branches/names`);
        let rabieh = res?.data.find(
          (branch) => branch.name.toLowerCase() === "rabieh"
        );
        if (!rabieh && res?.data?.length > 0) {
          setSelected(res?.data?.[0]._id);
        } else if (rabieh) {
          setSelected(rabieh._id);
        }
        setBranches(res.data);
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    getBranches();
  }, []);

  useEffect(() => {
    const getBranchStudents = async () => {
      try {
        if (selected !== "") {
          const res = await axiosJWTHolder.get(
            `${baseUrl}/students/${selected}`
          );
          setBranchStudents(res.data);
        }
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    getBranchStudents();
  }, [selected]);

  const changeStudentStatus = async (e, active) => {
    const studentId = e.target.getAttribute("data-index");
    try {
      const res = await axiosJWTHolder.put(`${baseUrl}/students/set-status`, {
        studentId,
        active,
      });
      const copy = [...branchStudents];
      let index = copy.findIndex((student) => student._id === studentId);
      copy[index] = res.data;
      setBranchStudents(copy);
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <>
      <Topbar />
      <div className="wrapper box-shadow-low">
        <Form.Select
          className="drop-down"
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
          }}
        >
          {branches ? (
            branches.map((branchName) => {
              return (
                <option key={branchName._id} value={branchName._id}>
                  {branchName.name}
                </option>
              );
            })
          ) : (
            <></>
          )}
        </Form.Select>
      </div>
      {branchStudents && branchStudents.length > 0 ? (
        <Table
          striped
          bordered
          hover
          responsive
          className="students-table mt-4"
        >
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branchStudents.map((student) => (
              <tr>
                <td>{student?.fullName}</td>
                <td>{student?.parentName}</td>
                <td>{student?.phoneNumber}</td>
                <td>{student?.dateOfBirth}</td>
                <td>{student?.registrationDate}</td>
                <td>{student?.attendanceCount}</td>
                <td>{student?.certificate?.name}</td>
                <td className="pointer">
                  {student?.active === true ? "Active" : "Inactive"}
                </td>
                <td className="actions-cell">
                  <Button
                    data-index={student?._id}
                    className="btn-custom no-border me-3 nobr"
                  >
                    Add certificate
                  </Button>
                  <Button
                    data-index={student?._id}
                    className="btn-custom no-border"
                    onClick={
                      student?.active === true
                        ? (e) => changeStudentStatus(e, false)
                        : (e) => changeStudentStatus(e, true)
                    }
                  >
                    {student?.active === true ? "Deactivate" : "Activate"}
                  </Button>

                  <Modal
                    show={showCertificateModal}
                    onHide={() => {
                      setShowCertificateModal(false);
                    }}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Adding certificates</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Are you sure you want to{" "}
                      {/* {branchInfo.active === true ? "deactivate" : "activate"}{" "} */}
                      this branch?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        className="no-border"
                        variant="secondary"
                        onClick={() => {
                          // setShowConfirmationModal(false);
                        }}
                      >
                        No, close
                      </Button>
                      <Button
                        className="btn-custom no-border"
                        variant="primary"
                        onClick={() => {
                          // changeBranchStatus();
                          // setShowConfirmationModal(false);
                        }}
                      >
                        Yes, I am sure
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="center-h-v">
          <VscSearchStop className="notification-icon" />{" "}
          <span className="notification-msg">No students found</span>
        </div>
      )}
    </>
  );
};

export default Students;
