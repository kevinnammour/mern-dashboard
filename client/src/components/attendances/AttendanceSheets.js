/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import { useNavigate } from "react-router-dom";
import { VscSearchStop } from "react-icons/vsc";
import AttendanceSheet from "./AttendanceSheet";

const AttendanceSheets = (props) => {
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    const getBranchInformation = async () => {
      try {
        if (props.selected !== "") {
          const res = await axiosJWTHolder.get(
            `/attendances/${props.selected}`
          );
          props?.setSheets(res.data);
        }
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    getBranchInformation();
  }, [props.selected]);

  return (
    <>
      {props?.sheets && props?.sheets.length > 0 ? (
        <div>
          <h5 className="mb-4">Last 30 days attendance sheets</h5>
          {props?.sheets.map((sheet) => {
            return <AttendanceSheet key={sheet._id} sheet={sheet} />;
          })}
        </div>
      ) : (
        <div className="center-h-v">
          <VscSearchStop className="notification-icon" />
          <span className="notification-msg">No attendance sheets found</span>
        </div>
      )}
    </>
  );
};

export default AttendanceSheets;
