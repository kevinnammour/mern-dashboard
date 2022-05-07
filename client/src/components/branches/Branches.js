/* eslint-disable react-hooks/exhaustive-deps */
import Topbar from "../topbar/Topbar";
import { Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBranch from "./AddBranch";
import useAxiosJWTHolder from "../../hooks/useAxiosJWTHolder";
import Dropdown from "../dropdown/Dropdown";
import useAuth from "../../hooks/useAuth";
import BranchInfo from "./BranchInfo";
import BrancheIncome from "./BranchIncome";

const Branches = () => {
  const [selected, setSelected] = useState("");
  const [branchInfo, setBranchInfo] = useState();
  const [branchIncome, setBranchIncome] = useState();
  const [render, setRender] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const axiosJWTHolder = useAxiosJWTHolder();
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const getBranchInformation = async () => {
      if (selected !== "") {
        Promise.all([
          axiosJWTHolder.get(`/branches/${selected}`),
          axiosJWTHolder.get(`/analytics/branch-income/${selected}`),
        ])
          .then(async ([res1, res2]) => {
            setBranchInfo(res1?.data);
            setBranchIncome(res2?.data);
            setRender(true);
          })
          .catch((err) => {
            if (
              err?.response?.status === 403 ||
              err?.response?.status === 401
            ) {
              navigate("/login");
            }
          });
      }
    };
    getBranchInformation();
  }, [selected]);

  return (
    <>
      <div className="fixed-top">
        <Topbar />
        <div className="wrapper box-shadow-low">
          <Dropdown
            selected={selected}
            setSelected={setSelected}
            forceUpdate={forceUpdate}
          />
          {auth?.role === "Admin" ? (
            <AddBranch
              forceUpdate={forceUpdate}
              setForceUpdate={setForceUpdate}
            />
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="page-container">
        {render ? (
          <>
            <BrancheIncome branchIncome={branchIncome} />
            <br />
            <br />
            <BranchInfo branchInfo={branchInfo} setBranchInfo={setBranchInfo} />
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

export default Branches;
