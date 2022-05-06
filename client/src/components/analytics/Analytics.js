/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import Topbar from "../topbar/Topbar";
import TotalIncomeChart from "./TotalIncomeChart";

const Analytics = () => {
  const [totalIncome, setTotalIncome] = useState();
  const axiosJWTHolder = useAxiosJWTHolder();

  useEffect(() => {
    const getTotalIncome = async () => {
      await axiosJWTHolder
        .get(`/analytics/total-income`)
        .then((res) => {
          var copy = [...res?.data];
          for (let i = 0; i < copy.length; i++) {
            copy[i][0] = new Date(new Date(copy[i][0]).getTime() + 86400000);
          }
          setTotalIncome(copy);
        })
        .catch((err) => {
          if (err?.response?.status === 403 || err?.response?.status === 401) {
            setTotalIncome("/login");
          }
        });
    };
    getTotalIncome();
  }, []);

  return (
    <>
      <div className="fixed-top">
        <Topbar />
      </div>
      <div className="page-container">
        {totalIncome ? (
          <TotalIncomeChart
            totalIncome={totalIncome}
            setTotalIncome={setTotalIncome}
          />
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
