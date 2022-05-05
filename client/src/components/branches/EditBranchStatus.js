import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { useNavigate } from "react-router-dom";

const EditBranchStatus = (props) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState();
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  const changeBranchStatus = async () => {
    try {
      await axiosJWTHolder
        .put(`/branches/`, {
          branchId: props?.branchInfo?._id,
          active: !props?.branchInfo.active,
        })
        .then((res) => {
          props?.setBranchInfo(res.data);
        });
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <>
      <Button
        className="btn-custom no-border"
        onClick={(e) => {
          e.preventDefault();
          setShowConfirmationModal(true);
        }}
      >
        {props?.branchInfo?.active === true ? "Deactivate" : "Activate"}
      </Button>
      <Modal
        show={showConfirmationModal}
        onHide={() => {
          setShowConfirmationModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Status change confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to{" "}
          {props?.branchInfo?.active === true ? "deactivate" : "activate"} this
          branch?
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="no-border"
            variant="secondary"
            onClick={() => {
              setShowConfirmationModal(false);
            }}
          >
            No, close
          </Button>
          <Button
            className="btn-custom no-border"
            variant="primary"
            onClick={() => {
              changeBranchStatus();
              setShowConfirmationModal(false);
            }}
          >
            Yes, I am sure
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditBranchStatus;
