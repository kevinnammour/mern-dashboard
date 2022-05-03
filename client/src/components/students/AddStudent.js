import { Form, Button, Modal, Container, Row, Col } from "react-bootstrap";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const baseUrl = "http://localhost:8000";

const AddStudent = (props) => {
  const navigate = useNavigate();
  const axiosJWTHolder = useAxiosJWTHolder();

  const [errMsg, setErrMsg] = useState("");
  const [fullName, setFullName] = useState("");
  const [parentName, setParentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const addStudent = async (e) => {
    e.preventDefault();
    if (
      !/^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/.test(fullName)
    ) {
      setErrMsg("Invalid full name.");
    } else if (
      !/^[\w'\-,.][^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/.test(parentName)
    ) {
      setErrMsg("Invalid parent name.");
    } else if (
      !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
        phoneNumber
      )
    ) {
      setErrMsg("Invalid phone number.");
    } else {
      setErrMsg(null);
      try {
        const res = await axiosJWTHolder.post(`${baseUrl}/students/`, {
          fullName,
          parentName,
          phoneNumber,
          dateOfBirth,
          registrationDate,
          branchId: props.selected,
        });
        setFullName("");
        setParentName("");
        setPhoneNumber("");
        setDateOfBirth("");
        setRegistrationDate("");
        setErrMsg("");
        const copy = [...props.branchStudents];
        copy.push(res.data);
        props.setBranchStudents(copy);
        setShowAddStudentModal(false);
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        } else {
          setErrMsg("Something went wrong. Please try again.");
        }
      }
    }
  };

  return (
    <>
      <Button
        className="btn-custom no-border flex add-branch"
        variant="primary"
        onClick={() => setShowAddStudentModal(true)}
      >
        <IoIosAddCircleOutline className="icon" />
      </Button>

      <Modal
        show={showAddStudentModal}
        onHide={() => {
            setShowAddStudentModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Adding a student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="mt-1">
              <Col>
                <Form onSubmit={addStudent}>
                  {errMsg ? (
                    <p className={errMsg ? "error" : ""} aria-live="assertive">
                      {errMsg}
                    </p>
                  ) : (
                    <></>
                  )}
                  <Form.Group controlId="formBasicFullName">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                      type="text"
                      value={fullName}
                      placeholder="e.g. Berta Kai"
                      required
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group controlId="formBasicParentName">
                    <Form.Label>Parent's name</Form.Label>
                    <Form.Control
                      value={parentName}
                      type="text"
                      placeholder="e.g. Robert Zain"
                      required
                      onChange={(e) => setParentName(e.target.value)}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group controlId="formBasicPhoneNumber">
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control
                      type="tel"
                      value={phoneNumber}
                      placeholder="e.g. +96178910121"
                      required
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group controlId="formBasicDOB">
                    <Form.Label>Birthdate</Form.Label>
                    <Form.Control
                      type="date"
                      value={dateOfBirth}
                      required
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </Form.Group>
                  <br />
                  <Form.Group controlId="formBasicDOR">
                    <Form.Label>Registration date</Form.Label>
                    <Form.Control
                      type="date"
                      value={registrationDate}
                      required
                      onChange={(e) => setRegistrationDate(e.target.value)}
                    />
                  </Form.Group>
                  <br />
                  <Button
                    className="btn-custom no-border float-right"
                    type="submit"
                  >
                    Add student
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

export default AddStudent;
