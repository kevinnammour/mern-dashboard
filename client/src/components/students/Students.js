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
import Dropdown from "../dropdown/Dropdown";
import StudentsTable from "./StudentsTable";
import { Spinner } from "react-bootstrap";

const Students = () => {
  const [selected, setSelected] = useState("");
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
    const getBranchStudents = async () => {
      try {
        if (selected !== "") {
          const res = await axiosJWTHolder.get(`/students/${selected}`);
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
      const res = await axiosJWTHolder.put(`/students/set-status`, {
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
      const res = await axiosJWTHolder.post(`/students/add-certificate`, {
        studentId,
        certificateName: certificate,
      });
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
      <div className="fixed-top">
        <Topbar />
        <div className="wrapper box-shadow-low">
          <Dropdown selected={selected} setSelected={setSelected} />
          <AddStudent
            selected={selected}
            branchStudents={branchStudents}
            setBranchStudents={setBranchStudents}
          />
        </div>
      </div>
      <div className="page-container">
        {branchStudents ? (
          <StudentsTable branchStudents={branchStudents} />
        ) : (
          <div className="center-h-v">
            <Spinner className="center-h-v darkblue-color" animation="border" />
          </div>
        )}
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