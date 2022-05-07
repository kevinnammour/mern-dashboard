import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";

const EditInvoiceRate = (props) => {
  const [showRateModal, setShowRateModal] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [rate, setRate] = useState();
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  const editInvoiceRate = async (e) => {
    e.preventDefault();
    if (rate >= 0) {
      await axiosJWTHolder
        .put(`/invoices/`, {
          invoiceId: props?.invoice?._id,
          lbpRate: rate,
        })
        .then((res) => {
          const copy = [...props?.branchInvoices];
          let index = copy.findIndex(
            (invoice) => invoice._id === props?.invoice._id
          );
          copy[index] = res.data;
          copy[index].usdAmount = copy[index]?.amount / copy[index]?.lbpRate;
          props?.setBranchInvoices(copy);
          setRate(null);
          setErrMsg(null);
          setShowRateModal(false);
        })
        .catch((err) => {
          if (err?.response?.status === 403 || err?.response?.status === 401) {
            navigate("/login");
          } else {
            setErrMsg("Something went wrong. Please try again.");
          }
        });
    } else {
      setErrMsg("Invoice rate should be positive");
    }
  };

  return (
    <>
      <Button
        data-index={props?.invoice?._id}
        className="btn-custom no-border m-1"
        onClick={(e) => {
          setShowRateModal(true);
        }}
      >
        <span className="nobr">Edit rate</span>
      </Button>

      <Modal
        show={showRateModal}
        onHide={() => {
          setShowRateModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit rate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editInvoiceRate}>
            {errMsg ? (
              <p className={errMsg ? "error" : ""} aria-live="assertive">
                {errMsg}
              </p>
            ) : (
              <></>
            )}
            <Form.Group controlId="formBasicFullname">
              <Form.Label>Student's full name</Form.Label>
              <Form.Control
                type="text"
                value={props?.invoice?.student?.fullName}
                readOnly
                required
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicPhoneNumber">
              <Form.Label>Phone number</Form.Label>
              <Form.Control
                type="text"
                value={props?.invoice?.student?.phoneNumber}
                readOnly
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="text"
                value={props?.invoice?.amount}
                readOnly
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicDatetime">
              <Form.Label>Datetime</Form.Label>
              <Form.Control
                type="text"
                value={props?.invoice?.datetime}
                readOnly
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formBasicRate">
              <Form.Label>Lbp rate</Form.Label>
              <Form.Control
                type="number"
                value={rate}
                placeholder="e.g. 19200"
                required
                onChange={(e) => setRate(e.target.value)}
              />
            </Form.Group>
            <br />
            <Button className="btn-custom no-border float-right" type="submit">
              Save rate
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditInvoiceRate;
