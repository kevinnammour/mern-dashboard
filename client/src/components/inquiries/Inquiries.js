/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Topbar from "../topbar/Topbar";
import { useNavigate } from "react-router-dom";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { Spinner } from "react-bootstrap";
import InquiriesTable from "./InquiriesTable";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState();
  const navigate = useNavigate();
  const axiosJWTHolder = useAxiosJWTHolder();

  useEffect(() => {
    const getInquiries = async () => {
      try {
        const res = await axiosJWTHolder.get(`/inquiries/`);
        setInquiries(res.data);
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    getInquiries();
  }, []);

  return (
    <>
      <div className="fixed-top">
        <Topbar />
      </div>
      <div className="page-container">
        {inquiries ? (
          <InquiriesTable inquiries={inquiries} setInquiries={setInquiries} />
        ) : (
          <div className="center-h-v">
            <Spinner className="center-h-v darkblue-color" animation="border" />
          </div>
        )}
      </div>
    </>
  );
};

export default Inquiries;