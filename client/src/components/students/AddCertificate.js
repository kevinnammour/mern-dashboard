import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { useNavigate } from "react-router-dom";

const AddCertificate = (props) => {
  const [certificate, setCertificate] = useState("");
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  const addCertificate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosJWTHolder.post(`/students/add-certificate`, {
        studentId: props?.student._id,
        certificateName: certificate,
      });
      const copy = [...props?.branchStudents];
      let index = copy.findIndex(
        (student) => student._id === props?.student?._id
      );
      copy[index] = res.data;
      props?.setBranchStudents(copy);
      setCertificate("");
      setShowCertificateModal(false);
      setErrMsg(null);
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        navigate("/login");
      } else {
        setErrMsg("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <Button
        data-index={props?.student?._id}
        className="btn-custom no-border m-1"
        onClick={(e) => {
          setShowCertificateModal(true);
        }}
      >
        Add certificate
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
          <Form onSubmit={addCertificate}>
            {errMsg ? (
              <p className={errMsg ? "error" : ""} aria-live="assertive">
                {errMsg}
              </p>
            ) : (
              <></>
            )}
            <Form.Group controlId="formBasicFullname">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                value={props?.student?.fullName}
                readOnly
                required
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicPhoneNumber">
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                type="text"
                value={props?.student?.phoneNumber}
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
            <Button className="btn-custom no-border float-right" type="submit">
              Add certificate
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddCertificate;
