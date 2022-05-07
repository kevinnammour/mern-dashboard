import React from "react";
import { VscSearchStop } from "react-icons/vsc";
import { Table, Button } from "react-bootstrap";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { useNavigate } from "react-router-dom";
import SolveInquiry from "./SolveInquiry";

const InquiriesTable = (props) => {
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  const solveInquiry = async (e) => {
    const inquiryId = e.target.getAttribute("data-index");
    await axiosJWTHolder
      .put(`/inquiries/`, {
        inquiryId,
      })
      .then(() => {
        const newInquiries = props?.inquiries?.filter(
          (inquiry) => inquiry._id !== inquiryId
        );
        props?.setInquiries(newInquiries);
      })
      .catch((err) => {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      });
  };

  return (
    <>
      {props?.inquiries && props?.inquiries?.length > 0 ? (
        <div>
          <h5 className="mb-4">Users' inquiries</h5>
          <Table striped bordered hover responsive className="mt-1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone #</th>
                <th>Type</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {props?.inquiries?.map((inquiry) => (
                <tr key={inquiry?._id}>
                  <td>{inquiry?.fullName}</td>
                  <td>{inquiry?.phoneNumber}</td>
                  <td>{inquiry?.type}</td>
                  <td>{inquiry?.message}</td>
                  <td>
                    <SolveInquiry
                      inquiry={inquiry}
                      solveInquiry={solveInquiry}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="center-h-v">
          <VscSearchStop className="notification-icon" />
          <span className="notification-msg">No inquiries found!</span>
        </div>
      )}
    </>
  );
};

export default InquiriesTable;
