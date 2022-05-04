/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import useAuth from "../../hooks/useAuth";
import Topbar from "../topbar/Topbar";
import Dropdown from "../dropdown/Dropdown";
import AttendanceSheets from "./AttendanceSheets";
import AddAttendanceSheet from "./AddAttendanceSheet";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const Attendances = () => {
  const [selected, setSelected] = useState("");
  const [sheets, setSheets] = useState();
  const { auth } = useAuth();
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(sheets);
    const getBranchInformation = async () => {
      try {
        if (selected !== "") {
          await axiosJWTHolder.get(`/attendances/${selected}`).then((res) => {
            setSheets(res.data);
          });
        }
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    getBranchInformation();
  }, [selected]);

  return (
    <>
      <div className="fixed-top">
        <Topbar />
        <div className="wrapper box-shadow-low">
          <Dropdown selected={selected} setSelected={setSelected} />
          {auth?.role === "Partner" ? (
            <AddAttendanceSheet selected={selected} sheets={sheets} setSheets={setSheets}/>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="page-container">
        {sheets ? (
          <AttendanceSheets sheets={sheets} />
        ) : (
          <div className="center-h-v">
            <Spinner className="center-h-v darkblue-color" animation="border" />
          </div>
        )}
      </div>
    </>
  );
};

export default Attendances;