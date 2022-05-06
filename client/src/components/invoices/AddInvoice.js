import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { IoIosAddCircleOutline } from "react-icons/io";
import DateTimePicker from "react-datetime-picker";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { useNavigate } from "react-router-dom";

const AddInvoice = (props) => {
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState();
  const [errMsg, setErrMsg] = useState(null);

  const [amount, setAmount] = useState("");
  const [datetime, setDatetime] = useState(new Date());
  const [studentId, setStudentId] = useState("");

  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    if (props?.activeStudents && props?.activeStudents.length > 0) {
      setStudentId(props?.activeStudents[0]._id);
    }
  }, [props?.activeStudents]);

  const addInvoice = async (e) => {
    e.preventDefault();
    console.log(
      new Date(datetime.getTime()).toLocaleString("en-US", {
        timeZone: "Asia/Beirut",
      })
    );

    await axiosJWTHolder
      .post(`/invoices/`, {
        amount,
        datetime: new Date(datetime.getTime()).toLocaleString("en-US", {
          timeZone: "Asia/Beirut",
        }),
        studentId,
        branchId: props?.selected,
      })
      .then((res) => {
        setAmount("");
        setErrMsg(null);
        const copy = [...props?.branchInvoices];
        copy.push(res.data);
        props?.setBranchInvoices(copy);
        setShowAddInvoiceModal(false);
      })
      .catch((err) => {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        } else {
          setErrMsg("Something went wrong. Please try again.");
        }
      });
  };

  return (
    <>
      <Button
        className="btn-custom no-border flex add-branch"
        variant="primary"
        onClick={() => setShowAddInvoiceModal(true)}
      >
        <IoIosAddCircleOutline className="icon" />
      </Button>

      <Modal
        show={showAddInvoiceModal}
        onHide={() => {
          setShowAddInvoiceModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Adding an invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addInvoice}>
            {errMsg ? (
              <p className={errMsg ? "error" : ""} aria-live="assertive">
                {errMsg}
              </p>
            ) : (
              <></>
            )}
            <Form.Group controlId="formBasicAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                placeholder="e.g. 400000"
                required
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicDatetime">
              <Form.Label>Datetime</Form.Label>
              <br />
              <DateTimePicker onChange={setDatetime} value={datetime} />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicStudent">
              <Form.Label>Student</Form.Label>
              <Form.Select
                className="drop-down-large"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                }}
              >
                {props?.activeStudents ? (
                  props?.activeStudents.map((activeStudent) => {
                    return (
                      <option key={activeStudent._id} value={activeStudent._id}>
                        {activeStudent.fullName}, {activeStudent.phoneNumber}
                      </option>
                    );
                  })
                ) : (
                  <></>
                )}
              </Form.Select>
            </Form.Group>
            <br />
            <Button className="btn-custom no-border float-right" type="submit">
              Add invoice
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddInvoice;
