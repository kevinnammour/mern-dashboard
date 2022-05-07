/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import Topbar from "../topbar/Topbar";
import BranchesIncome from "./BranchesIncome";
import TotalIncomeChart from "./TotalIncomeChart";

const Analytics = () => {
  const [totalIncome, setTotalIncome] = useState();
  const [branchesIncome, setBranchesIncome] = useState();
  const [render, setRender] = useState(false);
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();

  useEffect(() => {
    const getGraphData = async () => {
      setRender(false);
      Promise.all([
        axiosJWTHolder.get(`/analytics/total-income`),
        axiosJWTHolder.get(`/analytics/branches-income`),
      ])
        .then(async ([res1, res2]) => {
          var copy = [...res1?.data];
          for (let i = 0; i < copy.length; i++) {
            copy[i][0] = new Date(new Date(copy[i][0]).getTime() + 86400000);
          }
          setTotalIncome(copy);
          setBranchesIncome(res2?.data);
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
      <div className="page-container">
        {render ? (
          <>
            <TotalIncomeChart totalIncome={totalIncome} />
            <br />
            <BranchesIncome branchesIncome={branchesIncome} />
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
