/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner } from "reactstrap";
import Topbar from "../topbar/Topbar";
import { useEffect, useState } from "react";
import BranchesIncome from "./BranchesIncome";
import { useNavigate } from "react-router-dom";
import TotalIncomeChart from "./TotalIncomeChart";
import AttendingStudents from "./AttendingStudents";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";

const Analytics = () => {
  const [totalIncome, setTotalIncome] = useState();
  const [branchesIncome, setBranchesIncome] = useState();
  const [attendingStudents, setAttendingStudents] = useState();
  const [render, setRender] = useState(false);

  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    const getGraphData = async () => {
      setRender(false);
      Promise.all([
        axiosJWTHolder.get(`/analytics/total-income`),
        axiosJWTHolder.get(`/analytics/branches-income`),
        axiosJWTHolder.get(`/analytics/attending-students`),
      ])
        .then(async ([res1, res2, res3]) => {
          // Converting the dates into timestamps that
          // will be converted by the apexcharts library
          // to readable dates
          var copy = [...res1?.data];
          for (let i = 0; i < copy.length; i++) {
            copy[i][0] = new Date(new Date(copy[i][0]).getTime() + 86400000);
          }
          setTotalIncome(copy);
          setBranchesIncome(res2?.data);
          setAttendingStudents(res3?.data);
          // console.log(`${res1?.data}`);
          // console.log(`${res2?.data}`);
          // console.log(`${res3?.data}`);
          setRender(true);
        })
        .catch((err) => {
          if (err?.response?.status === 403 || err?.response?.status === 401) {
            navigate("/login");
          }
        });
    };
    getGraphData();
  }, []);

  return (
    <>
      <div className="fixed-top">
        <Topbar />
      </div>
      <div className="page-without-sndbar">
        {render ? (
          <>
            <TotalIncomeChart totalIncome={totalIncome} />
            <BranchesIncome branchesIncome={branchesIncome} />
            <AttendingStudents attendingStudents={attendingStudents} />
          </>
        ) : (
          <div className="center-h-v">
            <Spinner className="center-h-v darkblue-color" animation="border" />
          </div>
        )}
      </div>
    </>
  );
};

export default Analytics;
