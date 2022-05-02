import { useEffect, useState } from "react";
import Topbar from "../topbar/Topbar";
import { useNavigate } from "react-router-dom";
import { axiosJWTHolder } from "../../apis/axiosJWTHolder";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { VscSearchStop } from "react-icons/vsc";
import { FaBusinessTime, FaQuestionCircle } from "react-icons/fa";
import { Button } from "react-bootstrap";

const baseUrl = "http://localhost:8000";

const Inquiries = () => {
  const [inquiries, setInquiries] = useState();
  const navigate = useNavigate();
  const axiosJWTHolder = useAxiosJWTHolder();

  useEffect(() => {
    const getBranches = async () => {
      try {
        const res = await axiosJWTHolder.get(`${baseUrl}/inquiries/`);
        setInquiries(res.data);
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    getBranches();
  }, []);

  const solveInquiry = async (e) => {
    const inquiryId = e.target.getAttribute("data-index");
    try {
      const res = await axiosJWTHolder.put(`${baseUrl}/inquiries/`, {
        inquiryId
      });
      const newInquiries = inquiries.filter(inquiry => inquiry._id !== inquiryId);
      setInquiries(newInquiries);
    } catch (err) {
      if (err?.response?.status === 403 || err?.response?.status === 401) {
        navigate("/login");
      }
    }
  }

  return (
    <>
      <Topbar />
      {inquiries && inquiries.length > 0 ? (
        <div class="d-flex flex-column inquiries-container mt-3">
          {inquiries.map((inquiry) => 
            <div class="inquiry-container p-3 box-shadow" key={inquiry._id}>
              {inquiry.type.toLowerCase() === "partnership" ? <FaBusinessTime className="inquiry-icon darkblue-color mb-3" /> : <FaQuestionCircle className="inquiry-icon darkblue-color mb-3" />}
              <p className="darkblue-color"><b>Name:</b> {inquiry.fullName}</p>
              <p className="darkblue-color"><b>Telephone: </b> {inquiry.phoneNumber}</p>
              <p className="darkblue-color">
                <b>Message: </b> {inquiry.message}
              </p>
              <Button data-index={inquiry._id} onClick={solveInquiry} className="darkblue-bg float-right no-border">
                Solve
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="center-h-v">
          <VscSearchStop className="notification-icon" />{" "}
          <span className="notification-msg">No inquiries found</span>
        </div>
      )}
    </>
  );
};

export default Inquiries;
