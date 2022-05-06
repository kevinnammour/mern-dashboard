import React from "react";
import { VscSearchStop } from "react-icons/vsc";
import { Form } from "react-bootstrap";
import EditBranchStatus from "./EditBranchStatus";

const BranchInfo = (props) => {
  return (
    <>
      {props?.branchInfo ? (
        <div>
          <h5 className="mb-4">Branch information</h5>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Branch name</Form.Label>
              <Form.Control value={props?.branchInfo?.name} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPartnerName">
              <Form.Label>Partner's name</Form.Label>
              <Form.Control value={props?.branchInfo?.partnerName} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPercentage">
              <Form.Label>NinjaCo percentage (%)</Form.Label>
              <Form.Control value={props?.branchInfo?.percentage} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control value={props?.branchInfo?.locationUrl} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
              <Form.Label>Phone number</Form.Label>
              <Form.Control value={props?.branchInfo?.phoneNumber} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicStatus">
              <Form.Label>Status</Form.Label>
              {props?.branchInfo?.active === true ? (
                <Form.Control value="Active" readOnly />
              ) : (
                <Form.Control value="Inactive" readOnly />
              )}
            </Form.Group>
            <EditBranchStatus branchInfo={props?.branchInfo} setBranchInfo={props?.setBranchInfo}/>
          </Form>
        </div>
      ) : (
        <div className="center-h-v">
          <VscSearchStop className="notification-icon" />
          <span className="notification-msg">No information was found.</span>
        </div>
      )}
    </>
  );
};

export default BranchInfo;