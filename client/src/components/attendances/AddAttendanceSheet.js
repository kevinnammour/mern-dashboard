import React, { useState } from "react";
import { Button, Modal, Container, Row, Col, Form } from "react-bootstrap";
import { IoIosAddCircleOutline } from "react-icons/io";

const AddAttendanceSheet = () => {
  const [showAddSheetModal, setShowAttendanceSheetModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const addSheet = async () => {};

  return (
    <>
      <Button
        className="btn-custom no-border flex add-branch"
        variant="primary"
        onClick={() => setShowAttendanceSheetModal(true)}
      >
        <IoIosAddCircleOutline className="icon" />
      </Button>

      <Modal
        show={showAddSheetModal}
        onHide={() => {
          setShowAttendanceSheetModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Adding a sheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="mt-1">
              <Col>
                <Form onSubmit={addSheet}>
                  {errMsg ? (
                    <p className={errMsg ? "error" : ""} aria-live="assertive">
                      {errMsg}
                    </p>
                  ) : (
                    <></>
                  )}
                  
                  <Button
                    className="btn-custom no-border float-right"
                    type="submit">
                    Add sheet
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

export default AddAttendanceSheet;
