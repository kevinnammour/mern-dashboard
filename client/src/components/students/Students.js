import Topbar from "../topbar/Topbar";
import {
  Table,
  Form,
  Button,
  Modal,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { VscSearchStop } from "react-icons/vsc";
import useAuth from "../../hooks/useAuth";
import AddStudent from "./AddStudent";
const baseUrl = "http://localhost:8000";

const Students = () => {
  const [selected, setSelected] = useState("");
  const [branches, setBranches] = useState();
  const [branchStudents, setBranchStudents] = useState();
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedStudentCertificate, setSelectedStudentCertificate] =
    useState("");
  const [certificate, setCertificate] = useState("");
  const [search, setSearch] = useState("");

  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();
  const { auth } = useAuth();

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
    if (auth?.role === "Admin") {
      getBranches();
    } else if (auth?.role === "Partner") {
      setSelected(auth?._id);
    }
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

  const addCertificate = async () => {
    const studentId = selectedStudentCertificate;
    try {
      const res = await axiosJWTHolder.post(
        `${baseUrl}/students/add-certificate`,
        {
          studentId,
          certificateName: certificate,
        }
      );
      setCertificate("");
      setSelectedStudentCertificate("");
      setShowCertificateModal(false);
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
        {auth?.role === "Admin" ? (
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
        ) : (
          <></>
        )}
        <AddStudent
          selected={selected}
          branchStudents={branchStudents}
          setBranchStudents={setBranchStudents}
        />
      </div>

      <div className="students-container">
        {branchStudents && branchStudents.length > 0 ? (
          <>
            <Form.Group controlId="formBasicNewPassword">
              <Form.Control
                className="searchbar mt-3"
                type="text"
                value={search}
                placeholder="Search for students..."
                required
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </Form.Group>
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
                {branchStudents
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
                      <td className="pointer">
                        {student?.active === true ? "Active" : "Inactive"}
                      </td>
                      {auth?.role === "Admin" ? (
                        <td className="actions-cell">
                          <Button
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
                            {student?.active === true
                              ? "Deactivate"
                              : "Activate"}
                          </Button>
                        </td>
                      ) : (
                        <></>
                      )}
                    </tr>
                  ))}
              </tbody>
            </Table>
          </>
        ) : (
          <div className="center-h-v">
            <VscSearchStop className="notification-icon" />{" "}
            <span className="notification-msg">No students found</span>
          </div>
        )}
      </div>
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
          <Container>
            <Row className="mt-1">
              <Col>
                <Form>
                  <Form.Group controlId="formBasicCertificate">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        branchStudents?.find(
                          (student) =>
                            student._id === selectedStudentCertificate
                        )?.fullName
                      }
                      readOnly
                      required
                    />
                  </Form.Group>
                  <br />
                  <Form.Group controlId="formBasicCertificate">
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        branchStudents?.find(
                          (student) =>
                            student._id === selectedStudentCertificate
                        )?.phoneNumber
                      }
                      readOnly
                    />
                  </Form.Group>
                  <br />
                  <Form.Group controlId="formBasicCertificate">
                    <Form.Label>Certificate</Form.Label>
                    <Form.Control
                      type="text"
                      value={certificate}
                      placeholder="e.g. Sixth Sense Robotics Workshop 2"
                      required
                      onChange={(e) => setCertificate(e.target.value)}
                    />
                  </Form.Group>
                  <br />
                  <Button
                    className="btn-custom no-border float-right"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      addCertificate();
                    }}
                  >
                    Add certificate
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Students;
